/**
 * Development-only UI interaction diagnostic system.
 * Active when NEXT_PUBLIC_DEBUG_UI="true".
 */
export function logUIAction(
  component: string,
  action: string,
  payload?: unknown,
  previousState?: unknown,
  nextState?: unknown,
  result?: unknown,
) {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DEBUG_UI === 'true') {
    console.log('[UI ACTION]', {
      component,
      action,
      payload,
      previousState,
      nextState,
      result,
      timestamp: new Date().toISOString(),
    })
  }
}
