# Testing

TDD and BDD rules for writing behaviour-driven, maintainable tests.

## Scope

Applies to all test files (`*.test.js`) — unit, integration, and end-to-end.

## Core Principles

1. **Test Behaviour, Not Implementation:** Verify what the system does, not how it does it.
2. **Red-Green-Refactor:** Write a failing test first, then minimum code to pass, then refactor.
3. **Tests as Documentation:** Tests should communicate expected behaviour to new developers.
4. **Confidence Over Coverage:** Tests should enable safe refactoring, not hit arbitrary percentages.

## Must Have (Critical)

- **RULE-001:** Write a failing test before any production code. The test must fail for the right reason.
- **RULE-002:** Each test must follow Arrange-Act-Assert (AAA) or Given-When-Then (GWT) with clear separation between phases.
- **RULE-003:** Test names must describe the scenario in plain language (e.g., `"returns 404 when user does not exist"` not `"test user not found"`).
- **RULE-004:** Tests must be isolated and independent — runnable in any order without affecting other tests.
- **RULE-005:** Never test implementation details. Focus on public APIs and observable outcomes.
- **RULE-006:** Each test should verify one specific behaviour. Multiple assertions are acceptable if they all relate to the same behavioural outcome.
- **RULE-007:** Do not test framework code, libraries, or language features — focus on your application's behaviour.
- **RULE-008:** Consolidate tests that verify the same behaviour with minor variations into parameterised tests rather than separate tests.

## Should Have (Important)

- **RULE-101:** Use `describe` blocks to group related tests and provide context.
- **RULE-102:** Use `beforeEach`/`afterEach` for cleanup to ensure consistent test state.
- **RULE-103:** Mock external dependencies (databases, APIs, file systems) so tests are fast and focused.
- **RULE-104:** Write tests at unit, integration, and e2e levels based on confidence needed, not coverage targets.
- **RULE-105:** Extract common setup into well-named helper functions; keep each test readable and self-contained.
- **RULE-106:** Test edge cases and error scenarios, not just the happy path — consider boundary conditions and null values.
- **RULE-107:** Use descriptive test data that clarifies intent (e.g., `"expired-token"` instead of `"token123"`).

## Could Have (Preferred)

- **RULE-201:** Implement custom matchers for domain-specific validations to improve test readability.

## Example

```javascript
// ✅ Good: consolidated, behaviour-focused test
describe('SessionManager', () => {
  describe('when creating a new session', () => {
    it('includes session metadata in the response', async () => {
      const user = { id: 'user-123', email: 'test@example.com' }

      const session = await sessionManager.createSession(user)

      expect(session).toMatchObject({
        userId: user.id,
        createdAt: expect.any(Date),
        expiresAt: expect.any(Date)
      })
      expect(session.expiresAt > session.createdAt).toBe(true)
    })
  })
})

// ❌ Bad: multiple tests for the same behaviour
describe('getTimestamp', () => {
  it('returns a Date object', () => { ... })
  it('returns current time', () => { ... })
  // These should be one test verifying timestamp behaviour
})
```

## Decision Framework

When rules conflict:
- Prioritise test clarity and maintainability over DRY.
- Choose readability over clever abstractions.
- When in doubt: would a new developer understand the system's expected behaviour by reading this test?
