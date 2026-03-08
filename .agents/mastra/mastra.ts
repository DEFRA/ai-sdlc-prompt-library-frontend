import { Mastra } from '@mastra/core'
import { featureSpecAgent } from './feature-spec-agent.js'
import { featurePlanAgent } from './feature-plan-agent.js'
import { featureReviewTestsAgent } from './feature-review-tests-agent.js'
import { featureReviewStylingAgent } from './feature-review-styling-agent.js'
import { featureWriteAgent } from './feature-write-agent.js'
import { routingAgent } from './routing-agent.js'

const ALL_AGENTS = {
  [featureSpecAgent.id]: featureSpecAgent,
  [featurePlanAgent.id]: featurePlanAgent,
  [featureReviewTestsAgent.id]: featureReviewTestsAgent,
  [featureReviewStylingAgent.id]: featureReviewStylingAgent,
  [featureWriteAgent.id]: featureWriteAgent,
  [routingAgent.id]: routingAgent,
}

export function registerAgents(mastraInstance: Mastra): Mastra {
  mastraInstance.agents = ALL_AGENTS
  return mastraInstance
}

export const mastra = new Mastra({
  agents: ALL_AGENTS,
})
