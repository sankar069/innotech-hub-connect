import { getAuthUser } from "@/lib/auth";
import { getCmsCollection, saveCmsCollection, type CmsItem } from "@/lib/cms";
import { getEvents, getRegistrations, type EventRegistration } from "@/lib/events";

export type StudentProfile = CmsItem & {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  rollNumber?: string;
  department?: string;
  year?: string;
  city?: string;
  state?: string;
  profilePhoto?: string;
  skills?: string;
  interests?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  resumeUrl?: string;
  bio?: string;
  hackathons?: string;
  projects?: string;
  workshops?: string;
  preferredCategories?: string;
  profileCompletion?: number;
  updatedAt?: string;
};

export type Certificate = CmsItem & {
  certificateId: string;
  eventId: string;
  studentId: string;
  registrationId: string;
  studentName: string;
  eventTitle: string;
  certificateType: string;
  issueDate: string;
  status: "Issued" | "Revoked" | "Pending";
  verificationUrl: string;
};

export type NotificationItem = CmsItem & {
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  actionLink?: string;
  createdAt: string;
};

export type Submission = CmsItem & {
  eventId: string;
  roundId: string;
  studentId: string;
  registrationId: string;
  projectTitle: string;
  projectDescription: string;
  githubLink: string;
  demoVideoLink: string;
  pptLink: string;
  liveProjectLink: string;
  projectFile?: string;
  pptFile?: string;
  supportingDocument?: string;
  status: "Submitted" | "Reviewed" | "Shortlisted" | "Rejected";
  adminNote?: string;
  createdAt: string;
};

export function calculateProfileCompletion(profile: Partial<StudentProfile>) {
  const fields = ["name", "email", "phone", "college", "rollNumber", "department", "year", "city", "state", "skills", "interests", "linkedIn", "github", "portfolio", "resumeUrl", "bio", "preferredCategories"];
  const filled = fields.filter((field) => Boolean(String(profile[field as keyof StudentProfile] ?? "").trim())).length;
  return Math.round((filled / fields.length) * 100);
}

export function getStudentProfiles() {
  return getCmsCollection<StudentProfile>("studentProfiles");
}

export function getCurrentStudentProfile() {
  const user = getAuthUser();
  if (!user) return null;
  return getStudentProfiles().find((profile) => profile.email === user.email) ?? {
    id: user.email,
    userId: user.email,
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    college: user.college ?? "",
    active: true,
    order: 1,
    profileCompletion: calculateProfileCompletion(user as Partial<StudentProfile>),
  };
}

export function saveStudentProfile(profile: StudentProfile) {
  const next = { ...profile, profileCompletion: calculateProfileCompletion(profile), updatedAt: new Date().toISOString() };
  const existing = getStudentProfiles();
  saveCmsCollection("studentProfiles", existing.some((item) => item.email === next.email) ? existing.map((item) => item.email === next.email ? next : item) : [next, ...existing]);
  return next;
}

export function getCertificates() {
  return getCmsCollection<Certificate>("certificates");
}

export function saveCertificates(items: Certificate[]) {
  saveCmsCollection("certificates", items);
}

export function getMyCertificates(email = getAuthUser()?.email) {
  if (!email) return [];
  return getCertificates().filter((item) => item.studentId === email && item.status === "Issued");
}

export function issueCertificate(registration: EventRegistration, type = "Participation") {
  const event = getEvents().find((item) => item.id === registration.eventId);
  const certificateId = `ITH-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const certificate: Certificate = {
    id: crypto.randomUUID(),
    certificateId,
    eventId: registration.eventId,
    studentId: registration.studentEmail,
    registrationId: registration.id,
    studentName: registration.studentName,
    eventTitle: event?.title ?? registration.eventSlug,
    certificateType: type,
    issueDate: new Date().toISOString().slice(0, 10),
    status: "Issued",
    verificationUrl: `/certificate/verify/${certificateId}`,
    active: true,
    order: Date.now(),
  };
  saveCertificates([certificate, ...getCertificates()]);
  return certificate;
}

export function getNotifications() {
  return getCmsCollection<NotificationItem>("notifications").sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export function saveNotifications(items: NotificationItem[]) {
  saveCmsCollection("notifications", items);
}

export function getMyNotifications(email = getAuthUser()?.email) {
  if (!email) return [];
  return getNotifications().filter((item) => item.userId === email || item.userId === "all-students");
}

export function createNotification(input: Omit<NotificationItem, "id" | "createdAt" | "read" | "active" | "order">) {
  const item: NotificationItem = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false, active: true, order: Date.now() };
  saveNotifications([item, ...getNotifications()]);
  return item;
}

export function getSubmissions() {
  return getCmsCollection<Submission>("submissions").sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export function saveSubmissions(items: Submission[]) {
  saveCmsCollection("submissions", items);
}

export function getMySubmissions(email = getAuthUser()?.email) {
  if (!email) return [];
  return getSubmissions().filter((item) => item.studentId === email);
}

export function getStudentStats(email = getAuthUser()?.email) {
  const registrations = email ? getRegistrations().filter((item) => item.studentEmail === email) : [];
  const events = getEvents();
  const certs = getMyCertificates(email);
  const profile = getStudentProfiles().find((item) => item.email === email);
  return {
    registered: registrations.length,
    upcoming: registrations.filter((registration) => new Date(`${events.find((event) => event.id === registration.eventId)?.dates?.eventStartDate ?? "2999-01-01"}T00:00`) >= new Date()).length,
    completed: registrations.filter((registration) => events.find((event) => event.id === registration.eventId)?.status === "Completed").length,
    certificates: certs.length,
    paymentsPending: registrations.filter((registration) => ["Pending Upload", "Under Review", "Rejected"].includes(registration.paymentStatus)).length,
    achievements: certs.length + registrations.filter((registration) => registration.registrationStatus === "Approved").length,
    skillsAdded: String(profile?.skills ?? "").split(",").map((item) => item.trim()).filter(Boolean).length,
    profileCompletion: profile?.profileCompletion ?? calculateProfileCompletion(profile ?? {}),
  };
}
