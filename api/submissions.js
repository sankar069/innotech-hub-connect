/* eslint-env node */
// api/submissions.js
// API endpoints for submission operations

import {
  getEventSubmissionsFromDb,
  getUserEventSubmissionsFromDb,
  getSubmissionByRegistrationFromDb,
  createSubmissionInDb,
  updateSubmissionInDb,
  updateSubmissionStatusInDb,
} from '../src/lib/db/submissionService.js'

function send(res, statusCode, body) {
  res.status(statusCode).json(body)
}

export default async function handler(req, res) {
  try {
    const { method } = req
    const { eventId, userId, registrationId, id } = req.query

    if (method === 'GET') {
      // Get submissions for event
      if (eventId) {
        const submissions = await getEventSubmissionsFromDb(eventId)
        return send(res, 200, submissions)
      }

      // Get user's submissions for event
      if (userId && eventId) {
        const submissions = await getUserEventSubmissionsFromDb(userId, eventId)
        return send(res, 200, submissions)
      }

      // Get submission by registration
      if (registrationId) {
        const submission = await getSubmissionByRegistrationFromDb(registrationId)
        if (!submission) {
          return send(res, 404, { error: 'Submission not found' })
        }
        return send(res, 200, submission)
      }

      return send(res, 400, { error: 'Missing required parameters' })
    }

    if (method === 'POST') {
      const { eventId: eventIdBody, userId: userIdBody, registrationId: regIdBody, teamId: teamIdBody, title, description, answers, fileUrls } = req.body

      const submission = await createSubmissionInDb({
        eventId: eventIdBody,
        registrationId: regIdBody,
        userId: userIdBody,
        teamId: teamIdBody,
        title,
        description,
        answers,
        fileUrls,
      })

      return send(res, 201, submission)
    }

    if (method === 'PUT') {
      const { id: submissionId } = req.query
      const { status, score, feedback, ...updates } = req.body

      if (status) {
        const submission = await updateSubmissionStatusInDb(submissionId, status, {
          score,
          feedback,
        })
        return send(res, 200, submission)
      }

      const submission = await updateSubmissionInDb(submissionId, updates)
      return send(res, 200, submission)
    }

    return send(res, 405, { error: 'Method not allowed' })
  } catch (error) {
    console.error('Submission API error:', error)
    return send(res, 500, { error: error.message || 'Internal server error' })
  }
}
