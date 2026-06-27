// src/lib/db/paymentService.ts
// Database operations for payment proofs

import { prisma } from './prisma'

/**
 * Get all payment proofs for an event
 */
export async function getEventPaymentProofsFromDb(eventId: string) {
  return prisma.paymentProof.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      registration: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get payment proof by registration
 */
export async function getPaymentProofByRegistrationFromDb(registrationId: string) {
  return prisma.paymentProof.findUnique({
    where: { registrationId },
    include: {
      user: true,
      registration: true,
      event: true,
    },
  })
}

/**
 * Create payment proof
 */
export async function createPaymentProofInDb(data: {
  eventId: string
  registrationId: string
  userId: string
  proofImageUrl: string
  amount: number | string
  transactionId?: string
}) {
  return prisma.paymentProof.create({
    data: {
      eventId: data.eventId,
      registrationId: data.registrationId,
      userId: data.userId,
      proofImageUrl: data.proofImageUrl,
      amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
      transactionId: data.transactionId,
      status: 'PENDING',
    },
  })
}

/**
 * Update payment status
 */
export async function updatePaymentStatusInDb(
  proofId: string,
  status: 'VERIFIED' | 'REJECTED' | 'PENDING' | 'DISPUTED',
  options?: {
    rejectionReason?: string
    verifiedBy?: string
  }
) {
  return prisma.paymentProof.update({
    where: { id: proofId },
    data: {
      status,
      rejectionReason: options?.rejectionReason,
      verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
      verifiedBy: options?.verifiedBy,
    },
  })
}

/**
 * Get user's payment proofs for an event
 */
export async function getUserPaymentProofForEventFromDb(userId: string, eventId: string) {
  return prisma.paymentProof.findFirst({
    where: {
      userId,
      eventId,
    },
  })
}

/**
 * Get pending payment proofs
 */
export async function getPendingPaymentProofsFromDb(eventId?: string) {
  return prisma.paymentProof.findMany({
    where: {
      status: 'PENDING',
      ...(eventId && { eventId }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      registration: true,
    },
    orderBy: { createdAt: 'asc' },
  })
}
