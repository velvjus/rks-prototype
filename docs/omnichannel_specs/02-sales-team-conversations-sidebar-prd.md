# RakanSales Omnichannel Sales Team Sidebar PRD
**Document type:** Consolidated product requirements document (sidebar scope only)  
**Module:** Omnichannel -> Sales Team Conversations Sidebar  
**Version date:** 2026-05-14  
**Status:** Consolidated working master for sales team sidebar design and logic

---

# 1. Purpose

This document is the **single consolidated PRD/specification for the RakanSales Omnichannel Sales Team Conversations Sidebar** based on all decisions made in this discussion.

It is intended to become the working master for the **sales rep left-side conversation list / work queue** only.

This document consolidates:
- sidebar information architecture,
- action/filter bar behavior,
- current work state logic,
- lifecycle state logic,
- Active / Archived / All scope behavior,
- counters,
- sorting,
- row states,
- bulk actions,
- archive/reopen behavior,
- close reasons,
- filter compatibility rules,
- archived UI treatment,
- search behavior,
- edge cases,
- permissions,
- audit events,
- KPI/reporting impact.

This document does **not** cover the middle conversation thread panel or the top conversation header bar in full detail beyond sidebar-related interactions.

---

# 2. Product Goal

The Sales Team sidebar must serve as a **conversation-first workspace** that feels natural and familiar to sales reps while giving them access to structured workload management when they need it.

The sidebar has two modes:
- **Time-Relative view (default)** — a chronological conversation list, most recent first, familiar to anyone who uses a messaging app. This is the default entry point.
- **Work Queue sort** — a structured, action-priority view accessible via the Sort button, sectioned into Reply Required and Waiting & Snoozed. This is the power tool for managing backlog.

The sidebar should help sales teams:
- stay in natural conversation flow without feeling like they are working a ticket queue,
- quickly surface conversations they personally care about via Pinned,
- identify which conversations still need human reply when in work queue mode,
- identify which conversations have become late,
- keep visibility of waiting and snoozed conversations,
- manage finished conversations cleanly via lifecycle state,
- retrieve archived conversations without polluting the active work queue,
- act quickly at row level, bulk level, and opened-thread level.

The long-run design principle is:

**Default view = conversation-first, time-relative**  
**Work queue sort = action layer, on demand**  
**Lifecycle state = visibility / retrieval layer**

---

# 3. Core UX Principles

## 3.1 Conversation-first by default, work queue on demand
The default view is a **time-relative conversation list** — familiar, fast, and approachable for any sales rep.

When a rep needs structured workload management, they switch to **Work Queue sort** via the Sort button. This gives them:
- reply accountability,
- action accountability,
- work queue clarity.

The sidebar is **not** locked into a ticket-queue mindset by default.

## 3.2 Keep active work and historical retrieval separate
Active conversations should remain easy to scan and prioritize.

Archived conversations must remain accessible, but should not visually compete with current reply workload.

## 3.3 Read state is not work state
A conversation may be:
- unread and reply-required,
- read and still reply-required,
- read and waiting,
- archived and historically unread for a user,
- reopened and newly unread again.

Unread is a visibility state.  
Reply / Late Reply / Waiting / Snoozed are work states.

## 3.4 Contact-level metadata is not conversation work state
These are secondary indicators only:
- VIP,
- High Priority,
- Temperature,
- Channel,
- AI Sent / Assist acted,
- labels/tags.

They must not replace the primary action state of the row.

## 3.5 Active sidebar rows should remain simple
The row should prioritize:
- who the conversation is with,
- whether it is unread,
- whether it needs reply,
- whether it is late,
- whether it is waiting or snoozed,
- key metadata like channel/VIP/priority.
- compact labels/tags only when they help the rep triage the conversation.

Lifecycle state should mainly appear through:
- scope/view filter,
- actions,
- detail metadata,
- archived styling.

## 3.6 Pinned is personal
The system must support a personal Pinned flag that is strictly per-user and private.

Pinned conversations:
- are visible only to the user who pinned them,
- are never surfaced to other users, admins, or in any shared view,
- represent the user's own mental model of what needs attention.

---

# 4. Scope of This PRD

This PRD covers the Sales Team left-side sidebar only, including:
- title area,
- search,
- filter/action bar,
- counters,
- grouping,
- row behavior,
- bulk selection,
- archived access,
- restore/reopen flow.

This PRD does not fully define:
- message composer UX,
- thread body layout,
- conversation panel header-bar details outside sidebar interactions,
- right-side CRM detail panel beyond lifecycle metadata requirements.

---

# 5. Sidebar Information Architecture

The sidebar must be structured as a **compact operational queue**.

## 5.1 High-level areas
The sidebar consists of:
1. Title row
2. Search + quick utility controls
3. Action / filter bar
4. Bulk action bar (when multi-select is active)
5. Sectioned conversation list
6. Empty / loading / error / permission states

## 5.2 Section model
The section model depends on the active **view mode**.

### Default view — Time-Relative
In Active scope:
- **Pinned** section (shown only if the current user has pinned items; full conversation rows, oldest pin first, user-draggable)
- **Conversation list** — all unpinned active conversations, sorted by most recent message activity, no sub-section headers

In Archived scope:
- Archived conversations shown as retrieval/history list (unchanged)

In All scope:
- **Active Results**
- **Archived Results**
(unchanged)

### Work Queue sort (via Sort button)
In Active scope:
- **Pinned strip** (shown only if the current user has pinned items; see Section 22.5 for strip behavior)
- **Reply Required**
- **Waiting & Snoozed**

In Archived scope and All scope:
- Unchanged from today — Pinned strip does not apply to Archived or All scope.

---

# 6. Sidebar Header

## 6.1 Title
Primary title:
- **Conversations**

## 6.2 Header count
Example:
`20 · 6`

Meaning:
- first number = total conversations visible in current scope
- second number = unread conversations visible in current scope

Rules:
- counts must update based on ownership scope + lifecycle scope + current search/filter state where appropriate
- counts must remain trustworthy and deterministic

## 6.3 New outbound action
Header includes:
- new outbound message / compose button

---

# 7. Search and Utility Controls

## 7.1 Search
The sidebar includes a search input:
- placeholder: `Search Conversations`
- searches within the current lifecycle scope unless user switches to another scope

### Search rules
- **Active** scope searches only open/active conversations
- **Archived** scope searches only archived conversations
- **All** scope searches both active and archived

## 7.2 Utility controls
The search row includes:
- **Sort button** — toggles between view modes: **Time-Relative** (default) and **Work Queue**. The active mode is indicated on the button.
- **Filter button** — opens the advanced filter modal
- **Active filter badge** — shows number of active advanced filters on the filter button

Sort button behavior:
- Default state = Time-Relative mode
- Pressing Sort button opens a mode picker or directly toggles to Work Queue
- The selected view mode persists for the current user session

---

# 8. Action / Filter Bar

The action/filter bar is compact and always visible.

## 8.1 Required controls
- Bulk select checkbox
- Ownership scope dropdown
- Reply filter chip with live count
- Late Reply filter chip with live count
- Unread filter chip
- Lifecycle scope dropdown

## 8.2 Ownership scope dropdown
Required options:
- **Mine**
- **Participating**
- **Unassigned**
- **All**

### Ownership scope rules
**Mine**
- conversations currently owned by the user

**Participating**
- conversations where the user is a participant and can reply

**Unassigned**
- conversations with no current owner

**All**
- all visible conversations the user has permission to access

## 8.3 Work-state chips
Required chips:
- **Reply · X**
- **Late Reply · Y**
- **Unread**

### Rules
- Reply count includes:
  - reply-required conversations,
  - late-reply conversations,
  - AI Sent conversations that still require human review
- Late Reply count is a subset of Reply
- Unread is per-user

## 8.4 Lifecycle scope dropdown
Required options:
- **Active**
- **Archived**
- **All**

### Rules
- Default scope = **Active**
- Lifecycle scope controls whether the sidebar is showing active queue, archived retrieval, or both
- Lifecycle scope is distinct from current work state

---

# 9. Conversation State Model

The sidebar uses a multi-layer state model.

## 9.1 Layer A — Read state
Per-user visibility state:
- Unread
- Read

## 9.2 Layer B — Current work state
Primary action state:
- Reply
- Late Reply
- Waiting
- Snoozed
- None

## 9.3 Layer C — Lifecycle state
Visibility / retrieval state:
- Open
- Closed
- Archived

## 9.4 Layer D — Secondary metadata
Secondary contextual indicators:
- VIP
- High Priority
- Temperature
- Channel
- AI Sent
- Labels / tags

Labels/tags are general segmentation and handling metadata. They are not limited to Service Interest and may represent service interest, campaign, customer segment, source, lifecycle context, product interest, or other product-defined labels.

## 9.5 Layer E — Personal flags (per-user, private)
- **Pinned**

Rules:
- Pinned is tracked per user and is never shared with other users.
- Pinned affects display placement and the primary badge shown on the row.
- Pinned does not mutate the conversation's `current_work_state` field in the data model.
- Underlying work state is preserved and shown as a secondary badge when Pinned is active.
- Maximum 10 pinned conversations per user.

---

# 10. Read State Logic

## 10.1 Definition
Unread means the current user has not yet viewed the latest relevant activity in the conversation.

## 10.2 Unread rules
A conversation becomes unread for a user when:
- a new inbound customer message arrives after the user's last-seen point, or
- the conversation is newly assigned to that user and the latest relevant activity still requires viewing by that user

A conversation becomes read for that user when:
- the user opens the conversation,
- the latest relevant inbound content is viewed,
- and the product's read condition is satisfied

## 10.3 Per-user implementation rule
Unread must be tracked **per user**, not globally.

Recommended storage:
- last_seen_at_by_user
- last_seen_message_id_by_user
- unread_count_by_user

## 10.4 Reassignment rules
### Case A — latest customer message still needs handling
New owner should see:
- Unread
- plus correct work state (Reply or Late Reply)

### Case B — latest customer message already handled
Ownership change alone must not regenerate fake unread.

---

# 11. Current Work State Logic

Each conversation may have **one primary current work state** at a time.

## 11.1 State precedence

### Display precedence (badge shown on the row)
Pinned is the dominant display signal. When a conversation is pinned by the current user, the Pinned badge takes the primary slot regardless of underlying work state.

1. **Pinned** ← dominant; underlying work state shown as secondary badge
2. Late Reply
3. Reply
4. Waiting
5. Snoozed
6. None

### Work state precedence (for queue logic, filtering, and counting)
Pinned does not affect queue logic. Filters and counts use underlying work state only.

1. Late Reply
2. Reply
3. Waiting
4. Snoozed
5. None

## 11.2 Reply
A conversation is in Reply when:
- the latest meaningful state still needs human reply/handling,
- it is not yet late,
- it is not waiting,
- it is not snoozed

This includes:
- normal inbound customer messages awaiting human reply
- AI Sent conversations where human follow-through is still expected

## 11.3 Late Reply
A conversation is in Late Reply when:
- it qualifies as Reply,
- and it has crossed the configured reply threshold

Meaning:
- customer is still waiting,
- reply has taken too long

Late Reply is a subset of Reply.

## 11.4 Waiting
A conversation is Waiting when:
- the team has already acted,
- the next step belongs to the customer or another external/internal party,
- there is no current reply obligation,
- it is not snoozed

## 11.5 Snoozed
A conversation is Snoozed when:
- it has been intentionally deferred until a future time/event,
- it should not compete with active work

### Snooze wake-up rule
If a snoozed conversation receives a new inbound message:
- it wakes up quietly,
- leaves Snoozed,
- re-enters Active logic as Reply or Late Reply

## 11.6 None
Neutral fallback state when no active work-state applies.

## 11.7 Pinned display logic
Pinned is a personal display flag, not a system work state.

When a conversation is pinned by the current user:
- The primary row badge shows **Pinned**.
- The underlying work state (e.g., Reply, Late Reply, Waiting) is shown as a secondary badge beside or below the Pinned badge, so the rep is never blind to urgency.
- The conversation moves to the **Pinned section** in Time-Relative view, or the **Pinned strip** in Work Queue sort.
- The conversation does not appear in the main list below its dedicated section.
- The conversation is still counted by Reply, Late Reply, and other work-state chips/filters. Pinned does not suppress counting logic.

When a conversation is unpinned:
- It returns to its normal position in the Time-Relative list (sorted by recency).
- Its primary badge reverts to the underlying work state.

---

# 12. Lifecycle State Logic

Lifecycle state is a separate long-run layer from current work state.

## 12.1 Open
Conversation remains operationally active and participates in normal queue logic.

Open conversations may be:
- Reply
- Late Reply
- Waiting
- Snoozed
- None

## 12.2 Closed
Conversation has been intentionally ended for the current thread outcome.

Examples:
- inquiry answered,
- no further reply needed,
- lead disqualified,
- discussion completed,
- duplicate confirmed,
- spam confirmed

## 12.3 Archived
Conversation has been removed from the default active queue but remains searchable, viewable, and restorable according to permissions.

## 12.4 Recommended v1 product behavior
For simplicity:
- user action is exposed primarily as **Close Conversation**
- once closed, conversation leaves default Active scope
- closed conversations become visible in Archived scope
- new inbound messages auto-reopen archived conversations

Internally, lifecycle state must still be modeled explicitly.

---

# 13. Work State vs Lifecycle State Rules

## Rule 1
Only Open conversations participate in normal Active queue ranking.

## Rule 2
Lifecycle state does not replace work state.

Valid combinations include:
- Open + Reply
- Open + Late Reply
- Open + Waiting
- Open + Snoozed

## Rule 3
Closed/Archived conversations do not appear in the default Active queue.

## Rule 4
If a closed/archived conversation receives new inbound activity:
- lifecycle returns to Open
- work state recalculates
- unread recalculates per user
- conversation returns to Active queue

## Rule 5
AI Sent remains secondary metadata and can still count inside Reply workload while lifecycle = Open.

---

# 14. AI Sent Logic

## 14.1 Meaning
AI Sent means:
- the assistant has already acted,
- but human rep review/check/follow-through may still be required

## 14.2 Display rule
AI Sent is a **secondary indicator**, not the primary row state.

Valid combinations:
- Reply + AI Sent
- Late Reply + AI Sent
- Waiting + AI Sent

## 14.3 Queue rule
AI Sent does not automatically clear a conversation from Reply workload unless business logic explicitly determines no human action is needed.

---

# 15. List Sections and Grouping

## 15.1 Active scope grouping — Time-Relative view (default)
Show:
- **Pinned** section (only if the current user has at least one pin)
  - Full conversation rows, oldest pin first, user-draggable to reorder
  - Pinned items do not appear in the list below
- **Conversation list** (all unpinned active conversations)
  - Flat chronological list, most recent message activity first
  - No sub-section headers in the unpinned list

## 15.2 Active scope grouping — Work Queue sort
Show:
- **Pinned strip** (only if the current user has at least one pin; see Section 22.5)
- **Reply Required**
- **Waiting & Snoozed**

Pinned items appear only in the strip. They do not appear again in Reply Required or Waiting & Snoozed.

## 15.3 Archived scope grouping
Archived conversations shown as retrieval/history list (unchanged by view mode).

## 15.4 All scope grouping
Show:
- **Active Results**
- **Archived Results**

Critical rule:
- Active and Archived conversations must not be interleaved into one flat list in All scope.
- Pinned strip/section does not apply in All scope or Archived scope.

---

# 16. Filter Compatibility Rules

## 16.1 Active scope
Shows only conversations where lifecycle_state = Open.

Allowed:
- Mine / Participating / Unassigned / All
- Search
- Reply
- Late Reply
- Unread
- metadata filters if supported

## 16.2 Archived scope
Shows only conversations where lifecycle_state = Closed / Archived.

Allowed:
- Mine / Participating / Unassigned / All
- Search
- archived-safe metadata filters
- labels/tags if supported

Recommended hidden/disabled:
- Reply
- Late Reply
- Unread

Reason:
Archived is a retrieval/history view, not a live work queue.

## 16.3 All scope
Shows both Active and Archived.

Allowed:
- ownership scope
- search
- unread
- reply
- late reply
- metadata filters

Rules:
- Reply / Late Reply / Unread apply only to Active/Open conversations inside All
- if a work-state chip is active in All, Archived results are hidden automatically
- if no work-state chip is active, both Active and Archived may appear

---

# 17. Ownership + Lifecycle Combination Rules

## 17.1 Mine + Active
Open conversations owned by current user

## 17.2 Participating + Active
Open conversations where current user is a participant and can reply

## 17.3 Unassigned + Active
Open conversations with no current owner

## 17.4 All + Active
All visible open conversations

## 17.5 Mine + Archived
Archived conversations historically owned by or last assigned to current user

## 17.6 Participating + Archived
Archived conversations where current user was a participant

## 17.7 Unassigned + Archived
Allowed only if archived conversations can legitimately have no owner

## 17.8 All + Archived
All archived conversations visible to the user

---

# 18. Work-State Filter Rules

## 18.1 Reply
Returns:
- Reply
- Late Reply
- AI Sent pending human review

Valid only for Open/Active conversations.

In Archived scope:
- hidden or disabled

## 18.2 Late Reply
Returns:
- only Late Reply conversations

Valid only for Open/Active conversations.

In Archived scope:
- hidden or disabled

## 18.3 Unread
Returns:
- conversations unread for the current user

Valid in:
- Active
- All

Recommended in Archived:
- hidden or disabled

---

# 19. Combination Behavior Rules

## 19.1 Archived + Reply
- hidden or disabled

## 19.2 Archived + Late Reply
- hidden or disabled

## 19.3 Archived + Unread
- hidden or disabled

## 19.4 All + Reply
- show only active/open reply-required conversations
- archived hidden automatically

## 19.5 All + Late Reply
- show only active/open late-reply conversations
- archived hidden automatically

## 19.6 All + Unread
- show only active/open unread conversations

## 19.7 Active + no work-state chip
- show all open conversations grouped normally

## 19.8 Archived + no work-state chip
- show archived conversations only

---

# 20. Counter Logic

## 20.1 Header counts
Example:
`20 · 6`

Meaning:
- 20 = total visible conversations in current scope
- 6 = unread visible conversations in current scope

## 20.2 Chip counts
Example:
- Reply · 5
- Late Reply · 2

### Reply count includes
- standard reply-required conversations
- AI Sent conversations still needing human review
- Late Reply conversations

### Late Reply count includes
- only Late Reply conversations

Rule:
- Late Reply count is a subset of Reply count

## 20.3 Scope-sensitive counters
Counters must update based on:
- lifecycle scope
- ownership scope
- active filters where relevant

---

# 21. Sort Rules

Sorting must be explicit and deterministic.

## 21.1 View modes
The sidebar has two primary view modes selected via the Sort button:

| Mode | Trigger | Description |
|---|---|---|
| **Time-Relative** | Default | Flat chronological list, most recent first. Pinned section above. |
| **Work Queue** | Sort button | Sectioned by work state. Pinned strip above Reply Required. |

## 21.2 Time-Relative view sort (default)
Active scope order:
1. **Pinned section** (if any pins exist) — oldest pin first; user drag overrides
2. **Conversation list** — sorted by most recent meaningful message activity

Sort within the conversation list:
1. Latest meaningful customer or team message timestamp
2. Latest relevant conversation activity timestamp
3. Conversation created date (tie-breaker)

Low-value system events must not reorder the list.

## 21.3 Work Queue sort — Active scope section order
1. **Pinned strip** (if any pins exist)
2. **Reply Required**
3. **Waiting & Snoozed**

## 21.4 Sort inside Reply Required
Sort by:
1. Late Reply
2. Reply
3. High Priority
4. VIP
5. Longest waiting time since last inbound requiring reply
6. Most recent activity (tie-breaker)

## 21.5 Sort inside Waiting & Snoozed
Sort by:
1. Waiting
2. Snoozed
3. High Priority
4. VIP
5. Most recent activity

### Future optional enhancement
Snoozed may later sort by nearest wake-up time first.

## 21.6 Sort within Pinned section / strip
- Default order: oldest pin first (index 0 at top / leftmost bubble)
- User drag-to-reorder overrides index
- In the work queue bubble strip: oldest pin = leftmost bubble, newest pin = rightmost
- Drag reorder is persistent for the user across sessions

## 21.7 Archived scope sort
Default:
1. Most recently archived
2. Most recently closed
3. Most recent activity before archive

Fallback:
- if archive timestamp unavailable, sort by most recently closed

## 21.8 All scope sort
Section order:
1. Active Results
2. Archived Results

Inside each section:
- use the corresponding scope sort rules

Critical rule:
- no flat interleaving of active and archived rows

## 21.9 Search sort rules
### Active search
- active queue logic
- text relevance inside ties

### Archived search
- text relevance
- most recently archived

### All search
1. Active matches
2. Archived matches

Within each:
- text relevance
- then view-specific sort

---

# 22. Sidebar Row Design Requirements

## 22.1 Required visible row elements
- avatar
- contact/conversation name
- channel icon
- message preview
- timestamp
- unread count
- primary current work-state badge when applicable
- secondary metadata icons where applicable

## 22.2 Row background rules
- Unread row background = green
- Selected active row = grey
- selected and unread states must remain visually distinguishable

## 22.3 Primary row badge
Only one primary badge displayed at a time:
- **Pinned** ← dominant; overrides all other work states for display
- Reply
- Late Reply
- Waiting
- Snoozed

When Pinned is the primary badge, the underlying work state (e.g., Reply, Late Reply) is shown as a secondary badge on the same row.

## 22.4 Secondary metadata indicators
May include:
- VIP
- High Priority
- Temperature
- AI Sent
- Channel
- Labels / tags
- Attachment, form, or note indicator
- Campaign, source, or segment indicator

Rules:
- secondary metadata must not overpower primary work-state badge
- channel icon is fixed and should remain visible when the row has channel data
- show no more than two secondary metadata icons beside the channel icon
- when more than two secondary metadata indicators apply, show the highest-priority indicators and summarize the rest with a compact `+N` badge
- the `+N` badge represents hidden metadata and should open or lead to the row menu/context panel where the full set can be reviewed
- labels/tags may appear as compact pills in the row only when they materially help triage; additional labels/tags should be hidden behind `+N`, the row menu, or the context panel

Secondary metadata priority:
1. VIP or key account marker
2. High Priority or risk indicator
3. AI pending human review when it still affects Reply workload
4. Important label category when it materially changes handling
5. Attachment, form, or note indicator
6. Temperature signal
7. Campaign, source, or segment indicator
8. Low-value decorative metadata

Fixed row elements that must not be hidden behind `+N`:
- channel icon
- primary work-state badge
- unread count
- assignee treatment when visible in the current sidebar mode

## 22.5 Pinned strip (Work Queue sort mode)
The Pinned strip appears above the Reply Required section in Work Queue sort mode. It is only shown if the current user has at least one pinned conversation.

### Collapsed state (default)
- Horizontal scrollable row of circular avatar bubbles
- Each bubble: contact photo or initials
- Unread count badge overlaid on each bubble (hidden if zero)
- Bubbles ordered left-to-right: oldest pin first
- Max 10 bubbles
- Tapping/clicking a bubble opens that conversation
- Right-click / long-press on a bubble shows a context menu: **Open**, **Unpin**
- Expand toggle (chevron or expand icon) at the right end of the strip

### Expanded state
- Pinned conversations shown as full normal conversation rows, stacked vertically
- Section header: **Pinned · [count]** with a collapse toggle
- Row order matches bubble order (oldest pin first, drag-reordered)
- Each row includes a drag handle for reordering
- Row context menu includes **Unpin** and standard conversation actions

### Strip state persistence
- The collapsed/expanded state persists for the current user within the session.

## 22.6 Pinned section (Time-Relative default view)
The Pinned section appears at the very top of the Active conversation list in Time-Relative view. It is only shown if the current user has at least one pinned conversation.

- Section header: **Pinned · [count]**
- Rows are full conversation rows, ordered oldest pin first
- Each row includes a drag handle for reordering
- Row context menu includes **Unpin** and standard conversation actions
- Pinned items do not appear again in the chronological list below

---

# 23. Archived Row UI Behavior

Archived conversations must look historical, not active.

## 23.1 Archived row styling
Archived rows should:
- be slightly muted
- have softer preview emphasis
- not use green unread background
- not show Reply or Late Reply pills
- not use live urgency styling

## 23.2 Recommended archived indicators
Archived rows may show:
- muted **Archived** pill
- archive icon
- optional metadata:
  - Archived 12d ago
  - Closed as No Response

## 23.3 Required principle
Archived rows should remain readable and accessible, but clearly non-active.

---

# 24. All-Scope Search Disclosure

When searching in All scope, UI must distinguish:
- Active Results
- Archived Results

## 24.1 Required archived result styling in All
Archived results should use:
- muted text emphasis
- Archived badge/icon
- no active-state badge
- optional archive/close recency metadata

Rule:
- archived results must not resemble active reply workload

---

# 25. Bulk Selection and Bulk Actions

## 25.1 Bulk selection
Sidebar includes bulk-select checkbox.

When one or more rows are selected:
- show bulk action bar
- show selected count

## 25.2 Bulk actions for active scope
Recommended:
- Mark read
- Mark unread
- Mark Waiting
- Snooze
- Assign
- Tag / label
- Close selected conversations
- **Pin** (available if selected items would not exceed user's 10-pin limit; blocked with error toast if overflow)
- **Unpin** (available if any selected items are currently pinned by the current user)

## 25.3 Bulk actions for archived scope
Recommended:
- Restore from Archive
- Reopen selected conversations
- Tag / label if supported

## 25.4 Permission rules
Bulk actions must respect permissions.

---

# 26. Single-Conversation Actions

Must be available via:
- row context menu (right click / more actions)
- conversation header bar when thread is open

## 26.1 Required actions
- Close Conversation
- Reopen Conversation
- Restore from Archive
- Mark read
- Mark unread
- Snooze
- Mark Waiting
- Assign / reassign
- **Pin conversation** (if current user has fewer than 10 pins; blocked with error toast if at limit: *"You've reached the maximum of 10 pinned conversations. Unpin one to continue."*)
- **Unpin conversation** (shown only if the conversation is currently pinned by the current user)

---

# 27. Restore / Reopen Access in Archived View

Archived conversations must support restore/reopen through:
- row context menu
- conversation header bar
- bulk action bar

## Behavior rules
- restore/reopen is permission-controlled
- reopen moves conversation from Archived back to Active/Open
- reopened conversation recalculates:
  - current work state
  - read/unread state by user
  - ranking in Active scope

If reopened manually without new inbound:
- still re-enters Active scope

If auto-reopened by new inbound:
- no separate manual restore is required

---

# 28. Close, Archive and Reopen Behavior

## 28.1 Close behavior
When user closes conversation:
- it leaves default Active queue
- lifecycle changes from Open to Closed
- it becomes visible in Archived scope
- active queue ranking rules no longer apply in Active view

## 28.2 Archive behavior
Archived conversations must:
- remain searchable
- remain linked to contact/company/deal/activity history
- remain permission-aware
- support restore/reopen if allowed

## 28.3 Reopen behavior
Conversation reopens when:
- user manually reopens it
- new inbound customer message arrives
- workflow explicitly restores it

On reopen:
- lifecycle returns to Open
- archived visibility removed
- work state recalculates
- unread recalculates per assignee/user

## 28.4 Quiet wake-up rule
If Snoozed or Archived conversation receives new inbound:
- it re-enters active queue quietly
- it does not require separate manual restore
- it respects unread-per-user logic

---

# 29. Close Reasons

Close reason support must exist in the model and close workflow even if not exposed fully in v1 UI.

## 29.1 Recommended starter close reasons
- Completed
- Won / Converted
- Lost / Not Interested
- No Response
- Duplicate
- Spam / Irrelevant
- Wrong Contact / Wrong Channel
- Handed Off
- Moved Offline
- Other

## 29.2 Recommended shorter v1 visible set
- Completed
- Won / Converted
- Lost / Not Interested
- No Response
- Duplicate
- Spam / Irrelevant
- Handed Off
- Other

## 29.3 Rules
- close reason may be optional in v1
- field must exist
- editable by permitted users
- preserved after archive/restore/reopen
- available for reporting

---

# 30. Reopened Indicator

When an archived conversation returns to Active because of:
- new inbound activity, or
- manual restore/reopen,

the UI should support a subtle reopened indicator.

## 30.1 Recommended presentation
- Reopened pill
- return-arrow icon
- temporary reopened label until viewed

## 30.2 Rules
- reopened indicator is secondary
- must not be stronger than Reply / Late Reply
- may disappear after view or after short time
- should help reps understand why older thread resurfaced

---

# 31. Detail / Context Panel Requirements

The right-side detail panel is defined in the dedicated Context Panel PRD.

For sidebar purposes, the key requirement is that the opened conversation's context panel exposes the CRM and lifecycle details needed to understand and manage the selected row without duplicating sidebar queue logic.

The context panel must include:
- contact summary,
- deal information,
- company information,
- conversation information,
- ownership and participant details,
- lifecycle metadata,
- productive empty states for missing CRM objects.

## 31.1 Required fields
- lifecycle_state
- closed_at
- closed_by_user_id
- close_reason
- archived_at
- archived_by_user_id
- restored_at
- restored_by_user_id
- reopened_at
- reopened_by_user_id

## 31.2 Optional display guidance
- Active view shows lifecycle = Open
- Archived view shows lifecycle = Closed or Archived
- show only metadata that exists
- no linked deal should offer Create deal / Link existing where permitted
- context panel updates that affect queue state must synchronize back to the sidebar row and counters

---

# 32. Data Model / Fields

## 32.1 Lifecycle fields
- lifecycle_state (open, closed, archived)
- close_reason
- closed_at
- closed_by_user_id
- archived_at
- archived_by_user_id
- restored_at
- restored_by_user_id
- reopened_at
- reopened_by_user_id

## 32.2 Work-state fields
- current_work_state (reply, late_reply, waiting, snoozed, none)
- reply_required_flag
- late_reply_flag
- waiting_flag
- snoozed_until
- snooze_reason
- ai_sent_pending_human_review_flag

## 32.3 Read-state fields
- unread_count_by_user{}
- last_seen_at_by_user{}
- last_seen_message_id_by_user{}
- lifecycle_scope_last_changed_at
- last_reopened_from_archived_at

## 32.4 Personal flag fields (per-user, private)
Stored separately from conversation work state. Must be user-scoped and never exposed to other users.

- `pinned_by_user` — boolean flag for the current user (derived from the index below)
- `pinned_at_by_user{}` — map of user_id → ISO timestamp when pinned
- `pin_order_by_user{}` — map of user_id → integer index (0–9); reflects current drag order
- `pinned_conversation_ids_by_user{}` — map of user_id → ordered array of conversation_ids (max 10 entries per user)

Rules:
- `pin_order_by_user` must update on every drag-reorder operation.
- Enforced max of 10 entries per user in `pinned_conversation_ids_by_user`.
- Attempting to add an 11th entry must be rejected at the API level.

---

# 33. Empty States

System must support dedicated empty states for:
- no active conversations
- no archived conversations
- no results after ownership + lifecycle + work-state filters
- permissions-restricted archived view

Recommended examples:
- `No archived conversations yet`
- `No archived conversations match your filters`

---

# 34. Permissions

Required permission concepts:
- View archived conversations
- Close conversation
- Reopen conversation
- Archive conversation
- Restore archived conversation
- Bulk close conversations
- Bulk archive conversations
- Bulk restore conversations
- View close reason
- Edit close reason
- Configure lifecycle automation rules

Rules:
- archived visibility is permission-aware
- users without archived permission should not see archived results unless explicitly allowed
- all close/archive/restore/reopen actions must be auditable

---

# 35. Automations

Required/supportable automations:
- auto-reopen closed/archived conversation on new inbound
- auto-move closed conversations into archived visibility scope
- auto-log close/archive/restore/reopen events
- auto-notify assignee when previously archived conversation reopens
- auto-clear snooze when new inbound arrives
- auto-maintain search indexing so archived remains searchable without polluting active relevance
- optional future: auto-close stale waiting conversations after policy threshold

---

# 36. Edge Cases

System must account for:
- closed conversation receives new inbound and reopens without losing prior close metadata
- archived conversation restored manually without new inbound
- user searches in All, opens archived conversation, then new inbound reopens it
- bulk close occurs while one selected row receives new inbound
- user without archived permission receives direct link to archived conversation
- restored conversation returns to correct owner/team and recalculates work state/unread correctly
- contact/deal/company merged while conversation archived
- archived conversations remain exportable only where policy allows
- open conversation read but not yet replied stays in Reply
- waiting conversation with new inbound returns to Reply/Late Reply

---

# 37. Audit / Activity Events

Required events:
- conversation_closed
- conversation_archived
- conversation_restored
- conversation_reopened
- conversation_close_reason_updated
- archived_scope_viewed
- bulk_conversation_closed
- bulk_conversation_restored
- **conversation_pinned** — actor_user_id, conversation_id, pin_index, timestamp
- **conversation_unpinned** — actor_user_id, conversation_id, timestamp
- **pinned_strip_expanded** — actor_user_id, timestamp
- **pinned_strip_collapsed** — actor_user_id, timestamp
- **pinned_order_changed** — actor_user_id, conversation_id, old_index, new_index, timestamp
- **view_mode_changed** — actor_user_id, from_mode (time_relative / work_queue), to_mode, timestamp

Where technically possible, distinguish:
- manual restore
- automatic reopen from inbound

---

# 38. Reporting / KPIs

Required lifecycle/sidebar metrics:
- active conversations count
- archived conversations count
- closed conversations count
- reopen rate
- time to close conversation
- archived conversation reopen rate
- conversations closed by user/team
- close reasons distribution
- restored conversations count
- active vs archived queue composition

Pinned feature metrics:
- pin usage rate (% of active users with at least one pin)
- average pins per active user
- pinned conversations opened rate vs unpinned conversations
- view mode usage: % of sessions in Time-Relative vs Work Queue
- pinned strip expand/collapse ratio (in work queue mode)

Filterable by:
- channel
- inbox
- assignee
- team
- lifecycle scope
- close reason
- date range

---

# 39. Recommended UI Copy

## 39.1 Filters / scopes
- Active
- Archived
- All

## 39.2 Work-state labels
- Reply
- Late Reply
- Waiting
- Snoozed

## 39.3 Section labels
- Reply Required
- Waiting & Snoozed
- Active Results
- Archived Results

## 39.4 Lifecycle labels
- Open
- Closed
- Archived

## 39.5 Metadata labels
- AI Sent
- Labels / tags
- Reopened
- Archived
- Closed as [reason]
- Archived [time ago]

## 39.6 Actions
- Close Conversation
- Reopen Conversation
- Restore from Archive

---

# 40. Final Product Decisions Locked

The following decisions are considered final for the sidebar:

1. **Default view is Time-Relative** (chronological, most recent first). Work queue mode is accessed via the Sort button.
2. Unread remains a per-user state
3. Unread row background remains green
4. Selected row remains grey
5. Current work state and lifecycle state are separate
6. Primary work states are Reply / Late Reply / Waiting / Snoozed / None
7. Lifecycle scope dropdown includes Active / Archived / All
8. Active is default scope
9. Archived is retrieval/history, not live work queue
10. Reply includes AI Sent conversations still needing human review
11. Late Reply is a subset of Reply
12. Archived conversations support restore/reopen from row menu and header bar
13. Close reason field must exist even if not fully exposed yet
14. Archived rows are visually muted and clearly historical
15. All scope must separate Active Results and Archived Results
16. New inbound auto-reopens Snoozed/Archived conversations quietly
17. Reopened indicator exists as a subtle secondary signal
18. Mark read / unread is user-based
19. Participating scope allows reply
20. Bulk actions remain supported
21. **Pinned is a personal, per-user, private flag. Maximum 10 per user.**
22. **Pinned is the dominant display badge, overriding Reply, Late Reply, Waiting, and Snoozed.**
23. **Underlying work state is shown as a secondary badge when Pinned is active.**
24. **Pinned does not affect work-state filtering, counting, or queue logic.**
25. **Pinned section in Time-Relative view: full rows at top, oldest pin first, user-draggable.**
26. **Pinned strip in Work Queue sort: compact bubbles (collapsed) or full rows (expanded), above Reply Required.**
27. **Pinned conversations do not appear in the main list or queue sections below their dedicated section/strip.**
28. **Pinned order is oldest-pin-first by default; user can drag to reorder. Order persists.**
29. **Pinning an 11th conversation is blocked with an error toast.**
30. **Pin and Unpin actions are available from both views via row context menu.**

---

# 41. Final Summary

The RakanSales Omnichannel Sales Team sidebar should operate as a **dual-mode conversational workspace** with:
- a **time-relative default view** that feels natural and familiar, prioritizing recency and flow,
- a **work queue sort mode** accessible via Sort for structured, action-priority management,
- a **personal Pinned flag** giving reps control over what surfaces to them, privately,
- per-user unread behavior,
- separated waiting/snoozed handling in work queue mode,
- explicit lifecycle scope for Active vs Archived retrieval,
- deterministic sorting and filter rules,
- archive/restore/reopen behavior for long-run cleanliness,
- subtle but trustworthy state communication.

This document is the consolidated sidebar PRD and should be treated as the current working master for the Omnichannel sidebar.
