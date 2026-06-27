// src/lib/db/certificateService.ts
// Database operations for certificates

import { prisma } from './prisma'

/**
 * Get certificate by registration
 */
export async function getCertificateByRegistrationFromDb(registrationId: string) {
  return prisma.certificate.findUnique({
    where: { registrationId },
    include: {
      registration: true,
      user: true,
      event: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
    },
  })
}

/**
 * Get user's certificates
 */
export async function getUserCertificatesFromDb(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    include: {
      event: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
    },
    orderBy: { issuedAt: 'desc' },
  })
}

/**
 * Get certificate by certificate number
 */
export async function getCertificateByCertificateNumberFromDb(certificateNumber: string) {
  return prisma.certificate.findUnique({
    where: { certificateNumber },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      event: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
    },
  })
}

/**
 * Create certificate
 */
export async function createCertificateInDb(data: {
  eventId: string
  registrationId: string
  userId: string
  certificateNumber: string
  certificateUrl?: string
  expiresAt?: Date
}) {
  return prisma.certificate.create({
    data: {
      eventId: data.eventId,
      registrationId: data.registrationId,
      userId: data.userId,
      certificateNumber: data.certificateNumber,
      certificateUrl: data.certificateUrl,
      expiresAt: data.expiresAt,
      status: 'ISSUED',
    },
  })
}

/**
 * Update certificate status
 */
export async function updateCertificateStatusInDb(
  certificateId: string,
  status: 'DRAFT' | 'ISSUED' | 'REVOKED'
) {
  return prisma.certificate.update({
    where: { id: certificateId },
    data: { status },
  })
}
