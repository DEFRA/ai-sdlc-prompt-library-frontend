export interface ProgressEvent {
  agent: string
  status: 'started' | 'completed'
  output?: unknown
  timestamp: string
}

export function emitStepStart(agent: string): ProgressEvent {
  return {
    agent,
    status: 'started',
    timestamp: new Date().toISOString(),
  }
}

export function emitStepComplete(agent: string, output: unknown): ProgressEvent {
  return {
    agent,
    status: 'completed',
    output,
    timestamp: new Date().toISOString(),
  }
}

export async function* runWithStream(
  goal: string,
  executeStep: (goal: string, onStepStart: (agent: string) => void, onStepComplete: (agent: string, output: unknown) => void) => Promise<void>
): AsyncGenerator<ProgressEvent> {
  const events: ProgressEvent[] = []
  let resolve: (() => void) | null = null
  let done = false

  const pendingPromise = (): Promise<void> =>
    new Promise<void>((r) => {
      resolve = r
    })

  let currentPromise = pendingPromise()

  function pushEvent(event: ProgressEvent): void {
    events.push(event)
    if (resolve) {
      const r = resolve
      resolve = null
      currentPromise = pendingPromise()
      r()
    }
  }

  const executionPromise = executeStep(
    goal,
    (agent) => pushEvent(emitStepStart(agent)),
    (agent, output) => pushEvent(emitStepComplete(agent, output))
  ).then(() => {
    done = true
    if (resolve) {
      resolve()
    }
  })

  let emitted = 0

  while (true) {
    if (emitted < events.length) {
      yield events[emitted++]
    } else if (done) {
      break
    } else {
      await currentPromise
    }
  }

  await executionPromise
}
