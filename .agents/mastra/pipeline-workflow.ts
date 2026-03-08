import { Workflow, Mastra } from '@mastra/core'
import { z } from 'zod'
import { FeatureSpecInput, FeatureSpecOutput } from './feature-spec-agent.js'
import { FeaturePlanOutput } from './feature-plan-agent.js'
import { ReviewTestsOutput } from './feature-review-tests-agent.js'
import { ReviewStylingOutput } from './feature-review-styling-agent.js'
import { FeatureWriteOutput } from './feature-write-agent.js'
import { ReviewCodeOutput } from './feature-review-code-agent.js'
import { DocsUpdateOutput } from './feature-docs-update-agent.js'
import { CreatePrOutput } from './feature-create-pr-agent.js'
import { persistSuspension } from './workflow-storage.js'
import type { ApprovalDecision } from './schemas/shared-schemas.js'

export const MAX_REVIEW_ITERATIONS = 3

export class MaxIterationsError extends Error {
  constructor(iterations: number) {
    super(`Maximum review iteration count of ${iterations} reached without passing review`)
    this.name = 'MaxIterationsError'
  }
}

export interface PipelineOptions {
  maxReviewIterations?: number
}

export function enforceIterationLimit(counter: number, max: number): void {
  if (counter >= max) {
    throw new MaxIterationsError(max)
  }
}

export function mergeParallelOutputs(outputs: unknown[]): Record<string, unknown> {
  const merged: Record<string, unknown> = {}

  for (const output of outputs) {
    if (output !== null && typeof output === 'object' && !Array.isArray(output)) {
      for (const [key, value] of Object.entries(output as Record<string, unknown>)) {
        if (key in merged) {
          merged[`${key}_conflict`] = [merged[key], value]
        } else {
          merged[key] = value
        }
      }
    }
  }

  return merged
}

export async function resumeWorkflow(runId: string, decision: ApprovalDecision): Promise<void> {
  const { loadSuspension } = await import('./workflow-storage.js')
  const state = await loadSuspension(runId)

  if (!state) {
    throw new Error(`No suspended workflow found for run ID: ${runId}`)
  }

  if (!decision.approved) {
    const { persistSuspension: persist } = await import('./workflow-storage.js')
    await persist(runId, {
      ...state,
      context: {
        ...state.context,
        rejected: true,
        rejectionReason: decision.reason ?? 'No reason provided',
      },
    })
    return
  }
}

export function buildPipelineWorkflow(mastra: Mastra, options: PipelineOptions = {}): Workflow {
  const maxIterations = options.maxReviewIterations ?? MAX_REVIEW_ITERATIONS

  const workflow = new Workflow({
    name: 'pipeline',
    triggerSchema: FeatureSpecInput,
  })

  const featureSpecStep = workflow.step('feature-spec', {
    inputSchema: FeatureSpecInput,
    execute: async ({ context, mastra: m }) => {
      const agent = m.getAgent('feature-spec')
      const result = await agent.generate(
        [{ role: 'user', content: JSON.stringify(context.inputData) }],
        { output: FeatureSpecOutput }
      )
      return result.object
    },
  })

  const featurePlanStep = workflow.step('feature-plan', {
    inputSchema: FeatureSpecOutput,
    execute: async ({ context, mastra: m }) => {
      const agent = m.getAgent('feature-plan')
      const result = await agent.generate(
        [{ role: 'user', content: JSON.stringify(context.inputData) }],
        { output: FeaturePlanOutput }
      )
      return result.object
    },
  })

  const humanApprovalStep = workflow.step('human-approval', {
    inputSchema: FeaturePlanOutput,
    execute: async ({ context, suspend }) => {
      const runId = (context as Record<string, unknown>).runId as string ?? 'unknown'
      await persistSuspension(runId, {
        runId,
        suspendedAt: new Date().toISOString(),
        step: 'human-approval',
        context: context as Record<string, unknown>,
      })

      const decision = await suspend<ApprovalDecision>('Awaiting human approval of the implementation plan')

      if (!decision.approved) {
        throw new Error(`Workflow rejected: ${decision.reason ?? 'No reason provided'}`)
      }

      return context.inputData
    },
  })

  const reviewTestsStep = workflow.step('feature-review-tests', {
    inputSchema: FeaturePlanOutput.merge(z.object({ iterationCount: z.number().int().min(0) })),
    execute: async ({ context, mastra: m }) => {
      enforceIterationLimit(context.inputData.iterationCount ?? 0, maxIterations)

      const agent = m.getAgent('feature-review-tests')
      const result = await agent.generate(
        [{ role: 'user', content: JSON.stringify(context.inputData) }],
        { output: ReviewTestsOutput }
      )
      return result.object
    },
  })

  const reviewStylingStep = workflow.step('feature-review-styling', {
    inputSchema: FeaturePlanOutput,
    execute: async ({ context, mastra: m }) => {
      const agent = m.getAgent('feature-review-styling')
      const result = await agent.generate(
        [{ role: 'user', content: JSON.stringify(context.inputData) }],
        { output: ReviewStylingOutput }
      )
      return result.object
    },
  })

  const featureWriteStep = workflow.step('feature-write', {
    inputSchema: z.object({
      featureName: z.string(),
      specificationPath: z.string(),
      planPath: z.string(),
      testNames: z.array(z.string()),
      reviewDecisions: z.object({
        testNamesApproved: z.boolean(),
        stylingRequired: z.boolean(),
      }),
      iterationCount: z.number().int().min(0),
      testFailureDetails: z.string().optional(),
    }),
    execute: async ({ context, mastra: m }) => {
      const agent = m.getAgent('feature-write')
      const result = await agent.generate(
        [{ role: 'user', content: JSON.stringify(context.inputData) }],
        { output: FeatureWriteOutput }
      )
      return result.object
    },
  })

  const featureReviewCodeStep = workflow.step('feature-review-code', {
    inputSchema: z.object({
      featureName: z.string(),
      implementedFiles: z.array(z.string()),
      auditLogPath: z.string(),
    }),
    execute: async ({ context, mastra: m }) => {
      const agent = m.getAgent('feature-review-code')
      const { featureName, implementedFiles } = context.inputData
      const auditLogPath = `agent-logs/${featureName}/code-review.md`
      const result = await agent.generate(
        [{ role: 'user', content: JSON.stringify({ featureName, implementedFiles, auditLogPath }) }],
        { output: ReviewCodeOutput }
      )
      return result.object
    },
  })

  const featureDocsUpdateStep = workflow.step('feature-docs-update', {
    inputSchema: z.object({
      featureName: z.string(),
    }),
    execute: async ({ context, mastra: m }) => {
      const agent = m.getAgent('feature-docs-update')
      const { featureName } = context.inputData
      const agentLogsPath = `agent-logs/${featureName}`
      const result = await agent.generate(
        [{ role: 'user', content: JSON.stringify({ featureName, agentLogsPath }) }],
        { output: DocsUpdateOutput }
      )
      return result.object
    },
  })

  const featureCreatePrStep = workflow.step('feature-create-pr', {
    inputSchema: z.object({
      featureName: z.string(),
      implementedFiles: z.array(z.string()),
      specificationPath: z.string(),
      planPath: z.string(),
      clearedToCommit: z.boolean(),
      documentationChangesApplied: z.array(z.string()),
    }),
    execute: async ({ context, mastra: m }) => {
      if (!context.inputData.clearedToCommit) {
        throw new Error(
          'feature-create-pr: cannot create PR — feature-review-code has Critical findings outstanding'
        )
      }
      const agent = m.getAgent('feature-create-pr')
      const result = await agent.generate(
        [{ role: 'user', content: JSON.stringify(context.inputData) }],
        { output: CreatePrOutput }
      )
      return result.object
    },
  })

  featureSpecStep
    .then(featurePlanStep)
    .then(humanApprovalStep)
    .then(reviewTestsStep)
    .after([reviewTestsStep, reviewStylingStep])
    .step(featureWriteStep)
    .then(featureReviewCodeStep)
    .then(featureDocsUpdateStep)
    .then(featureCreatePrStep)

  reviewStylingStep.after(humanApprovalStep)

  return workflow.commit()
}
