export const buildRepositoryEntry = (overrides = {}) => ({
  id: 'repository-1',
  type: 'repository',
  title: 'Defra AI Coding Standards',
  summary:
    'Rules and skills for consistent AI-assisted development across Defra.',
  author: 'Platform Team',
  published: '2026-02-15',
  experienceLevel: 'Comfortable',
  repositoryUrl: 'https://github.com/DEFRA/ai-coding-standards',
  designPhilosophy:
    'A shared, tool-agnostic set of coding standards that any AI assistant can follow. The goal is consistency across teams regardless of which AI tool they use.',
  keyFeatures: [
    '12 rules files covering code style, testing, and PR review',
    '3 automated refactoring skills',
    'Works with any AI coding assistant'
  ],
  whoThisIsFor: [
    'Development teams using AI coding assistants',
    'New Defra projects needing consistent standards',
    'Teams working across multiple AI tools'
  ],
  contentTags: ['Rules', 'Skills'],
  toolTags: ['Claude Code', 'GitHub Copilot'],
  ...overrides
})

export const buildPromptEntry = (overrides = {}) => ({
  id: 'prompt-1',
  type: 'prompt',
  title: 'User Story Generator',
  summary: 'Generates user stories from meeting transcripts.',
  author: 'Jane Smith',
  published: '2026-03-01',
  experienceLevel: 'Getting started',
  whatThisPromptDoes:
    'Give it a meeting transcript and it produces a set of user stories in standard format.',
  whyThisPromptWorks:
    'It uses structured output formatting and chain-of-thought reasoning to break down discussions into actionable stories.',
  howToUseTheResult:
    'Review each story for accuracy, then import them into your backlog tool.',
  promptText:
    'You are a business analyst. Read the following [DOCUMENT] about [TOPIC] and produce user stories.',
  useCaseTags: ['Writing', 'Planning'],
  toolTags: ['Any AI assistant'],
  beforeYouStart: null,
  ...overrides
})

export const buildWorkflowEntry = (overrides = {}) => ({
  id: 'workflow-1',
  type: 'workflow',
  title: 'Sprint Planning Pipeline',
  summary: 'End-to-end sprint planning from backlog to task breakdown.',
  author: 'Delivery Team',
  published: '2026-03-10',
  experienceLevel: 'Advanced',
  whatThisWorkflowAchieves:
    'Takes a raw backlog and produces a fully planned sprint with sized stories and task breakdowns.',
  whyThisWorksForUs:
    'Breaking planning into steps lets you review and adjust at each stage rather than trusting a single prompt.',
  whatYoullNeed: [
    'Access to the product backlog',
    'Sprint capacity numbers',
    'Previous sprint velocity'
  ],
  steps: [
    {
      title: 'Prioritise the backlog',
      context:
        'Start by getting the AI to rank stories by business value and dependencies.',
      promptText:
        'Review the following backlog items and rank them by business value:\n\n[BACKLOG_ITEMS]',
      whatToDoWithOutput:
        'Check the ranking makes sense and adjust any obvious misplacements before continuing.'
    },
    {
      title: 'Size the stories',
      context: 'Now estimate each prioritised story using the team velocity.',
      promptText:
        'Given the following prioritised stories and a team velocity of [VELOCITY] points per sprint, estimate story points for each:\n\n[PRIORITISED_STORIES]',
      whatToDoWithOutput:
        'Validate estimates against your team knowledge and adjust where needed.'
    }
  ],
  useCaseTags: ['Planning', 'Analysis'],
  toolTags: ['Claude', 'ChatGPT'],
  estimatedTime: null,
  ...overrides
})
