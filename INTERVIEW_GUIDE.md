# Agent Config Repository — Interview Guide

Use this guide when interviewing someone who wants to submit an agent config repository to the Defra AI Prompt Library. Ask the questions below, record their answers, then use the responses to complete a new entry in `src/server/services/gallery/data/entries.json`.

---

## 1. About you and your repo

- **What is the name of your agent config?**
- **Who should be credited as the author?** This could be a person or a team name.
- **Give me a one-line summary of what this config does.**
- **What experience level is this aimed at?** (Getting started / Comfortable / Advanced)
- **What is the repository URL?**

---

## 2. Design philosophy

- **What problem were you trying to solve when you created this config?**
- **What principles or opinions guide the way it is set up?** For example, is it opinionated about code style, testing approach, or review process? Is it designed to be tool-agnostic?
- **How does it make AI-assisted development more consistent or reliable for your team?**

---

## 3. Key features

- **Walk me through the main things this config provides.** For example, rules files, skills, templates, project configuration, review checklists.
- **How many rules or skills does it include?**
- **Is there anything unusual or distinctive about it compared to a default setup?**

---

## 4. Who this is for

- **Who benefits most from using this config?** Describe the teams, roles, or situations where it adds the most value.
- **Are there any prerequisites?** For example, does the team need to be using a specific AI tool, framework, or language?

---

## 5. Tags

- **Content tags** — What kind of content does the repo contain? (e.g. Rules, Skills, Templates, Project config)
- **Tool tags** — Which AI tools does this work with? (e.g. Claude Code, GitHub Copilot, Cursor, Any AI assistant)

---

## Completing the entry

Once you have the answers, create a new object in `entries.json` using the schema below. Use the title to generate a kebab-case `id` and set `published` to today's date.

```json
{
  "id": "",
  "type": "agent-config",
  "title": "",
  "summary": "",
  "author": "",
  "published": "YYYY-MM-DD",
  "experienceLevel": "",
  "repositoryUrl": "",
  "designPhilosophy": "",
  "keyFeatures": [],
  "whoThisIsFor": [],
  "contentTags": [],
  "toolTags": []
}
```

### Field mapping

| Interview section                                    | JSON field           |
| ---------------------------------------------------- | -------------------- |
| Name of your agent config                            | `title`              |
| Author                                               | `author`             |
| One-line summary                                     | `summary`            |
| Experience level                                     | `experienceLevel`    |
| Repository URL                                       | `repositoryUrl`      |
| Design philosophy answers (combine into a paragraph) | `designPhilosophy`   |
| Each key feature as a short sentence                 | `keyFeatures` array  |
| Each audience or use case as a short sentence        | `whoThisIsFor` array |
| Content tags                                         | `contentTags` array  |
| Tool tags                                            | `toolTags` array     |
