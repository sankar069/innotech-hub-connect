/* eslint-env node */
// api/db-health.js
// Database health check endpoint

import { prisma } from '../src/lib/db/prisma.js'

function send(res, statusCode, body) {
  res.status(statusCode).json(body)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return send(res, 405, { error: 'Method not allowed' })
  }

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`

    const stats = {
      status: 'connected',
      timestamp: new Date().toISOString(),
      message: 'Database is healthy',
    }

    return send(res, 200, stats)
  } catch (error) {
    console.error('Database health check failed:', error)
    return send(res, 500, {
      status: 'disconnected',
      timestamp: new Date().toISOString(),
      error: error.message || 'Database connection failed',
    })
  }
}
