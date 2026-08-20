---
name: frontend-standards
description: Enforces modern Vue 3 Composition API and strict shadcn-vue component usage.
---

### Goal
Ensure the agent uses modern Vue practices and relies on the local shadcn-vue component library instead of native HTML.

### Instructions
- Always use Vue 3 Composition API with `<script setup>`. Never use the Options API.
- When building UI elements, always import components from the local `@/components/ui/` directory.
- Do not use native HTML elements (like standard `<button>`, `<table>`, or `<input>`) if a `shadcn-vue` equivalent exists in our library.
- Ensure all component imports resolve correctly to the `@/` alias path.
