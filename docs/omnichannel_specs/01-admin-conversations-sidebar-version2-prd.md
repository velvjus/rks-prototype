# RakanSales Omnichannel Admin Conversations Sidebar Version2 PRD

## Document Control

| Field | Value |
| --- | --- |
| Owner | Product / Omnichannel |
| Status | Active working PRD |
| Source of truth | Active PRD |
| Last updated | 2026-05-14 |
| Version | Version2 |
| Supersedes | `docs/omnichannel_specs/01-admin-conversations-sidebar-prd.md` |
| Related docs | `docs/omnichannel_specs/02-sales-team-conversations-sidebar-prd.md`, `docs/omnichannel_specs/03-conversation-thread-panel-prd.md`, `docs/omnichannel_specs/04-right-context-panel-prd.md` |

## Module

Omnichannel -> Admin Conversations Sidebar

## Purpose

This document defines the version2 Admin Conversations Sidebar for RakanSales.

Version2 replaces the earlier high-level operations-console concept with the refined sidebar design currently selected for RakanSales. The sidebar is a unified conversation selection and monitoring surface for admins, leads, and other permitted users who may both handle their own assigned chats and inspect broader conversation sets.

The sidebar should feel like the normal Conversations workspace by default, not a separate heavy admin console. Admin capability is exposed through scope controls, quick filters, sorting, and a full filter modal.

## Problem / Opportunity

Admins and team leads are not only supervisors. They also own chats and leads that they need to handle directly. A default all-admin view makes their daily work harder because it places team-wide monitoring ahead of their personal workload.

At the same time, admins and leads need fast access to broader conversation visibility when they want to inspect all users, participating conversations, unassigned conversations, archived conversations, or custom user scopes.

The opportunity is to provide one sidebar that supports both jobs:

- daily personal handling through a default Mine scope,
- lightweight admin monitoring through broader scopes and filters.

## Product Goals

- Default admins and leads into their own conversation workload.
- Allow permitted users to broaden scope to Participating, All Users, or a Custom User without switching surfaces.
- Keep the visible sidebar lean by showing only the most common controls.
- Use quick chips for the highest-value workload filters: Unassigned, Late Reply, and Reply.
- Hide heavier filters inside the full filter modal.
- Default conversation rows to a **time-relative (recency) view**, with **Work Queue sort** (Action Priority) accessible via the Sort button.
- Support a personal **Pinned flag** as a per-user, private mechanism for admins and leads to surface conversations they want to follow up on.
- Preserve the shared conversation state model used by the Sales Team sidebar, thread panel, and context panel.
- Avoid introducing v1-only operational signals such as SLA Breached or Escalation into the default v2 sidebar.

## Non-Goals / Out of Scope

- This PRD does not define a full SLA operations console.
- This PRD does not require default SLA Breached, Escalated, Restricted, or Audit Trail signals in sidebar rows.
- This PRD does not define the center conversation thread panel.
- This PRD does not define the right context panel beyond sidebar synchronization requirements.
- This PRD does not define full analytics dashboard pages.
- This PRD does not require custom saved views for version2.
- This PRD does not require Active and Archived rows to be interleaved.

## Users and Permissions

Primary users:

- Admins who can view and manage conversations according to their role.
- Team leads who handle their own chats and inspect broader team/user conversation sets.
- Permitted managers who need search, filtering, and assignment visibility.

Permission concepts:

- View own assigned conversations.
- View participating conversations.
- View all permitted conversations.
- View a custom user's conversations.
- View unassigned conversations.
- View archived conversations.
- Search conversations.
- Search message body where policy allows.
- Start a new outbound conversation.
- Mark read or unread for self.
- Select and bulk-manage visible conversations.
- Assign or reassign conversations where permitted.
- Close, reopen, or restore conversations where permitted.

Rules:

- Visibility permission and action permission are separate.
- Counts must not include conversations hidden from the current user.
- If a user lacks permission for a scope option, hide that option.
- If a user can see a row but cannot perform an action, disable the action with a permission-aware reason where practical.
- Admin read/unread is per admin user and must not clear another user's unread state.

## Entry Points

- Omnichannel Conversations module.
- Admin or lead navigation into Conversations.
- Direct link to a specific conversation.
- Notification link to a newly assigned, reopened, or unread conversation.
- Search result or CRM activity link that opens a conversation.

## Scope

In scope:

- Sidebar title and counter.
- New message action.
- Search conversation input.
- Sort button.
- Filter button and active-filter badge.
- Full filter modal entry point.
- Scope row with Mine, Active, and Priority dropdowns.
- Bulk select checkbox.
- Quick filter chips: Unassigned, Late Reply, Reply.
- Conversation row display and row state treatment.
- Default and optional sorting.
- Search, filter, and scope behavior.
- Empty, loading, error, permission, and edge states.
- Data fields, audit events, analytics, and acceptance criteria for sidebar behavior.

Out of immediate sidebar scope:

- Full conversation composer behavior.
- Right context panel field editing.
- SLA management workflows.
- Escalation workflows.
- Audit trail detail pages.
- Saved view management.

## Information Architecture

The sidebar contains these areas in order:

1. Header row.
2. Search and utility row.
3. Scope row.
4. Bulk select and quick filter row.
5. Conversation list.
6. Empty, loading, error, and permission states.

### Header Row

Header contents:

- Title: `Conversations`.
- Counter: `Total · Unread`.
- New message button.

Counter definition:

- First number = total conversations matching current scope, lifecycle, search, and filters.
- Second number = unread conversations for the current user within the same result set.

The second number must not mean replies. Reply count is shown in the `Reply · X` quick chip.

### Search and Utility Row

Controls:

- Search input with placeholder `Search Conversations`.
- Sort button.
- Filter button.
- Active-filter badge on the filter button when advanced filters are active.

The active-filter badge counts filters applied through the full filter modal. It should not double-count visible scope dropdowns or visible quick chips unless product explicitly chooses to include all filters in a global active-filter count.

### Scope Row

Visible dropdowns:

- Ownership scope.
- Lifecycle scope.
- Priority.

Ownership scope options:

- Mine.
- Participating.
- All Users.
- Custom User.

Lifecycle scope options:

- Active.
- Archived.

Optional future lifecycle option:

- All.

Priority options:

- Any Priority.
- Low.
- Medium.
- High.

Default scope:

- Ownership = Mine.
- Lifecycle = Active.
- Priority = Any Priority.

### Bulk Select and Quick Filter Row

Controls:

- Select all checkbox.
- `Unassigned · X`.
- `Late Reply · Y`.
- `Reply · Z`.

Quick chips apply immediately on click and update the list, counter, and row set.

## Primary User Flows

### Flow A - Open Own Conversations

1. User enters the Conversations module.
2. Sidebar loads with Ownership = Mine, Lifecycle = Active, Priority = Any Priority.
3. Conversation rows appear sorted by Most Recent Activity by default.
4. User opens a row.
5. Row becomes selected and the thread/context panels load the selected conversation.
6. Read state updates only for the current user when read conditions are satisfied.

### Flow B - Search Conversations

1. User enters text in Search Conversations.
2. Search runs inside the current ownership, lifecycle, priority, and active filter state.
3. Results remain sorted by the selected sort mode.
4. Counts update to the matching result set.
5. Empty state appears if no results match.

### Flow C - Switch Scope to Broader Admin View

1. User opens the Ownership scope dropdown.
2. User selects Participating, All Users, or Custom User.
3. Sidebar reloads only conversations visible under that scope.
4. Quick chip counts and header counts update.
5. Sort remains Most Recent Activity unless the user has chosen another sort mode.

### Flow D - Filter Unassigned Conversations

1. User clicks `Unassigned · X`.
2. If Ownership scope is Mine, the system must use one of these behaviors:
   - change Ownership scope to All Users and apply Unassigned, or
   - prompt with a clear scope change confirmation if required by product.
3. List shows unassigned conversations visible to the user.
4. Chip appears active.
5. Clearing the chip returns to the previous valid scope/filter state.

Recommended behavior:

- Selecting Unassigned while in Mine changes Ownership scope to All Users and applies the Unassigned chip.

### Flow E - Filter Late Reply or Reply

1. User clicks Late Reply or Reply.
2. Sidebar filters active/open conversations matching the selected work state.
3. Late Reply returns only Late Reply.
4. Reply includes Reply and Late Reply where the product uses Reply as aggregate workload.
5. Archived scope must hide or disable Reply and Late Reply chips unless a future archived-safe behavior is defined.

### Flow F - Change Sort

1. User clicks the sort button.
2. User selects Most Recent Activity or Action Priority.
3. Sidebar reorders current results.
4. Selection remains stable if the selected conversation remains visible.

### Flow G - Use Full Filter Modal

1. User clicks the filter button.
2. Full filter modal opens.
3. User applies advanced filters.
4. Sidebar updates result set and filter badge count.
5. User can clear advanced filters from the modal or a visible reset control.

### Flow H - Bulk Select Conversations

1. User clicks the select all checkbox or selects individual rows.
2. Bulk action bar appears.
3. Only permitted actions are enabled.
4. User completes or cancels the bulk action.
5. Sidebar refreshes affected rows, counts, and selected state.

## Screen / Component Requirements

### Header

Required:

- `Conversations` title.
- `Total · Unread` counter.
- New message icon button.

Rules:

- New message is hidden or disabled if the user cannot initiate outbound conversations.
- Counter updates for current scope and filters.
- Red count styling should be reserved for unread count or another explicitly defined attention count. Version2 defines it as unread.

### Search

Searchable fields:

- contact or conversation name,
- company name,
- phone number,
- email,
- conversation ID,
- channel identifier,
- message preview/body where policy allows,
- assignee,
- tags/labels where supported.

### Sort Button

The Sort button switches between two named view modes:

| Mode | Description |
|---|---|
| **Time-Relative** (default) | Chronological list, most recent first. Pinned section above. |
| **Work Queue** | Sectioned by action priority. Pinned strip above sections. |

**Time-Relative view (default):**

Section order:
1. Pinned section (if current user has pins) — full rows, oldest pin first, draggable
2. Conversation list — sorted by most recent meaningful activity

Sort within conversation list:
1. Latest meaningful customer or team message.
2. Latest relevant conversation activity.
3. Conversation created date.

Low-value system events must not reorder the list.

**Work Queue sort (Action Priority):**

Section order:
1. Pinned strip (if current user has pins) — compact bubbles (collapsed) or full rows (expanded)
2. Late Reply conversations
3. Reply conversations
4. Unassigned conversations
5. High Priority conversations
6. Medium Priority conversations
7. Most Recent Activity (tie-breaker)

Pinned items appear only in the Pinned strip in Work Queue sort. They do not appear again in the sections below.

### Filter Button and Full Filter Modal

The visible filter button opens the full filter modal.

Advanced filters may include:

- assignee/user,
- team,
- inbox,
- channel,
- tags/labels,
- date range,
- temperature,
- AI Sent,
- Waiting,
- Snoozed,
- close reason in Archived scope.

Version2 intentionally hides these from the default sidebar surface unless already represented in the three visible scope dropdowns or quick chips.

### Scope Dropdowns

Ownership dropdown:

- Mine = conversations assigned to current user.
- Participating = conversations where current user is a participant.
- All Users = all conversations visible to current user.
- Custom User = conversations assigned to a selected user visible to current user.

Lifecycle dropdown:

- Active = lifecycle_state = open.
- Archived = lifecycle_state = closed or archived.

Priority dropdown:

- Filters by conversation/contact priority.
- Priority is secondary metadata and must not replace work state.

### Quick Chips

Required quick chips:

- Unassigned.
- Late Reply.
- Reply.

Chip count rules:

- Unassigned count = visible conversations with no current owner in the current compatible lifecycle/filter context.
- Late Reply count = visible open conversations in Late Reply.
- Reply count = visible open conversations requiring reply, including Late Reply and AI Sent pending human review where applicable.

### Conversation Row

Rows follow the supplied version2 design direction.

Required visible row elements:

- avatar,
- contact/conversation name,
- channel icon,
- up to two secondary metadata icons where space permits,
- assignee icon/name where applicable,
- company name,
- latest message preview,
- primary work-state badge,
- timestamp,
- unread count where applicable,
- selected row treatment.

Supported primary work-state badges:

- **Pinned** ← dominant; underlying work state shown as secondary badge when active.
- Reply.
- Late Reply.
- Waiting.
- Snoozed.
- AI, where AI Sent pending human review or AI-handled state is defined.

Row state rules:

- Unread rows may use a subtle green-tinted background.
- Selected row uses a distinct selected treatment, such as a left accent and/or grey row container.
- Selected and unread states must remain visually distinguishable.
- Archived rows must be muted and must not show live urgency styling.
- Secondary metadata icons must not overpower the contact name or primary work-state badge.
- If too many metadata icons apply, show the highest-value icons and summarize hidden indicators with a compact `+N` badge.
- The `+N` badge opens or leads to the row menu/context panel where the hidden indicators can be reviewed.

Recommended metadata display limit:

- Show channel plus up to two additional metadata icons in the row.
- Keep primary row controls fixed: channel icon, work-state badge, unread count, and visible assignee treatment must not be pushed into `+N` overflow when they are required for the current view.

Secondary metadata priority:

1. VIP or key account marker.
2. High priority or risk indicator.
3. AI pending human review when AI action still affects the queue.
4. Important label category when the label materially changes handling.
5. Attachment, form, or note indicator.
6. Temperature signal.
7. Campaign, source, or segment indicator.
8. Low-value decorative metadata.

Rules:

- Use `+N` for hidden metadata when more than two secondary indicators apply.
- Labels/tags may appear as compact pills only when they provide immediate routing or handling context.
- Limit visible label/tag pills in rows; additional labels/tags belong behind `+N`, the row menu, or the right context panel.

## State Model

The version2 sidebar uses the shared Omnichannel conversation state model.

### Read State

Per-user:

- Unread.
- Read.

Rules:

- Opening a conversation as the current admin/lead marks read only for that user when read conditions are satisfied.
- Admin/lead read actions must not clear another user's unread state.

### Current Work State

Primary action states:

- Reply.
- Late Reply.
- Waiting.
- Snoozed.
- None.

Precedence:

1. Late Reply.
2. Reply.
3. Waiting.
4. Snoozed.
5. None.

### Lifecycle State

Lifecycle states:

- Open.
- Closed.
- Archived.

Version2 lifecycle scopes:

- Active shows Open.
- Archived shows Closed or Archived.

### Ownership State

Ownership states:

- Assigned to current user.
- Participating.
- Assigned to another user.
- Unassigned.
- Assigned to selected custom user.

### Secondary Metadata

Secondary metadata may include:

- priority,
- temperature,
- channel,
- VIP,
- AI Sent,
- tags/labels.

Labels/tags are general segmentation and handling metadata. They must not be limited to service interest, and they may represent campaigns, lifecycle context, product interest, customer segment, source, or other product-defined labels.

SLA Breached and Escalated are not required default sidebar signals in version2.

### Personal Flags (per-user, private)
- **Pinned**

Rules:
- Pinned is tracked per user and is never shared with or visible to other users.
- Pinned is the dominant display badge. When a conversation is pinned by the current user, the Pinned badge takes the primary slot; the underlying work state is shown as a secondary badge.
- Pinned does not mutate `current_work_state` and does not affect work-state filters or counts.
- Maximum 10 pinned conversations per user.
- Pinned conversations appear in the Pinned section (Time-Relative view) or Pinned strip (Work Queue sort), not in the main list below.

Pinned strip behavior (Work Queue sort):
- Collapsed state: horizontal row of avatar bubbles + unread count overlays.
- Expanded state: full conversation rows, same as Pinned section in Time-Relative view.
- Toggle persists per user session.

Pinned order:
- Oldest pin first by default.
- User can drag to reorder. Order persists.

Pin overflow:
- Pinning an 11th conversation is blocked. Error toast: *"You've reached the maximum of 10 pinned conversations. Unpin one to continue."*

Pin and Unpin actions:
- Available via row context menu in both Time-Relative and Work Queue views.
- In Work Queue bubble strip: available via bubble right-click/long-press context menu.

## Data Model / Fields

Required displayed or computed fields:

- conversation_id,
- contact_id,
- contact_display_name,
- company_id,
- company_display_name,
- channel_type,
- channel_identifier,
- owner_user_id,
- owner_display_name,
- participant_user_ids,
- lifecycle_state,
- current_work_state,
- priority,
- temperature,
- latest_message_preview,
- latest_meaningful_message_at,
- latest_relevant_activity_at,
- created_at,
- unread_count_by_user,
- last_seen_at_by_user,
- last_seen_message_id_by_user,
- reply_required_flag,
- late_reply_flag,
- ai_sent_pending_human_review_flag,
- archived_at,
- closed_at,
- close_reason.

Optional fields:

- avatar_url,
- tags,
- inbox_id,
- team_id,
- snoozed_until,
- waiting_since,
- last_assignment_changed_at.

Personal flag fields (per-user, private):
- `pinned_at_by_user{}` — map of user_id → ISO timestamp when pinned,
- `pin_order_by_user{}` — map of user_id → integer index (0–9),
- `pinned_conversation_ids_by_user{}` — map of user_id → ordered array of conversation_ids (max 10 per user).

Rules:
- These fields are strictly user-scoped and must not be returned in responses for other users.
- `pin_order_by_user` updates on every drag-reorder.
- Enforced max of 10 entries per user at the API level.

## Business Rules

- Default sidebar scope is Mine + Active + Any Priority.
- Default sort is Most Recent Activity.
- Most Recent Activity must prioritize meaningful customer/team messages over low-value system events.
- Action Priority is optional and user-selected.
- Reply and Late Reply chips are active/open conversation filters.
- Archived scope is for retrieval/history, not live workload.
- If Archived scope is selected, Reply and Late Reply chips must be hidden or disabled unless future archived-specific behavior is defined.
- Unassigned is a first-class quick filter.
- If Unassigned is selected while Ownership = Mine, the system must resolve the scope conflict by switching to All Users with Unassigned active or another clearly defined behavior.
- Header counts must reflect the current result set.
- Filter badge count must be deterministic and explainable.
- Priority is a filter and secondary row indicator, not the main row state.
- Visibility permissions always constrain row lists, counts, search results, and filter options.

## Validation and Safeguards

### Hard Prevents

- Prevent users from viewing scopes they do not have permission to access.
- Prevent counts from leaking hidden conversations.
- Prevent direct links from opening restricted conversations without authorization.
- Prevent bulk actions on rows the user is not permitted to modify.
- Prevent archived rows from being treated as active reply workload.

### Soft Warnings

- Warn when applying a quick chip will change ownership scope, such as Mine to All Users for Unassigned, if product chooses not to switch silently.
- Warn when selected bulk rows include mixed permissions or incompatible lifecycle states.
- Warn when search is limited because message body search permission is unavailable.

## Empty, Loading, Error, and Edge States

Required states:

- loading conversations,
- loading more conversations,
- no active conversations,
- no archived conversations,
- no conversations match filters,
- no search results,
- permission-restricted scope,
- partial data unavailable,
- failed to load conversations.

Recommended copy:

- `No conversations match these filters`.
- `No active conversations`.
- `No archived conversations yet`.
- `You do not have permission to view this conversation set`.
- `Search is limited by your permissions`.

Edge cases:

- Conversation changes owner while visible.
- Conversation becomes archived while selected.
- Archived conversation receives inbound and reopens.
- User selects Unassigned while in Mine.
- Custom User is deactivated or no longer visible.
- Search result is visible but message body is redacted.
- Bulk-selected rows change state before action confirmation.
- New inbound arrives while the list is sorted by recency.

## Automations and Notifications

Sidebar must reflect these automations where supported by the Omnichannel system:

- auto-reopen closed/archived conversation on new inbound,
- auto-clear snooze when new inbound arrives,
- auto-recalculate current work state,
- auto-recalculate per-user unread state,
- auto-refresh counts and quick chip totals,
- optional notify assignee/current owner when assigned or reopened.

Version2 does not require sidebar-specific SLA or escalation automations.

## Integrations and Dependencies

Dependencies:

- Omnichannel conversation service.
- User/permission service.
- Search/indexing service.
- Assignment/ownership service.
- Lifecycle close/archive/reopen service.
- Channel connectors for latest message and channel metadata.
- Right context panel for deeper CRM and ownership details.
- Conversation thread panel for read state, reply execution, and message history.

Cross-PRD sync:

- Sales sidebar remains source of truth for reply-first sales queue behavior.
- Version2 admin sidebar is source of truth for admin/lead sidebar scope and layout.
- Thread panel remains source of truth for composer and conversation execution.
- Right context panel remains source of truth for deeper CRM, lifecycle metadata, and advanced management actions.

## Analytics, Reporting, and KPIs

Required analytics:

- sidebar viewed,
- ownership scope changed,
- lifecycle scope changed,
- priority filter changed,
- quick chip clicked,
- sort changed,
- view mode changed (time_relative ↔ work_queue),
- full filter modal opened,
- advanced filters applied,
- search performed,
- conversation row opened,
- new message clicked,
- bulk selection started,
- conversation pinned,
- conversation unpinned,
- pinned strip expanded,
- pinned strip collapsed,
- pinned order changed.

Sidebar metrics:

- total matching conversations,
- unread conversations for current user,
- reply required count,
- late reply count,
- unassigned count,
- active conversations count,
- archived conversations count,
- conversations opened from Mine scope,
- conversations opened from broader scopes,
- pin usage rate (% of active users with at least one pin),
- average pins per active user,
- view mode usage: % of sessions in Time-Relative vs Work Queue.

Success-oriented KPIs:

- time to find a conversation,
- percent of admin/lead sessions starting in Mine,
- use rate of All Users and Custom User scopes,
- use rate of quick chips,
- reduction in filter modal dependency for common workflows.

## Audit / Activity Events

Required audit/activity events where applicable:

- admin_sidebar_viewed,
- conversation_search_performed,
- conversation_scope_changed,
- conversation_filter_applied,
- conversation_sort_changed,
- conversation_view_mode_changed (time_relative / work_queue),
- conversation_opened_from_sidebar,
- conversation_bulk_selected,
- conversation_marked_read,
- conversation_marked_unread,
- conversation_assigned,
- conversation_reassigned,
- conversation_closed,
- conversation_reopened,
- conversation_restored,
- new_outbound_conversation_started,
- conversation_pinned,
- conversation_unpinned,
- pinned_strip_expanded,
- pinned_strip_collapsed,
- pinned_order_changed.

Audit metadata should include:

- actor_user_id,
- timestamp,
- source surface = Admin Conversations Sidebar Version2,
- previous value and new value where state changes,
- conversation IDs where applicable,
- scope/filter/sort metadata where applicable.

## Accessibility, Security, and Privacy

Accessibility:

- All icon-only controls require accessible names. Visible labels, expanded states, or surrounding context should be used where the icon meaning is not obvious; hover-only tooltips are optional and must not be the only way to understand a control.
- Dropdowns, chips, search, and row selection must be keyboard accessible.
- Selected row, unread row, and active chip states must not rely on color alone.
- Text truncation must preserve access to full values through an expanded row, row menu, context panel, accessible name, or optional tooltip.
- Focus order must follow visual order.

Security and privacy:

- Search results must respect message-content permissions.
- Counts must be permission-aware.
- Custom User scope must only expose users and conversations the current user may inspect.
- Archived conversations must respect archived visibility permissions.
- Redacted or restricted content must remain redacted in previews.

## Responsive Behavior

The sidebar is optimized for a narrow desktop column similar to the supplied mockup.

Rules:

- Header, search, utility controls, scope row, and quick chips must remain usable at narrow sidebar widths.
- Text must truncate cleanly without overlapping row badges or timestamps.
- Row metadata icons may collapse when space is constrained.
- The full filter experience may be a modal, drawer, or sheet depending on viewport.
- Touch targets must remain usable on tablet/mobile widths if the sidebar becomes a full-screen list.

## Recommended v1 Scope

For first implementation of version2, ship:

- Title, counter, and new message action.
- Search input.
- Sort button with Most Recent Activity and Action Priority.
- Filter button opening full filter modal.
- Ownership scope: Mine, Participating, All Users, Custom User.
- Lifecycle scope: Active, Archived.
- Priority dropdown: Any, Low, Medium, High.
- Select all checkbox and bulk selection state.
- Quick chips: Unassigned, Late Reply, Reply.
- Conversation rows matching the supplied design.
- Default Mine + Active + recency behavior.
- Permission-aware counts and visibility.
- Per-user unread behavior.
- Empty/loading/error states.

## Future Enhancements

- Lifecycle scope option for All.
- Saved views.
- Team and inbox as visible scope-row controls if usage proves frequent.
- Customizable quick chips.
- More advanced sort modes.
- Row metadata overflow menu.
- Persistent per-user sidebar preferences.
- Admin-only SLA or escalation module outside the default v2 sidebar.
- Archived result grouping by close reason or archived date.

## Acceptance Criteria

- Given a permitted admin/lead opens Conversations, the sidebar defaults to Mine + Active + Any Priority in Time-Relative view.
- Given the default sidebar loads, rows are shown in Time-Relative order (most recent first), with a Pinned section above if the user has pins.
- Given the header counter displays `A · B`, A equals total matching conversations and B equals unread conversations for the current user.
- Given the user clicks the sort button, they can switch between Time-Relative view and Work Queue sort.
- Given the user selects Work Queue sort, the Pinned strip (if applicable) appears first, followed by Late Reply rows, then Reply rows, then Unassigned and priority-ranked rows, with recency as tie-breaker.
- Given the user pins a conversation, it moves to the Pinned section/strip and shows Pinned as the primary badge.
- Given the user pins a conversation and it has an underlying work state (e.g., Late Reply), the underlying work state is shown as a secondary badge.
- Given the user attempts to pin an 11th conversation, they receive an error toast and the pin is not applied.
- Given a pinned conversation is unpinned, it returns to its normal position in the list with its underlying work state as the primary badge.
- Given the user changes Ownership scope, row results and all counts update to the new permission-aware scope.
- Given the user selects Custom User, only conversations assigned to the selected visible user appear.
- Given the user selects Archived, only closed/archived conversations appear.
- Given Archived scope is selected, Reply and Late Reply quick chips are hidden or disabled.
- Given the user clicks Unassigned from Mine, the system applies a defined scope transition and shows unassigned conversations visible to the user.
- Given the user uses search, results remain constrained by current scope, lifecycle, priority, and permissions.
- Given advanced filters are applied, the filter button shows an active-filter badge.
- Given the user opens a conversation, read state updates only for the current user when read conditions are met.
- Given a row is unread and selected, both states remain visually distinguishable.
- Given a user lacks permission for a scope or action, the option is hidden or disabled and no hidden rows/counts leak.

## Success Criteria

- Admins/leads can handle their own conversations without first clearing team-wide noise.
- Admins/leads can switch into broader monitoring scopes without leaving the sidebar.
- Users understand the difference between ownership scope, lifecycle scope, priority, quick chips, and advanced filters.
- Common filtering requires fewer clicks than the archived v1 admin PRD direction.
- Row scanning remains fast and visually clear at production data volumes.
- The sidebar remains aligned with shared Omnichannel state, lifecycle, read/unread, and permissions logic.

## Open Questions / Decisions Needed

- Should selecting Unassigned from Mine silently switch Ownership to All Users, or show a confirmation/temporary expanded state?
- Should Reply count include Late Reply in all contexts, or should Reply exclude Late Reply when Late Reply chip is visible beside it?
- Should the filter badge count include visible scope dropdowns and quick chips, or only hidden advanced filters?
- Should Active/Archived be enough for version2, or should All be included in the first implementation?
- Should Priority values be Low/Medium/High only, or include Any Priority and No Priority?
- Should AI badge represent AI Sent pending human review, AI-handled conversation, or both?

## Release Readiness Checklist

- [ ] Product behavior reviewed
- [ ] UX states reviewed
- [ ] Permissions reviewed
- [ ] Data and analytics reviewed
- [ ] QA acceptance criteria reviewed
- [ ] Open questions resolved or explicitly deferred
