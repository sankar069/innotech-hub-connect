// src/lib/db/userService.ts
// Database operations for users

import { prisma } from './prisma'

/**
 * Get user by ID
 */
export async function getUserByIdFromDb(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
    },
  })
}

/**
 * Get user by email
 */
export async function getUserByEmailFromDb(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      studentProfile: true,
    },
  })
}

/**
 * Create a new user
 */
export async function createUserInDb(data: {
  email: string
  password: string // Should be hashed before passing
  name: string
  phone?: string
  role?: 'ADMIN' | 'STUDENT' | 'VOLUNTEER'
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: data.role || 'STUDENT',
    },
  })
}

/**
 * Update user
 */
export async function updateUserInDb(userId: string, data: Partial<any>) {
  return prisma.user.update({
    where: { id: userId },
    data,
  })
}

/**
 * Get all admins
 */
export async function getAdminsFromDb() {
  return prisma.user.findMany({
    where: { role: 'ADMIN' },
  })
}

/**
 * Get student profile
 */
export async function getStudentProfileFromDb(userId: string) {
  return prisma.studentProfile.findUnique({
    where: { userId },
  })
}

/**
 * Update or create student profile
 */
export async function upsertStudentProfileInDb(
  userId: string,
  data: {
    collegeName?: string
    yearOfStudy?: string
    branch?: string
    skills?: string[]
    bio?: string
    socialLinks?: string
    passportImage?: string
  }
) {
  return prisma.studentProfile.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: data,
  })
}
