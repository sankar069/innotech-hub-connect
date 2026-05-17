import { getAuthUser } from "@/lib/auth";
import { getCmsCollection, saveCmsCollection, sortActive, type CmsItem } from "@/lib/cms";

export const eventCategories = [
  "Hackathons",
  "Workshops",
  "Seminars",
  "Webinars",
  "AI Conferences",
  "Summits",
  "Tech Podcasts",
  "Tech Carnivals",
];

export const eventStatuses = [
  "Draft",
  "Published",
  "Registration Open",
  "Registration Closed",
  "Ongoing",
  "Completed",
  "Cancelled",
];

export const eventTypes = ["Online", "Offline", "Hybrid"];
export const paymentTypes = ["Free Event", "Paid Event"];
export const participationModes = ["Individual", "Team", "Individual or Team"];

export type EventItem = CmsItem & {
  title: string;
  slug: string;
  category: string;
  type: string;
  participationMode: string;
  shortDescription: string;
  fullDescription?: string;
  status: string;
  featured?: boolean;
  dates?: Record<string, string>;
  location?: Record<string, string>;
  media?: Record<string, string>;
  rounds?: Array<Record<string, unknown>>;
  rules?: Record<string, string>;
  rewards?: Record<string, string>;
  contact?: Record<string, string>;
  payment?: Record<string, unknown>;
};

export type EventRegistration = CmsItem & {
  eventId: string;
  eventSlug: string;
  studentEmail: string;
  studentName: string;
  studentDetails: Record<string, string>;
  teamDetails: Record<string, unknown>;
  paymentDetails: Record<string, string | number>;
  agreement: Record<string, boolean>;
  registrationStatus: string;
  paymentStatus: string;
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentProof = CmsItem & {
  registrationId: string;
  eventId: string;
  studentId: string;
  amount: number | string;
  transactionId: string;
  senderName: string;
  paymentDate: string;
  screenshotUrl: string;
  status: string;
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
};

export function getEvents() {
  return (getCmsCollection<EventItem>("events") || []).sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
}

export function getPublicEvents() {
  return sortActive(getEvents()).filter((event) => event.status !== "Draft" && event.status !== "Cancelled");
}

export function getEventBySlug(slug: string) {
  return getEvents().find((event) => event.slug === slug);
}

export function getEventById(id: string) {
  return getEvents().find((event) => event.id === id);
}

export function saveEvents(events: EventItem[]) {
  saveCmsCollection("events", events);
}

export function getRegistrations() {
  return (getCmsCollection<EventRegistration>("eventRegistrations") || []).sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));
}

export function saveRegistrations(registrations: EventRegistration[]) {
  saveCmsCollection("eventRegistrations", registrations);
}

export function getPaymentProofs() {
  return (getCmsCollection<PaymentProof>("paymentProofs") || []).sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));
}

export function savePaymentProofs(proofs: PaymentProof[]) {
  saveCmsCollection("paymentProofs", proofs);
}

export function getMyRegistrations() {
  const user = getAuthUser();
  if (!user) return [];
  return getRegistrations().filter((registration) => registration.studentEmail === user.email);
}

export function getRegistrationForEvent(eventId: string) {
  const user = getAuthUser();
  if (!user) return undefined;
  return getRegistrations().find((registration) => registration.eventId === eventId && registration.studentEmail === user.email);
}

export function getRegistrationStatus(event: EventItem) {
  if (event.status === "Registration Closed" || event.status === "Completed" || event.status === "Cancelled") return "Registration Closed";
  const endDate = event.dates?.registrationEndDate;
  if (endDate && new Date(`${endDate}T${event.dates?.registrationEndTime || "23:59"}`) < new Date()) return "Registration Closed";
  return "Registration Open";
}

export function submitRegistration(event: EventItem, payload: Omit<EventRegistration, "id" | "eventId" | "eventSlug" | "registrationStatus" | "paymentStatus" | "createdAt" | "updatedAt">) {
  const isPaid = event.payment?.type === "Paid Event";
  const now = new Date().toISOString();
  const registration: EventRegistration = {
    ...payload,
    id: crypto.randomUUID(),
    eventId: event.id,
    eventSlug: event.slug,
    registrationStatus: isPaid ? "Pending Review" : "Approved",
    paymentStatus: isPaid ? "Under Review" : "Not Required",
    createdAt: now,
    updatedAt: now,
    active: true,
    order: Date.now(),
  };

  saveRegistrations([registration, ...getRegistrations()]);

  if (isPaid) {
    saveCmsCollection("paymentProofs", [
      {
        id: crypto.randomUUID(),
        registrationId: registration.id,
        eventId: event.id,
        studentId: registration.studentEmail,
        amount: event.payment?.amount ?? 0,
        transactionId: registration.paymentDetails.transactionId,
        senderName: registration.paymentDetails.senderName,
        paymentDate: registration.paymentDetails.paymentDate,
        screenshotUrl: registration.paymentDetails.screenshotUrl,
        status: "Under Review",
        adminRemarks: "",
        createdAt: now,
        updatedAt: now,
        active: true,
        order: Date.now(),
      },
      ...getCmsCollection("paymentProofs"),
    ]);
  }

  return registration;
}

export function updateRegistrationStatus(id: string, patch: Partial<EventRegistration>) {
  saveRegistrations(getRegistrations().map((registration) => (
    registration.id === id ? { ...registration, ...patch, updatedAt: new Date().toISOString() } : registration
  )));
}

export function updatePaymentProof(id: string, patch: Partial<PaymentProof>) {
  savePaymentProofs(getPaymentProofs().map((proof) => (
    proof.id === id ? { ...proof, ...patch, updatedAt: new Date().toISOString() } : proof
  )));
}

export function registrationsToCsv(registrations: EventRegistration[]) {
  const rows = [
    ["Student Name", "Email", "Phone", "College", "Department", "Year", "Registration Status", "Payment Status", "Submitted"],
    ...registrations.map((registration) => [
      registration.studentName,
      registration.studentEmail,
      registration.studentDetails.phone ?? "",
      registration.studentDetails.college ?? "",
      registration.studentDetails.department ?? "",
      registration.studentDetails.year ?? "",
      registration.registrationStatus,
      registration.paymentStatus,
      registration.createdAt,
    ]),
  ];
  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}
