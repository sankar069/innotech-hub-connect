// src/lib/db/registrationService.ts
// Database operations for event registrations

import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

/**
 * Get all registrations for an event
 */
export async function getEventRegistrationsFromDb(eventId: string) {
  return prisma.eventRegistration.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      team: true,
      paymentProof: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get registrations for a user
 */
export async function getUserRegistrationsFromDb(userId: string) {
  return prisma.eventRegistration.findMany({
    where: { userId },
    include: {
      event: {
        select: {
          id: true,
          slug: true,
          title: true,
          startDate: true,
          bannerImage: true,
        },
      },
      paymentProof: true,
      ticket: true,
      certificate: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get a specific registration
 */
export async function getRegistrationByIdFromDb(registrationId: string) {
  return prisma.eventRegistration.findUnique({
    where: { id: registrationId },
    include: {
      event: true,
      user: true,
      team: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
      paymentProof: true,
      submission: {
        include: {
          roundSubmissions: true,
        },
      },
      ticket: true,
      certificate: true,
    },
  })
}

/**
 * Check if user is already registered for event
 */
export async function isUserRegisteredForEvent(
  userId: string,
  eventId: string
): Promise<boolean> {
  const registration = await prisma.eventRegistration.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
  })
  return !!registration
}

/**
 * Create a new registration
 */
export async function createRegistrationInDb(data: {
  eventId: string
  userId: string
  answers: Record<string, any>
  teamId?: string
}) {
  // Check for duplicate
  const existing = await isUserRegisteredForEvent(data.userId, data.eventId)
  if (existing) {
    throw new Error('User is already registered for this event')
  }

  return prisma.eventRegistration.create({
    data: {
      eventId: data.eventId,
      userId: data.userId,
      answers: JSON.stringify(data.answers),
      teamId: data.teamId,
      status: 'SUBMITTED',
    },
    include: {
      event: true,
      user: true,
    },
  })
}

/**
 * Update registration status
 */
export async function updateRegistrationStatusInDb(
  registrationId: string,
  status: string
) {
  return prisma.eventRegistration.update({
    where: { id: registrationId },
    data: { status },
  })
}

/**
 * Update registration answers
 */
export async function updateRegistrationAnswersInDb(
  registrationId: string,
  answers: Record<string, any>
) {
  return prisma.eventRegistration.update({
    where: { id: registrationId },
    data: {
      answers: JSON.stringify(answers),
    },
  })
}

/**
 * Delete a registration
 */
export async function deleteRegistrationInDb(registrationId: string) {
  return prisma.eventRegistration.delete({
    where: { id: registrationId },
  })
}

/**
 * Get registration count for event
 */
export async function getEventRegistrationCountFromDb(eventId: string) {
  return prisma.eventRegistration.count({
    where: { eventId },
  })
}
