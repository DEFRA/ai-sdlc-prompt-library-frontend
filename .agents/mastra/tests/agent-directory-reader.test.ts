import { describe, test, expect } from 'vitest'
import { join } from 'node:path'
import { readAgentDirectory } from '../agent-directory-reader.js'

const AGENTS_PATH = join(import.meta.dirname ?? '.', '..', '..')

describe('agent-directory-reader', () => {
  describe('readAgentDirectory', () => {
    test('returns all skill names and trigger phrases found under the .agents/skills/ directory', async () => {
      const descriptors = await readAgentDirectory(AGENTS_PATH)

      expect(descriptors).toBeInstanceOf(Array)
      expect(descriptors.length).toBeGreaterThan(0)

      for (const descriptor of descriptors) {
        expect(descriptor.name).toBeTruthy()
        expect(descriptor.skillDirectory).toBeTruthy()
        expect(descriptor.triggerPhrases).toBeInstanceOf(Array)
        expect(descriptor.description).toBeTruthy()
      }

      const skillDirectories = descriptors.map((d) => d.skillDirectory)
      expect(skillDirectories).toContain('feature-spec')
      expect(skillDirectories).toContain('feature-plan')
      expect(skillDirectories).toContain('feature-write')
    })
  })
})
