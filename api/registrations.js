/* eslint-env node */
// api/registrations.js
// API endpoints for event registration operations

import {
  getEventRegistrationsFromDb,
  getUserRegistrationsFromDb,
  getRegistrationByIdFromDb,
  isUserRegisteredForEvent,
  createRegistrationInDb,
  updateRegistrationStatusInDb,
  updateRegistrationAnswersInDb,
  deleteRegistrationInDb,
} from '../src/lib/db/registrationService.js'

function send(res, statusCode, body) {
  res.status(statusCode).json(body)
}

export default async function handler(req, res) {
  try {
    const { method } = req
    const { eventId, userId, id } = req.query

    if (method === 'GET') {
      // Get registrations for specific event
      if (eventId) {
        const registrations = await getEventRegistrationsFromDb(eventId)
        return send(res, 200, registrations)
      }

      // Get registrations for specific user
      if (userId) {
        const registrations = await getUserRegistrationsFromDb(userId)
        return send(res, 200, registrations)
      }

      // Get specific registration
      if (id) {
        const registration = await getRegistrationByIdFromDb(id)
        if (!registration) {
          return send(res, 404, { error: 'Registration not found' })
        }
        return send(res, 200, registration)
      }

      return send(res, 400, { error: 'Missing required parameters' })
    }

    if (method === 'POST') {
      const { eventId: eventIdBody, userId: userIdBody, answers, teamId } = req.body

      // Check if already registered
      if (await isUserRegisteredForEvent(userIdBody, eventIdBody)) {
        return send(res, 409, {
          success: false,
          code: 'ALREADY_REGISTERED',
          message: 'User is already registered for this event',
        })
      }

      const registration = await createRegistrationInDb({
        eventId: eventIdBody,
        userId: userIdBody,
        answers,
        teamId,
      })

      return send(res, 201, registration)
    }

    if (method === 'PUT') {
      const { id: registrationId } = req.query
      const { status, answers } = req.body

      if (status) {
        const registration = await updateRegistrationStatusInDb(registrationId, status)
        return send(res, 200, registration)
      }

      if (answers) {
        const registration = await updateRegistrationAnswersInDb(registrationId, answers)
        return send(res, 200, registration)
      }

      return send(res, 400, { error: 'No updates provided' })
    }

    if (method === 'DELETE') {
      const { id: registrationId } = req.query
      await deleteRegistrationInDb(registrationId)
      return send(res, 200, { success: true })
    }

    return send(res, 405, { error: 'Method not allowed' })
  } catch (error) {
    console.error('Registration API error:', error)
    return send(res, 500, { error: error.message || 'Internal server error' })
  }
}
