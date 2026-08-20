# RakanSales Omnichannel Context Panel PRD
**Document type:** Initial product requirements document (right context panel scope only)  
**Module:** Omnichannel -> Right Context / CRM Panel  
**Version date:** 2026-05-14  
**Status:** Initial working PRD for Admin and Sales context panel design and logic

---

# 1. Purpose

This document defines the **right-side Omnichannel Context Panel** for RakanSales.

The context panel is the CRM and operational detail surface that sits beside the conversation thread. It should help users understand who they are talking to, what commercial opportunity is attached, who owns the work, what lifecycle state the conversation is in, and what actions are available without overloading the center thread.

This document covers:
- contact identity and editable CRM details,
- company and deal context,
- conversation metadata,
- ownership and participant editing,
- general labels/tags and segmentation metadata,
- lifecycle and close/reopen metadata,
- admin oversight controls,
- sales actions,
- permissions,
- audit requirements,
- empty/loading/error states.

This document does **not** redefine:
- the Sales Team sidebar queue logic,
- the Admin sidebar visibility/filter model,
- the center conversation thread and composer behavior,
- full CRM object management outside the opened conversation.

---

# 2. Product Goal

The context panel must function as a **CRM context and control surface** for the opened conversation.

It should help Sales users:
- recognize the contact quickly,
- see company, deal, priority, temperature, and labels/tags,
- update ownership and basic CRM context,
- take common sales actions such as task, meeting, note, and deal updates.

It should help Admin users:
- inspect assignment, team, inbox, lifecycle, SLA, and audit-sensitive metadata,
- reassign, escalate, close, restore, or reopen conversations where permitted,
- understand operational risk without crowding the conversation thread.

The long-run design principle is:

**Sidebar = queue and selection**  
**Thread = conversation execution**  
**Context panel = CRM context, ownership, lifecycle, and deeper actions**

---

# 3. Core UX Principles

## 3.1 Deeper context belongs here

The context panel is the correct home for:
- contact information,
- company information,
- deal information,
- contact temperature,
- priority,
- labels/tags,
- ownership editing,
- participants,
- lifecycle metadata,
- audit-oriented information.

These should not be promoted into the thread header unless they are required for immediate message handling.

## 3.2 Admin view is oversight-first

Admin users need stronger operational visibility than sales reps.

Admin context should emphasize:
- owner,
- team,
- inbox,
- SLA state,
- work state,
- lifecycle state,
- escalation state,
- close/reopen history,
- audit trail access,
- permission-aware management actions.

## 3.3 Sales view is action-first

Sales users need a compact CRM workspace.

Sales context should emphasize:
- contact reachability,
- company and deal context,
- stage and value,
- labels/tags,
- next actions,
- notes and activity,
- ownership when editable.

## 3.4 Progressive disclosure over permanent clutter

The panel should be scannable by default. Detailed metadata, audit history, and advanced admin actions should be available through expandable sections, drawers, or menus rather than permanently consuming vertical space.

The default context panel is a prioritized compact surface. It is not required to show every available conversation, CRM, deal, company, SLA, or audit field at once. The visible default should favor the fields most useful for immediate sales handling and operational ownership, with secondary fields available through expansion, edit views, drawers, menus, or audit/activity entry points.

## 3.5 Every editable field needs clear ownership

The context panel may edit CRM and conversation metadata, but each edit must have a clear source of truth and audit behavior.

---

# 4. Scope

This PRD covers the right-side panel only, including:
- panel header and view modes,
- contact card,
- conversation info,
- deal info,
- company info,
- ownership and participants,
- labels/tags and segmentation metadata,
- lifecycle metadata,
- action shortcuts,
- admin-only controls,
- permissions and audit events.

---

# 5. Information Architecture

The right context panel should be organized as a compact stack.

Recommended shared v1 sections:
1. Panel header
2. Contact Summary
3. Conversation Info
4. Deal Info
5. Company Info
6. Actions
7. Activity / Audit access

The panel should support role-optimized ordering rather than one fixed stack for every user.

Recommended Admin order:
1. Contact Summary
2. Conversation Info
3. Ownership / Team / Inbox
4. SLA and Lifecycle
5. Deal Info
6. Company Info
7. Admin Actions
8. Activity / Audit access

Recommended Sales order:
1. Contact Summary
2. Deal Info
3. Company Info
4. Conversation Info
5. Labels / Tags / Signals
6. Actions

Optional expandable sections:
- Labels / Tags and Segments
- Ownership History
- Lifecycle History
- Related Conversations
- Internal Notes / CRM Activity

---

# 6. Panel Header

## 6.1 Purpose

The panel header should identify that this is the CRM/context surface and provide simple view controls.

Recommended title:
- `Contact Information`

Alternative admin title:
- `Conversation Context`

## 6.2 Header controls

Recommended controls:
- collapse panel,
- switch between compact/full panel where supported,
- layout/view toggle if the product supports multiple context modes,
- more menu for panel-level configuration.

Rules:
- header controls must not duplicate the conversation lifecycle dropdown from the thread header,
- advanced admin actions should live inside sections or action menus, not the panel title row.

---

# 7. Contact Summary

## 7.1 Required visible elements

The contact summary should show:
- avatar,
- contact name,
- primary channel identity,
- phone number,
- email,
- company name,
- website or domain where available,
- contact owner where applicable,
- quick copy affordances for phone/email/link fields.

Required quick actions where data and permissions allow:
- copy phone,
- copy email,
- call,
- email,
- open CRM contact profile,
- open company profile,
- open website/domain.

Rules:
- phone, email, website, and company fields should be directly actionable, not only readable,
- quick actions may be icon-only when the icon is familiar, but the action must become clear through a visible label, expanded state, accessible name, or surrounding context,
- unavailable actions should be hidden or disabled based on missing data and permissions.

## 7.2 Contact metadata

Recommended metadata:
- channel badge,
- temperature,
- priority,
- VIP marker,
- labels/tags,
- lifecycle/contact status if available.

Rules:
- temperature and priority belong here, not in the thread header,
- labels/tags are general segmentation and handling metadata, not only Service Interest,
- labels/tags may represent service interest, campaign, customer segment, source, lifecycle context, product interest, or other product-defined labels,
- labels/tags should wrap cleanly and should not push primary identity out of view,
- show only the highest-priority two to four labels/tags by default, then use `+N`, edit/manage, or expansion for the rest,
- missing fields should be visually quiet and editable where permitted.

## 7.3 Editable fields

Editable in v1 where permitted:
- name,
- phone,
- email,
- company association,
- labels/tags,
- temperature,
- priority.

Edits must update CRM records, not only the conversation record.

---

# 8. Conversation Info

## 8.1 Purpose

Conversation Info explains the opened conversation as an operational object.

## 8.2 Required fields

Required v1 fields:
- date added / created at,
- channel,
- inbox,
- assigned owner,
- team,
- participants,
- current work state,
- lifecycle state,
- SLA state where configured,
- SLA due time or breach time where configured,
- escalation state where applicable,
- source campaign / entry point where available,
- channel status where relevant,
- latest inbound time,
- latest outbound time.

Display goal:
- Sales users should quickly know whether the conversation needs action.
- Admin users should quickly know who owns it, what queue it belongs to, and whether there is operational risk.

Compact default rule:
- the visible default may show a prioritized subset of these fields rather than the full list
- date added, assigned owner, and participants should remain visible in the compact sales view when space is constrained
- current work state and lifecycle state should remain visible either in Conversation Info or in the adjacent thread header
- admin, expanded, or detail modes should expose inbox, team, SLA, escalation, source, channel status, and latest inbound/outbound metadata where configured
- hidden required fields must remain available through expansion, edit/detail views, or admin view rather than being removed from the data model

## 8.3 Ownership editing

Ownership editing belongs in the context panel.

Required controls:
- assignee selector,
- team selector where applicable,
- inbox transfer selector where applicable,
- participants selector,
- unassign action where permitted,
- assignment history entry point.

Rules:
- updating owner/team must update the sidebar row, thread header, counters, and audit log,
- transferring inbox/team must update routing metadata and audit log,
- admin users may see broader assignee/team options than sales users,
- deactivated users may appear as historical values but should not be selectable for new ownership,
- assignment history should be collapsed by default and expanded only when the user needs traceability.

## 8.4 Work state visibility

The current work state should be visible in Conversation Info, but the primary fast control remains the clickable badge in the thread header.

The context panel may expose a fuller editor with:
- Reply,
- Late Reply,
- Waiting,
- Snoozed,
- None.

## 8.5 Lifecycle metadata

Required lifecycle fields:
- lifecycle_state,
- closed_at,
- closed_by,
- close_reason,
- archived_at,
- archived_by,
- restored_at,
- restored_by,
- reopened_at,
- reopened_by.

Display rule:
- show only metadata that exists,
- keep historical metadata collapsed by default unless the conversation is archived/reopened or the user is in Admin view,
- show close reason prominently for archived/closed conversations,
- show reopened/restored metadata when it explains why an older conversation returned to active work.

---

# 9. Deal Info

## 9.1 Purpose

Deal Info connects the conversation to revenue context.

Deal Info should behave as a compact deal workspace, not only a static card.

## 9.2 Required visible elements

Recommended v1 fields:
- deal name,
- deal value,
- pipeline / stage,
- product or service type,
- next step,
- expected close date where available,
- deal owner,
- linked quote/invoice where supported.

Required quick actions where permitted:
- open deal,
- update stage,
- set next step,
- create deal,
- link existing deal,
- unlink deal where policy allows.

## 9.3 Editable fields

Editable where permitted:
- deal association,
- stage,
- value,
- product/service,
- expected close date,
- owner.

Rules:
- changing deal stage should not change conversation work state automatically unless an explicit automation exists,
- deal data must not be duplicated into the thread header,
- if no deal is linked, the section should offer `Create deal` and `Link existing` rather than appearing empty.

---

# 10. Company Info

## 10.1 Required visible elements

Company Info should show:
- company name,
- website,
- address,
- industry,
- segment,
- company size or tier where available,
- related contacts count where available.

## 10.2 Admin visibility

Admin users may see additional account-level signals:
- assigned team,
- account owner,
- open conversations count,
- active deal count,
- related contacts count,
- historical close/reopen count.

Recommended quick actions:
- open company,
- copy website,
- view related contacts,
- view related conversations where permitted.

---

# 11. Actions

## 11.1 Purpose

The Actions section gives the user fast CRM and conversation operations without polluting the composer.

Actions should be explicit enough to scan. Icon tiles may be used for compactness, but unfamiliar icons must have visible labels, accessible names, expanded labels, or surrounding context. Hover-only tooltips must not be the only way to understand an action.

## 11.2 Recommended sales actions

Recommended v1 actions:
- create task,
- schedule meeting,
- add note,
- create or link deal,
- add label/tag,
- update stage,
- set next step.

## 11.3 Recommended admin actions

Admin-only or permission-controlled actions:
- assign / reassign,
- transfer team/inbox,
- escalate / de-escalate,
- close conversation,
- reopen conversation,
- restore from archive,
- edit close reason,
- view audit trail,
- restrict / unrestrict visibility where supported.

Rules:
- actions must be permission-aware,
- unavailable actions should be hidden or disabled with a clear reason,
- destructive or operationally meaningful actions should require confirmation where appropriate,
- Sales and Admin actions should be grouped separately when both are visible,
- high-frequency actions should remain one click away, while rare or risky actions should live in a more menu or confirmation flow.
- compact icon tiles are allowed for common actions when the icon is familiar or the tile can reveal a clear label through the action area state
- do not depend on hover-only tooltips as the only way to understand an action
- an audit or activity tile should be available where the user has permission to view audit/activity history

---

# 12. Activity and Audit

## 12.1 Activity feed

The panel may expose a compact activity feed for CRM events related to the contact, company, deal, and conversation.

Default presentation:
- show one compact recent activity row when useful,
- provide a `View activity` or `View audit trail` entry point for deeper history,
- do not make the full activity feed permanent in the default panel.

Recommended activity examples:
- owner changed,
- team transferred,
- deal stage changed,
- meeting scheduled,
- close reason updated,
- conversation reopened,
- label/tag added or removed.

## 12.2 Audit trail

Admin users need access to a fuller audit trail.

Audit trail should include:
- actor,
- timestamp,
- previous value,
- new value,
- source surface,
- reason/comment where supplied.

Rule:
- the audit trail can open in a drawer or modal rather than permanently occupying the panel.

---

# 13. Admin View Requirements

Admin view should add or emphasize:
- team and inbox,
- owner and participant editing,
- assignment history,
- SLA state,
- escalation state,
- lifecycle history,
- close reason,
- audit trail access,
- permission-limited action controls,
- restricted conversation indicator where applicable.

Admin view should avoid:
- turning the right panel into a full analytics dashboard,
- duplicating the Admin sidebar filters,
- making every operational field permanently visible at once.

Recommended admin default stack:
1. Contact Summary
2. Conversation Info
3. Ownership / Team / Inbox
4. SLA and Lifecycle
5. Deal Info
6. Company Info
7. Admin Actions
8. Activity / Audit access

---

# 14. Sales View Requirements

Sales view should emphasize:
- contact summary,
- deal info,
- company info,
- labels/tags and priority,
- next actions,
- lightweight conversation info,
- editable CRM fields.

Recommended sales default stack:
1. Contact Summary
2. Deal Info
3. Company Info
4. Conversation Info
5. Labels / Tags / Signals
6. Actions

---

# 15. Collapsed and Responsive Behavior

## 15.1 Collapsed state

When collapsed, the panel should preserve access to:
- contact identity,
- quick expand control,
- important alerts such as archived/restricted state where space allows.

## 15.2 Narrow screens

On narrower layouts:
- the context panel may become a drawer,
- section headers remain sticky where useful,
- editing flows should use drawers/modals rather than forcing horizontal overflow.

---

# 16. Empty, Loading, and Error States

Required states:
- no conversation selected,
- contact not found,
- company not linked,
- no deal linked,
- permission-restricted context,
- CRM data failed to load,
- partial data unavailable,
- saving edit,
- edit failed.

Recommended copy:
- `No deal linked`
- `Create deal`
- `Link existing`
- `Company details unavailable`
- `Add company`
- `Link company`
- `Add phone`
- `Add email`
- `You do not have permission to edit this field`
- `Some CRM details could not be loaded`

---

# 17. Permissions

Required permission concepts:
- view contact details,
- edit contact details,
- view company details,
- edit company details,
- view deal details,
- edit deal details,
- assign conversation,
- transfer team/inbox,
- change work state,
- change lifecycle state,
- view lifecycle metadata,
- edit close reason,
- view audit trail,
- restrict conversation visibility.

Rules:
- field-level permissions are required,
- visibility and edit permissions are separate,
- counts and related-object indicators must not leak restricted records,
- disabled controls should explain missing permission where appropriate.

---

# 18. Audit Events

Required events:
- context_panel_viewed,
- contact_updated_from_context_panel,
- company_updated_from_context_panel,
- deal_updated_from_context_panel,
- conversation_assigned_from_context_panel,
- conversation_team_transferred_from_context_panel,
- conversation_participants_updated,
- conversation_work_state_updated_from_context_panel,
- conversation_closed_from_context_panel,
- conversation_reopened_from_context_panel,
- conversation_restored_from_context_panel,
- close_reason_updated_from_context_panel,
- conversation_escalated_from_context_panel,
- audit_trail_viewed.

Audit metadata should include:
- actor,
- timestamp,
- object type,
- object ID,
- previous value,
- new value,
- source surface = Context Panel.

---

# 19. Data Dependencies

The context panel depends on:
- contact record,
- company/account record,
- deal/opportunity record,
- conversation record,
- assignment/participant records,
- lifecycle metadata,
- work-state metadata,
- SLA metadata,
- permission model,
- audit event stream.

The panel should tolerate partial loading so that a missing deal or company does not block conversation handling.

---

# 20. Cross-Panel Sync Rules

The context panel must stay synchronized with the sidebar and thread.

Required sync behavior:
- assignee changes update the thread header and sidebar rows,
- team/inbox transfer changes update routing, sidebar filters, and audit log,
- work-state changes update the thread header, sidebar row, and counters,
- lifecycle changes update the thread header, sidebar scope visibility, and list membership,
- close/reopen/restore actions log thread system events where relevant,
- contact name/avatar/company changes update visible identity across all panels,
- deal stage and next-step changes update Deal Info and CRM activity,
- deal/company changes update only CRM context unless a defined automation changes conversation state,
- assignment history, lifecycle history, and audit events must reflect context-panel actions with source surface = Context Panel.

---

# 21. Visual State Library Requirements

Before final design lock, document visuals for:
- default sales context panel,
- default admin context panel,
- edit contact field,
- edit assignee/team/participants,
- inbox/team transfer,
- assignment history expanded,
- no linked deal,
- create/link deal empty state,
- quick action menus,
- deal mini-workspace,
- archived conversation context,
- reopened conversation context,
- lifecycle metadata expanded,
- restricted conversation context,
- SLA breached context,
- recent activity preview,
- audit drawer,
- collapsed panel,
- mobile/drawer panel.

---

# 22. Short-Term Practical Version (v1)

The v1 context panel should include:
- Contact Summary,
- Conversation Info with owner/team/participants,
- general Labels / Tags,
- Deal Info,
- Company Info,
- Actions,
- lifecycle metadata display,
- admin-only audit/action entry points, including an audit/activity tile where permitted,
- field-level permission behavior,
- clear empty states for missing CRM objects.

For Admin view, prioritize operational controls and audit-safe metadata.

For Sales view, prioritize CRM context and next actions.

---

# 23. Product Decisions Locked

1. The context panel is the source of truth for deeper CRM context in the Omnichannel layout.
2. Deal stage, contact temperature, priority, and extended labels/tags belong in the context panel, not the thread header.
3. Ownership editing belongs in the context panel in v1.
4. The thread header may show assignee and work state, but richer editing lives in the context panel.
5. Lifecycle metadata must be visible in the context panel.
6. Admin users need stronger operational fields, admin actions, and audit access.
7. Sales users need faster CRM context, deal context, and next actions.
8. Context panel edits must synchronize with sidebar rows, thread header, counters, and audit events where relevant.
9. The context panel must support partial CRM data without blocking conversation handling.
10. Permission handling must be field-level and action-level.

---

# 24. Final Summary

The RakanSales Omnichannel Context Panel should operate as the **CRM context and operational control surface** for the opened conversation. It should keep the center thread lightweight, give sales reps fast customer and deal context, and give admins the ownership, lifecycle, SLA, and audit controls needed to manage conversations safely.
