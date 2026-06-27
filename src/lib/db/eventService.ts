// src/lib/db/eventService.ts
// Database operations for events

import { prisma } from './prisma'
import type {
  Event,
  EventStatus,
  EventCreateInput,
  EventUpdateInput,
} from '@prisma/client'

/**
 * Get all events with optional filters
 */
export async function getEventsFromDb(filters?: {
  status?: EventStatus
  createdById?: string
}): Promise<Event[]> {
  const where = filters || {}
  return prisma.event.findMany({
    where,
    orderBy: { startDate: 'asc' },
  })
}

/**
 * Get public (published) events
 */
export async function getPublicEventsFromDb(): Promise<Event[]> {
  return prisma.event.findMany({
    where: {
      status: {
        in: ['ACTIVE', 'REGISTRATION_OPEN', 'IN_PROGRESS', 'COMPLETED'],
      },
    },
    orderBy: { startDate: 'asc' },
  })
}

/**
 * Get event by ID
 */
export async function getEventByIdFromDb(eventId: string): Promise<Event | null> {
  return prisma.event.findUnique({
    where: { id: eventId },
  })
}

/**
 * Get event by slug
 */
export async function getEventBySlugFromDb(slug: string): Promise<Event | null> {
  return prisma.event.findUnique({
    where: { slug },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

/**
 * Create a new event
 */
export async function createEventInDb(data: {
  slug: string
  title: string
  description?: string
  createdById: string
  startDate: Date
  endDate: Date
  registrationType?: 'INDIVIDUAL' | 'TEAM' | 'BOTH'
  [key: string]: any
}): Promise<Event> {
  return prisma.event.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      registrationType: data.registrationType || 'INDIVIDUAL',
      createdById: data.createdById,
      status: 'DRAFT',
      // Additional fields
      ...Object.fromEntries(
        Object.entries(data).filter(
          ([key]) =>
            ![
              'slug',
              'title',
              'description',
              'startDate',
              'endDate',
              'registrationType',
              'createdById',
            ].includes(key)
        )
      ),
    },
  })
}

/**
 * Update an event
 */
export async function updateEventInDb(
  eventId: string,
  data: Partial<Event> & { [key: string]: any }
): Promise<Event> {
  return prisma.event.update({
    where: { id: eventId },
    data,
  })
}

/**
 * Delete an event
 */
export async function deleteEventInDb(eventId: string): Promise<Event> {
  return prisma.event.delete({
    where: { id: eventId },
  })
}

/**
 * Change event status
 */
export async function updateEventStatusInDb(
  eventId: string,
  status: EventStatus
): Promise<Event> {
  return prisma.event.update({
    where: { id: eventId },
    data: { status },
  })
}
