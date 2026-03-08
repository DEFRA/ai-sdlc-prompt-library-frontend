import { createTool } from '@mastra/core'
import { execSync } from 'node:child_process'
import { z } from 'zod'

export const shellTool = createTool({
  id: 'run-shell-command',
  description:
    'Execute a shell command and return its stdout. Throws on non-zero exit. Use for git and gh CLI operations only.',
  inputSchema: z.object({
    command: z.string().describe('The shell command to execute'),
    cwd: z.string().optional().describe('Working directory — defaults to the repository root'),
  }),
  outputSchema: z.object({
    stdout: z.string().describe('Combined stdout output from the command'),
  }),
  execute: async ({ context }) => {
    const { command, cwd } = context
    const stdout = execSync(command, {
      cwd: cwd ?? process.cwd(),
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return { stdout: stdout.trim() }
  },
})
