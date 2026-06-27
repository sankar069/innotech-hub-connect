// src/lib/db/ticketService.ts
// Database operations for event tickets

import { prisma } from './prisma'

/**
 * Get ticket by registration
 */
export async function getTicketByRegistrationFromDb(registrationId: string) {
  return prisma.ticket.findUnique({
    where: { registrationId },
    include: {
      registration: true,
      user: true,
      event: {
        select: {
          id: true,
          slug: true,
          title: true,
          startDate: true,
        },
      },
    },
  })
}

/**
 * Get user's tickets
 */
export async function getUserTicketsFromDb(userId: string) {
  return prisma.ticket.findMany({
    where: { userId },
    include: {
      event: {
        select: {
          id: true,
          slug: true,
          title: true,
          startDate: true,
        },
      },
    },
    orderBy: { issuedAt: 'desc' },
  })
}

/**
 * Create ticket
 */
export async function createTicketInDb(data: {
  eventId: string
  registrationId: string
  userId: string
  ticketNumber: string
  qrCode?: string
  expiresAt?: Date
}) {
  return prisma.ticket.create({
    data: {
      eventId: data.eventId,
      registrationId: data.registrationId,
      userId: data.userId,
      ticketNumber: data.ticketNumber,
      qrCode: data.qrCode,
      expiresAt: data.expiresAt,
      status: 'ACTIVE',
    },
  })
}

/**
 * Update ticket status
 */
export async function updateTicketStatusInDb(
  ticketId: string,
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED'
) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status,
      usedAt: status === 'USED' ? new Date() : undefined,
    },
  })
}
