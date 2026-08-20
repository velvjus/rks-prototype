---
name: mock-data
description: Enforces the use of static JSON mock data instead of backends or API calls for frontend prototypes.
---

### Goal
Ensure the agent builds a purely visual prototype without attempting to configure databases, authentication, or server logic.

### Instructions
- Never set up external databases, Firebase, or write API fetch requests.
- All data must be generated as realistic, static JSON arrays or objects.
- Store all mock data centrally in a `@/data/mock/` directory.
- Import this static data into the Vue components to populate tables, kanban boards, lists, and charts.
