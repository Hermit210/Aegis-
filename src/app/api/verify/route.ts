import { NextRequest, NextResponse } from 'next/server'
import { verify } from '../../../../backend/dist/verify.js'
import type { CheckTarget } from '../../../../backend/dist/types/check.js'

/**
 * Same contract as backend/src/api/server.ts's POST /verify, reusing the
 * exact same verify() orchestrator — so this route and the standalone
 * backend server can never drift apart. Runs all six checks against
 * whatever CheckTarget fields the caller provides.
 */
export async function POST(request: NextRequest) {
  let target: CheckTarget = {}
  try {
    const body = await request.json()
    if (body && typeof body === 'object') target = body as CheckTarget
  } catch {
    // No/invalid JSON body — fall through with an empty target, which is
    // valid: every check honestly reports `unavailable` rather than crashing.
  }

  const report = await verify(target)
  return NextResponse.json(report)
}
