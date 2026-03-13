# Prompt Submission — Interview Guide

Use this guide when interviewing someone who wants to submit a prompt to the Defra AI Prompt Library. Ask the questions below, record their answers, then use the responses to complete a new entry in `src/server/services/gallery/data/entries.json`.

---

## 1. About you and your prompt

- **What is the name of your prompt?**
- **Who should be credited as the author?** This could be a person or a team name.
- **Give me a one-line summary of what this prompt does.**
- **What experience level is this aimed at?** (Getting started / Comfortable / Advanced)

---

## 2. What this prompt does

- **Walk me through what happens when someone runs this prompt.** What do they give it, and what do they get back?
- **Why does this prompt work well?** What techniques or structure make it effective? For example, does it use chain-of-thought reasoning, structured output, role assignment, or few-shot examples?

---

## 3. How to use the result

- **Once someone has the output, what should they do with it?** For example, does it need human review, does it feed into another tool, or is it ready to use as-is?

---

## 4. Before you start

- **What does someone need to have ready before they use this prompt?** For example, a document, a dataset, access to a particular system, or context about their project.

---

## 5. The prompt itself

- **Can you share the full prompt text?** Include any placeholders (e.g. `[DOCUMENT]`, `[TOPIC]`) that the user is expected to fill in.

---

## 6. Tags

- **Use case tags** — What kind of task does this prompt help with? (e.g. Writing, Planning, Analysis, Testing, Review, Documentation, Prototyping, Design)
- **Tool tags** — Which AI tools does this work with? (e.g. Any AI assistant, Claude, ChatGPT, Claude Code, GitHub Copilot, Cursor)

---

## Completing the entry

Once you have the answers, create a new object in `entries.json` using the schema below. Use the title to generate a kebab-case `id` and set `published` to today's date.

```json
{
  "id": "",
  "type": "prompt",
  "title": "",
  "summary": "",
  "author": "",
  "published": "YYYY-MM-DD",
  "experienceLevel": "",
  "whatThisPromptDoes": "",
  "whyThisPromptWorks": "",
  "howToUseTheResult": "",
  "promptText": "",
  "useCaseTags": [],
  "toolTags": [],
  "beforeYouStart": []
}
```

### Field mapping

| Interview section                                            | JSON field             |
| ------------------------------------------------------------ | ---------------------- |
| Name of your prompt                                          | `title`                |
| Author                                                       | `author`               |
| One-line summary                                             | `summary`              |
| Experience level                                             | `experienceLevel`      |
| What happens when someone runs it (combine into a paragraph) | `whatThisPromptDoes`   |
| Why it works well (combine into a paragraph)                 | `whyThisPromptWorks`   |
| What to do with the output                                   | `howToUseTheResult`    |
| Each prerequisite as a short sentence                        | `beforeYouStart` array |
| Full prompt text with placeholders                           | `promptText`           |
| Use case tags                                                | `useCaseTags` array    |
| Tool tags                                                    | `toolTags` array       |
