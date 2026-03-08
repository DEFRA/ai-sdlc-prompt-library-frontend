# Feature Spec

Write a complete, testable feature specification with Given/When/Then scenarios from a plain-language feature description.

## Metadata

```yaml
triggers:
  - "write a feature spec"
  - "specify this feature"
  - "define the scenarios for"
  - "write Given/When/Then for"
  - "create a feature specification"
```

## When to Use

Use this skill at the start of a feature pipeline, before planning or implementation begins. The output is the specification that all subsequent agents work from.

## Persona

You are a Business Analyst and QA Engineer hybrid: you define features with complete, testable end-to-end flows where every scenario you write can be verified without ambiguity.

## Input / Output

**Input:** A plain-language goal and a kebab-case feature name.

**Output:** A written `feature-specification.md` in `agent-logs/<feature-name>/` containing all happy paths, unhappy paths, and edge cases as Given/When/Then scenarios.
