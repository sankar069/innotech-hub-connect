/* eslint-env node */
// api/payments.js
// API endpoints for payment proof operations

import {
  getEventPaymentProofsFromDb,
  getPaymentProofByRegistrationFromDb,
  createPaymentProofInDb,
  updatePaymentStatusInDb,
  getUserPaymentProofForEventFromDb,
  getPendingPaymentProofsFromDb,
} from '../src/lib/db/paymentService.js'

function send(res, statusCode, body) {
  res.status(statusCode).json(body)
}

export default async function handler(req, res) {
  try {
    const { method } = req
    const { eventId, registrationId, id, userId } = req.query

    if (method === 'GET') {
      // Get payment proofs for event
      if (eventId) {
        const proofs = await getEventPaymentProofsFromDb(eventId)
        return send(res, 200, proofs)
      }

      // Get payment proof by registration
      if (registrationId) {
        const proof = await getPaymentProofByRegistrationFromDb(registrationId)
        if (!proof) {
          return send(res, 404, { error: 'Payment proof not found' })
        }
        return send(res, 200, proof)
      }

      // Get pending payments (optionally filtered by event)
      if (req.query.pending === 'true') {
        const pending = await getPendingPaymentProofsFromDb(eventId)
        return send(res, 200, pending)
      }

      // Get user's payment for event
      if (userId && eventId) {
        const proof = await getUserPaymentProofForEventFromDb(userId, eventId)
        return send(res, 200, proof || null)
      }

      return send(res, 400, { error: 'Missing required parameters' })
    }

    if (method === 'POST') {
      const { eventId: eventIdBody, registrationId: regIdBody, userId: userIdBody, proofImageUrl, amount, transactionId } = req.body

      const payment = await createPaymentProofInDb({
        eventId: eventIdBody,
        registrationId: regIdBody,
        userId: userIdBody,
        proofImageUrl,
        amount,
        transactionId,
      })

      return send(res, 201, payment)
    }

    if (method === 'PUT') {
      const { id: paymentId } = req.query
      const { status, rejectionReason, verifiedBy } = req.body

      const payment = await updatePaymentStatusInDb(paymentId, status, {
        rejectionReason,
        verifiedBy,
      })

      return send(res, 200, payment)
    }

    return send(res, 405, { error: 'Method not allowed' })
  } catch (error) {
    console.error('Payment API error:', error)
    return send(res, 500, { error: error.message || 'Internal server error' })
  }
}
