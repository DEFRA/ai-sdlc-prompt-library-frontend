import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface AgentDescriptor {
  name: string
  skillDirectory: string
  description: string
  triggerPhrases: string[]
}

function extractTriggerPhrases(skillContent: string): string[] {
  const triggersMatch = skillContent.match(/triggers:\s*\n([\s\S]*?)```/)
  if (!triggersMatch) {
    return []
  }

  return triggersMatch[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- "'))
    .map((line) => line.slice(3, -1))
}

function extractDescription(skillContent: string): string {
  const lines = skillContent.split('\n')
  const firstHeadingIndex = lines.findIndex((line) => line.startsWith('# '))
  if (firstHeadingIndex === -1) {
    return ''
  }

  const descriptionLines: string[] = []
  for (let i = firstHeadingIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('## ')) {
      break
    }
    if (line.trim()) {
      descriptionLines.push(line.trim())
    }
  }

  return descriptionLines.join(' ')
}

export async function readAgentDirectory(agentsPath: string): Promise<AgentDescriptor[]> {
  const skillsPath = join(agentsPath, 'skills')
  const skillDirectories = await readdir(skillsPath, { withFileTypes: true })

  const descriptors: AgentDescriptor[] = []

  for (const entry of skillDirectories) {
    if (!entry.isDirectory()) {
      continue
    }

    const skillMdPath = join(skillsPath, entry.name, 'SKILL.md')

    let skillContent: string
    try {
      skillContent = await readFile(skillMdPath, 'utf-8')
    } catch {
      continue
    }

    const lines = skillContent.split('\n')
    const titleLine = lines.find((line) => line.startsWith('# '))
    const name = titleLine ? titleLine.slice(2).trim() : entry.name

    descriptors.push({
      name,
      skillDirectory: entry.name,
      description: extractDescription(skillContent),
      triggerPhrases: extractTriggerPhrases(skillContent),
    })
  }

  return descriptors
}
