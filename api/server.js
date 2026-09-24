import { app } from '../server/index.mjs'

// Vercel serverless entry: the deployed /api/* rewrites point here. The Express
// app keeps its original /api/... routes; on the rare case Vercel forwards the
// function path (/api/server) instead of the request path, strip it.
export default function handler(req, res) {
  const url = req.url || ''
  if (url.startsWith('/api/server')) {
    req.url = url.slice('/api/server'.length) || '/'
  }
  return app(req, res)
}