/* eslint-env node */
// api/users.js
// API endpoints for user operations

import {
  getUserByIdFromDb,
  getUserByEmailFromDb,
  createUserInDb,
  updateUserInDb,
  getStudentProfileFromDb,
  upsertStudentProfileInDb,
} from '../src/lib/db/userService.js'

function send(res, statusCode, body) {
  res.status(statusCode).json(body)
}

export default async function handler(req, res) {
  try {
    const { method } = req
    const { id, email } = req.query

    if (method === 'GET') {
      // Get user by ID
      if (id) {
        const user = await getUserByIdFromDb(id)
        if (!user) {
          return send(res, 404, { error: 'User not found' })
        }
        return send(res, 200, user)
      }

      // Get user by email
      if (email) {
        const user = await getUserByEmailFromDb(email)
        if (!user) {
          return send(res, 404, { error: 'User not found' })
        }
        return send(res, 200, user)
      }

      return send(res, 400, { error: 'Missing required parameters' })
    }

    if (method === 'POST') {
      const { email: emailBody, password, name, phone, role } = req.body

      const user = await createUserInDb({
        email: emailBody,
        password, // Should be hashed before storing
        name,
        phone,
        role,
      })

      return send(res, 201, user)
    }

    if (method === 'PUT') {
      const { id: userId } = req.query
      const updates = req.body

      const user = await updateUserInDb(userId, updates)
      return send(res, 200, user)
    }

    return send(res, 405, { error: 'Method not allowed' })
  } catch (error) {
    console.error('User API error:', error)
    return send(res, 500, { error: error.message || 'Internal server error' })
  }
}
