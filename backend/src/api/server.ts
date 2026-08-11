import { pathToFileURL } from 'node:url'
import Fastify from 'fastify'
import type { CheckTarget } from '../types/check.js'
import { verify } from '../verify.js'

/** Exported separately from the listen() call below so tests can build an app and use fastify's inject() without binding a real port. */
export function buildServer() {
  const app = Fastify({ logger: false })

  app.get('/health', async () => ({ ok: true }))

  app.post<{ Body: CheckTarget }>('/verify', async (request, reply) => {
    const target = request.body ?? {}
    const report = await verify(target)
    return reply.send(report)
  })

  return app
}

const isMainModule = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (isMainModule) {
  const app = buildServer()
  const port = Number(process.env.PORT ?? 8787)
  app
    .listen({ port, host: '0.0.0.0' })
    .then(() => console.log(`Aegis API listening on :${port}`))
    .catch((err) => {
      app.log.error(err)
      process.exit(1)
    })
}
