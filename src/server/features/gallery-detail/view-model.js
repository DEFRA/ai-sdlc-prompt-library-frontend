const TYPE_BADGES = {
  'agent-config': 'Agent Config',
  prompt: 'Prompt',
  workflow: 'Workflow'
}

function buildTagGroups(entry) {
  const groups = []

  if (entry.contentTags?.length) {
    groups.push({ label: 'Content', tags: entry.contentTags })
  }

  if (entry.useCaseTags?.length) {
    groups.push({ label: 'Use case', tags: entry.useCaseTags })
  }

  if (entry.toolTags?.length) {
    groups.push({ label: 'Tools', tags: entry.toolTags })
  }

  return groups
}

function buildMetadata(entry) {
  return {
    author: entry.author,
    published: entry.published,
    experienceLevel: entry.experienceLevel,
    estimatedTime: entry.estimatedTime ?? null
  }
}

function buildSteps(steps) {
  return steps.map((step, index) => ({
    number: index + 1,
    title: step.title,
    context: step.context,
    promptText: step.promptText,
    whatToDoWithOutput: step.whatToDoWithOutput
  }))
}

export const galleryDetailViewModel = {
  get(entry) {
    return {
      pageTitle: entry.title,
      typeBadge: TYPE_BADGES[entry.type],
      templateType: entry.type,
      entry: {
        ...entry,
        ...(entry.steps ? { steps: buildSteps(entry.steps) } : {})
      },
      tagGroups: buildTagGroups(entry),
      metadata: buildMetadata(entry)
    }
  }
}
