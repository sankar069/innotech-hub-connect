export type AuthRole = "student" | "admin";

export type AuthUser = {
  name: string;
  email: string;
  role: AuthRole;
  college?: string;
  phone?: string;
};

type StoredStudent = AuthUser & {
  password: string;
};

const AUTH_KEY = "innotech-auth-user";
const STUDENTS_KEY = "innotech-student-users";
const ADMIN_EMAIL = "admin@innotechhub.com";
const ADMIN_PASSWORD = "Admin@123";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function emitAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("innotech-auth-change"));
  }
}

function readStudents(): StoredStudent[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(STUDENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStudents(students: StoredStudent[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function getAuthUser(): AuthUser | null {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getDashboardPath(user = getAuthUser()) {
  if (!user) return "/auth";
  return user.role === "admin" ? "/admin/dashboard" : "/student/dashboard";
}

export function logout() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(AUTH_KEY);
  emitAuthChange();
}

export function signIn(email: string, password: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();

  // Phase 1 placeholder only. Replace this branch with backend-backed admin auth later.
  if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const admin: AuthUser = {
      name: "InnoTech-Hub Admin",
      email: ADMIN_EMAIL,
      role: "admin",
    };
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(admin));
    emitAuthChange();
    return admin;
  }

  const student = readStudents().find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
  );

  if (!student) {
    throw new Error("Invalid email or password");
  }

  const authUser: AuthUser = {
    name: student.name,
    email: student.email,
    role: "student",
    college: student.college,
    phone: student.phone,
  };

  window.localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
  emitAuthChange();
  return authUser;
}

export function signUp(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  college: string;
  role: string;
  phone: string;
}): AuthUser {
  const normalizedEmail = data.email.trim().toLowerCase();

  if (!data.name || !normalizedEmail || !data.password || !data.college || !data.role || !data.phone) {
    throw new Error("Please fill all required fields");
  }

  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (normalizedEmail === ADMIN_EMAIL || readStudents().some((item) => item.email.toLowerCase() === normalizedEmail)) {
    throw new Error("An account already exists for this email");
  }

  // Phase 1 placeholder only. Student passwords are stored locally until backend auth is connected.
  const student: StoredStudent = {
    name: data.name.trim(),
    email: normalizedEmail,
    password: data.password,
    role: "student",
    college: data.college.trim(),
    phone: data.phone.trim(),
  };

  writeStudents([...readStudents(), student]);

  const authUser: AuthUser = {
    name: student.name,
    email: student.email,
    role: "student",
    college: student.college,
    phone: student.phone,
  };

  window.localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
  emitAuthChange();
  return authUser;
}
