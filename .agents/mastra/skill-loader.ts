import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function extractSection(content: string, heading: string, filePath: string): string {
  const regex = new RegExp(`## ${heading}\\n\\n([\\s\\S]*?)(?=\\n## |$)`)
  const match = content.match(regex)
  if (!match) {
    throw new Error(`No "## ${heading}" section found in ${filePath}`)
  }
  return match[1].trim()
}

export function loadSkillPersona(skillDir: string): string {
  const filePath = join(process.cwd(), '.agents', 'skills', skillDir, 'SKILL.md')
  const content = readFileSync(filePath, 'utf-8')
  return extractSection(content, 'Persona', filePath)
}

export function loadRules(ruleFiles: string[]): string {
  return ruleFiles
    .map((file) => {
      const filePath = join(process.cwd(), '.agents', 'rules', file)
      return readFileSync(filePath, 'utf-8')
    })
    .join('\n\n')
}

export function loadAgentInstructions(skillDir: string, ruleFiles: string[] = []): string {
  const persona = loadSkillPersona(skillDir)
  if (ruleFiles.length === 0) return persona
  const rules = loadRules(ruleFiles)
  return `${persona}\n\n${rules}`
}
