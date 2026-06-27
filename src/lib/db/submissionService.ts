// src/lib/db/submissionService.ts
// Database operations for event submissions

import { prisma } from './prisma'

/**
 * Get submissions for an event
 */
export async function getEventSubmissionsFromDb(eventId: string) {
  return prisma.submission.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      team: true,
      roundSubmissions: {
        include: {
          round: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get user's submissions for an event
 */
export async function getUserEventSubmissionsFromDb(userId: string, eventId: string) {
  return prisma.submission.findMany({
    where: {
      userId,
      eventId,
    },
    include: {
      roundSubmissions: {
        include: {
          round: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get submission by registration
 */
export async function getSubmissionByRegistrationFromDb(registrationId: string) {
  return prisma.submission.findUnique({
    where: { registrationId },
    include: {
      roundSubmissions: {
        include: {
          round: true,
        },
      },
    },
  })
}

/**
 * Create submission
 */
export async function createSubmissionInDb(data: {
  eventId: string
  registrationId?: string
  userId: string
  teamId?: string
  title: string
  description?: string
  answers?: Record<string, any>
  fileUrls?: string[]
}) {
  return prisma.submission.create({
    data: {
      eventId: data.eventId,
      registrationId: data.registrationId,
      userId: data.userId,
      teamId: data.teamId,
      title: data.title,
      description: data.description,
      answers: data.answers ? JSON.stringify(data.answers) : undefined,
      fileUrls: data.fileUrls || [],
      status: 'SUBMITTED',
    },
  })
}

/**
 * Update submission
 */
export async function updateSubmissionInDb(
  submissionId: string,
  data: Partial<any>
) {
  return prisma.submission.update({
    where: { id: submissionId },
    data: {
      ...data,
      answers: data.answers ? JSON.stringify(data.answers) : undefined,
    },
  })
}

/**
 * Update submission status
 */
export async function updateSubmissionStatusInDb(
  submissionId: string,
  status: string,
  options?: {
    score?: number
    feedback?: string
  }
) {
  return prisma.submission.update({
    where: { id: submissionId },
    data: {
      status,
      score: options?.score ? parseFloat(options.score.toString()) : undefined,
      feedback: options?.feedback,
    },
  })
}
