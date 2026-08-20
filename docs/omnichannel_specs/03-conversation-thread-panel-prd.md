# RakanSales Omnichannel Conversation Thread Panel PRD
**Document type:** Consolidated product requirements document (conversation panel scope only)  
**Module:** Omnichannel -> Conversation Header Bar + Thread Panel + Composer  
**Version date:** 2026-05-14  
**Status:** Consolidated working master for conversation thread panel design and logic

---

# 1. Purpose

This document is the **single consolidated PRD/specification for the RakanSales Omnichannel Conversation Thread Panel** based on all decisions made in this discussion.

It is intended to become the working master for the **middle conversation area only**, including:
- top conversation header bar,
- thread/timeline area,
- message composer,
- panel-level empty states,
- panel-level actions and interaction rules,
- conversation-specific operational states,
- channel warnings and send restrictions,
- future AI auto-reply handling.

This document consolidates:
- header information architecture,
- thread/timeline behavior,
- composer behavior,
- interaction boundaries with the sidebar and right context panel,
- work-state visibility,
- lifecycle-state visibility,
- on-demand summary behavior,
- schedule-meeting entry point,
- template usage,
- channel restriction states,
- AI auto-reply future scope,
- empty states,
- non-happy-path states,
- permissions,
- audit events,
- KPI/reporting impact.

This document does **not** redefine the Sales Team sidebar logic. The sidebar PRD remains the source of truth for queue logic, ownership scope, filter rules, row ranking, lifecycle retrieval behavior, and archived list behavior.

---

# 2. Product Goal

The Conversation Thread Panel must function as a **sales execution workspace** rather than a generic chat window.

The panel should help sales reps:
- identify who the conversation is with,
- understand the current work state immediately,
- read message history cleanly,
- see operational system events inline,
- reply quickly,
- use templates, summaries, and meeting actions without leaving the thread,
- understand channel restrictions before sending,
- hand off safely between human and future AI handling modes.

The long-run design principle is:

**Header = quick read**  
**Thread = message and event history**  
**Composer = action/work area**  
**Right context sidebar = deeper CRM context and editing**

---

# 3. Core UX Principles

## 3.1 Sales-first, not chat-first
The panel is optimized for:
- fast context recognition,
- reply execution,
- low-friction sales actions,
- operational clarity.

It is **not** optimized primarily for casual social-style messaging.

## 3.2 Do not duplicate the right context sidebar
The header and composer should show only what is needed to work the conversation quickly.

They must not duplicate:
- full contact details,
- company details,
- deal stage details,
- contact temperature,
- contact priority,
- full ownership editing,
- extended CRM editing controls.

## 3.3 Keep panel roles distinct
The center workspace must follow a clear separation:
- **Header** = immediate identity + state + a few quick controls
- **Thread** = customer messages, rep messages, notes, system events
- **Composer** = reply and productivity actions
- **Right sidebar** = editable CRM context

## 3.4 Conversation work state must remain visible
The current conversation work state is central to the sales workflow.

A rep opening the thread should immediately understand whether the conversation is:
- Reply,
- Late Reply,
- Waiting,
- Snoozed,
- or None.

This must be visible in the header at all times for active conversations.

## 3.5 Contact metadata is not conversation state
The following belong primarily to contact/deal context, not the thread header:
- temperature,
- priority,
- deal stage,
- extended contact labels/tags.

These may be visible in the right sidebar, but should not dominate the thread header.

## 3.6 Channel restrictions must appear where action happens
Session limits, template requirements, send restrictions, or channel-specific warnings must appear near the composer, not only in the header.

## 3.7 On-demand helpers should stay on-demand
Conversation summary should be generated only when explicitly triggered.

It should not occupy permanent space by default.

---

# 4. Scope of This PRD

This PRD covers the conversation panel only, including:
- header bar,
- thread/timeline area,
- reply/private-note composer,
- panel empty states,
- header-level actions,
- composer toolbar,
- thread system-event rendering,
- conversation-level warning states,
- future AI auto-reply state handling.

This PRD does not fully define:
- the left sidebar queue logic,
- advanced right sidebar CRM editing,
- deal stage management,
- contact temperature/priority logic,
- full meeting module UX,
- full template management module,
- full AI orchestration policy engine.

---

# 5. Conversation Panel Information Architecture

The conversation workspace must be structured as a **compact operational workspace**.

## 5.1 High-level areas
The conversation panel consists of:
1. Header bar
2. Thread/timeline area
3. Composer warning strip area
4. Composer mode switch and sender context
5. Composer input area
6. Composer toolbar and send area
7. Panel empty / loading / error states

## 5.2 Panel boundaries
The conversation panel sits between:
- the **left sales queue sidebar**, which controls queue selection and list-level work,
- and the **right context sidebar**, which controls deeper CRM context and editing.

## 5.3 Responsibility split
The conversation panel is responsible for:
- understanding the currently selected conversation,
- replying or leaving internal notes,
- seeing inline operational history,
- triggering panel-level productivity actions.

The conversation panel is not responsible for:
- full contact profile editing,
- full ownership editing,
- full deal management,
- historical queue browsing logic.

---

# 6. Header Bar

## 6.1 Purpose
The header must answer a few quick questions only:
- who is this,
- what channel is this,
- who is assigned,
- what is the current conversation work state,
- what lifecycle state is this conversation in,
- is presence/activity available.

## 6.2 Required header zones
The header consists of:
1. Left identity zone
2. Middle state/context zone
3. Right actions zone

## 6.3 Left identity zone
Required elements:
- contact avatar
- contact/conversation name
- presence indicator dot when presence/recent activity is available

## 6.4 Presence indicator rules
Presence must be lightweight.

Rules:
- show a simple activity/presence dot beside the contact name when meaningful
- show relative activity time on hover
- do not show verbose text by default in the header
- if presence is unavailable for the channel, hide the dot rather than showing ambiguous status

## 6.5 Middle state/context zone
Required visible text:
- channel label
- assignee name
- current conversation work-state badge

Recommended pattern:
`WhatsApp / Assigned to Olivia / Reply`

## 6.6 Assignee rules
Assignee must be:
- visible in the header,
- readable at a glance,
- not editable directly from the header in v1.

Ownership editing continues to belong to the right sidebar.

## 6.7 Work-state badge rules
The header must display one primary work-state badge when applicable:
- Reply
- Late Reply
- Waiting
- Snoozed

If no active work state exists:
- no badge is required, or
- optional neutral None treatment may be used in internal/admin views only.

## 6.8 Work-state badge interaction
The current work-state badge must be clickable from the header.

Click behavior:
- opens the work-state selector
- allows direct state updates without forcing the user into the right sidebar

## 6.9 Right actions zone
Required controls:
- lifecycle-state dropdown
- more-actions menu

## 6.10 Lifecycle-state dropdown
The visible lifecycle control in the header represents the conversation lifecycle scope/state for the opened conversation.

Required states:
- Active
- Resolved / Closed (Replaces redundant standalone header Resolve buttons; selecting this closes the conversation thread)
- Archived

Rules:
- the lifecycle control must be highly visible
- archive/restore/resolution behavior belongs here as a conversation-level control
- lifecycle state remains separate from the work-state badge

## 6.11 More menu
The header must include a more-actions menu for secondary actions.

Recommended contents:
- Mark read
- Mark unread
- Copy conversation link
- Block / Spam
- Close conversation
- Reopen conversation
- Restore from archive
- future advanced thread operations

## 6.12 Header exclusions
The following must not be added to the header in v1 unless explicitly revisited:
- deal stage
- contact priority
- contact temperature
- full participant editor
- company information
- full meeting widget
- persistent AI summary card

---

# 7. Work-State Selector

## 7.1 Purpose
The work-state selector provides direct conversation-state control from the header.

## 7.2 Required options
Required options:
- Reply
- Late Reply
- Waiting
- Snoozed
- None

## 7.3 Rules
- only one primary work state may be active at a time
- updating the work state from the header must immediately update the thread, the sidebar row, and all counters affected by the sidebar logic

## 7.4 Snoozed behavior
If Snoozed is chosen:
- the user must be able to select a date/time
- snoozed-until information must be stored on the conversation
- the thread may log a system event for the snooze action

## 7.5 Visibility
The selector belongs to the conversation header interaction model, not the right context sidebar.

---

# 8. Thread / Timeline Area

## 8.1 Purpose
The thread area must remain readable, calm, and operationally useful.

It must support:
- inbound customer messages,
- outbound rep messages,
- private notes,
- inline system events,
- date dividers,
- message status indicators,
- non-happy-path states.

## 8.2 Thread ordering
Messages and system events must appear in chronological order.

Date dividers should segment the timeline naturally.

## 8.3 Message types
Required thread content types:
- customer message
- sales rep message
- private note
- system event
- failed/sending status marker
- attachment message
- future AI-sent message marker

## 8.4 Visual priority
The thread must prioritize:
1. customer and rep messages
2. private notes
3. system events
4. background operational metadata

System events must be visible but must not overpower the actual conversation.

## 8.5 Date dividers
The thread must support date dividers such as:
- Today
- Yesterday
- explicit date labels

## 8.6 Private notes
Private notes must be visually distinct from customer-visible messages.

Private note rules:
- clearly marked as internal-only
- never sent to the customer
- rendered differently from normal outbound messages
- should show note author and timestamp

## 8.7 Attachments and content variants
The thread must support:
- file attachments
- image/file previews where supported
- attachment status where relevant

## 8.8 Scrolling behavior
The thread must support long conversations without losing clarity.

Recommended behaviors:
- sticky date label while scrolling
- jump-to-latest button when user has scrolled away from the newest messages
- unseen incoming indicator when a new inbound arrives while scrolled away

---

# 9. System Events in Thread

## 9.1 Purpose
The thread must show subtle operational history inline so the rep understands what happened without leaving the conversation.

## 9.2 Required event types
Required system event examples:
- conversation assigned
- conversation reassigned
- conversation marked Waiting
- conversation snoozed until [time]
- conversation reopened
- conversation archived
- conversation restored
- meeting scheduled
- template sent
- AI paused for human review
- AI handling started/stopped in future scope

## 9.3 Styling rules
System events should:
- appear centered or clearly separated from message bubbles
- use lighter visual emphasis than messages
- use subtle icons where helpful
- follow one consistent timeline-event style

## 9.4 Reopened event
When a previously archived or snoozed conversation returns to active because of inbound activity or manual action, the thread should support a subtle reopened event.

---

# 10. Message Status States

## 10.1 Required outbound states
Outbound messages must support visible status states:
- Sending
- Sent
- Delivered
- Failed
- Retry available

## 10.2 Rules
- failed send must be clearly distinguishable from delivered/sent
- retry must be available where channel/business rules allow
- send status must not be confused with contact presence status

## 10.3 Non-happy-path visibility
Failure states must be represented in the thread UI, not only in logs or backend status.

---

# 11. Composer

## 11.1 Purpose
The composer is the primary action zone for sales reps.

It must support not only message sending, but also key sales productivity actions without turning into a full CRM panel.

## 11.2 Composer structure
The composer consists of:
1. warning strip area
2. mode switch row
3. sender identity/context line
4. text input area
5. toolbar/action row
6. send action

## 11.3 Composer modes
Required modes:
- Reply
- Private Note

Rules:
- mode must be obvious at all times
- switching to Private Note must change send behavior and visual treatment

## 11.4 Sender identity
The composer must show the active sender identity for outbound replies.

Example:
`Replying as Janice Lee (+6012 3456 7890)`

Rules:
- sender identity must be visible while replying
- sender identity is not required for Private Note mode
- if multiple senders are supported later, sender selection may be expanded in future scope

## 11.5 Input behavior
The message input should remain simple and fast.

Rules:
- input must support channel-appropriate text entry
- input must support keyboard-first sending flows where allowed
- channel restrictions must be surfaced before send

---

# 12. Composer Toolbar

## 12.1 Required v1 toolbar actions
Required v1 actions:
- Template
- Summarize
- Meeting
- Attachment / file insert
- basic utility icons as supported
- Send

## 12.2 Templates
Templates must be first-class in the composer toolbar.

Reason:
- templates are a common sales productivity action
- templates become operationally critical when a channel requires them

## 12.3 Summarize
Summary generation is on-demand only.

Rules:
- the user must explicitly trigger it from the composer toolbar
- it should not appear permanently by default
- the result may appear in a lightweight panel, popover, drawer, or other transient surface

## 12.4 Meeting
Schedule Meeting must be a first-class composer action.

Rules:
- meeting scheduling is supported from the composer, not the header
- meeting creation should log an appropriate system event in the thread after success

## 12.5 Utility actions
Formatting/utility icons may remain icon-based where appropriate.

Sales-critical actions should remain more discoverable than purely decorative utility actions.

---

# 13. Summary Behavior

## 13.1 Summary model
Conversation summary is an explicit assistive action, not a permanent panel block.

## 13.2 Trigger
Summary is triggered from the composer toolbar.

## 13.3 Result behavior
The summary result must support:
- loading state
- successful generation state
- close/dismiss
- regenerate in future scope if needed

## 13.4 Placement
Summary may appear in:
- a lightweight overlay,
- a popover,
- a small drawer,
- or another non-permanent assistive surface.

## 13.5 Rule
Summary must not permanently consume vertical space in the thread in v1.

---

# 14. Meeting Scheduling Entry Point

## 14.1 Purpose
Meeting scheduling is a sales workflow action and belongs inside the composer action model.

## 14.2 Trigger
Meeting scheduling is triggered from the composer toolbar.

## 14.3 Required outcome
After successful scheduling:
- the thread should log a system event,
- the conversation should remain in context,
- the rep should not lose draft context unnecessarily.

## 14.4 Future expansion
A fuller meeting workflow may later support:
- date/time picking,
- invitees,
- channel-specific invite behavior,
- calendar sync,
- meeting links,
- follow-up automation.

---

# 15. Template Flow

## 15.1 Purpose
Templates support faster and more consistent sales replies.

## 15.2 Trigger
Template picker is opened from the composer toolbar.

## 15.3 Required flow
The template flow should support:
- opening the template picker
- searching templates
- previewing selected template content
- inserting or sending per channel policy

## 15.4 Channel-sensitive rule
When a channel requires a template due to session restrictions, the template action must become easier to reach and clearly recommended.

---

# 16. Channel Warning and Restriction States

## 16.1 Purpose
The composer must communicate channel restrictions before the rep attempts an invalid send.

## 16.2 Placement
Channel warnings belong near the composer, above or inside the composer warning strip area.

## 16.3 Required v1 states
Required examples:
- session expiring soon
- session expired, template required
- channel disconnected
- attachments unsupported
- message blocked by channel rule

## 16.4 Warning vs blocked distinction
The system must distinguish between:

### Warning state
Example:
`WhatsApp session expires in 59 mins`

Rules:
- normal reply may still be allowed
- CTA is optional and should not imply hard blocking

### Blocked state
Example:
`WhatsApp session expired. Template required to continue.`

Rules:
- normal freeform send is blocked
- the UI should promote the template action clearly

## 16.5 Dismiss behavior
Dismiss must not remove a critical blocked-state warning entirely if the restriction still applies.

---

# 17. Lifecycle State in the Opened Conversation

## 17.1 Principle
Lifecycle state and work state remain separate in the open-thread view just as they do in the sidebar model.

## 17.2 Header treatment
Lifecycle is shown through the visible lifecycle dropdown in the header.

## 17.3 Thread treatment
Lifecycle transitions should be representable as system events where relevant:
- archived
- restored
- reopened

## 17.4 Rules
- Active/Archived lifecycle must not be confused with contact presence
- lifecycle state must not replace work-state visibility

---

# 18. First-Load and Empty States

## 18.1 First landing state
When the user lands on the conversations page without selecting a conversation for the first time, the center panel should show a **light productivity summary state**, not a dead blank.

## 18.2 First landing summary purpose
The landing state should help the rep decide where to start.

Recommended content:
- welcome message
- queue-oriented summary cards
- primary CTA such as Open Mine
- optional secondary CTA such as Open Reply Required

## 18.3 Recommended summary metrics
The first-load summary should prioritize queue/action-oriented metrics over generic dashboard metrics.

Recommended examples:
- Reply Required
- Late Reply
- Reopened

## 18.4 Later no-selection state
After normal working flow, if no conversation is selected, a simpler placeholder state may be used.

Recommended copy example:
`No conversation selected`
`Choose a conversation from the queue to continue`

## 18.5 Other empty states
The panel must support dedicated empty or placeholder states for:
- no conversation selected
- no results due to filters/search on the sidebar
- no messages yet in a newly created conversation
- archived conversation opened without visible send capability
- permissions-restricted or unavailable thread

---

# 19. Unread and Reopened Thread States

## 19.1 Unread divider
The thread should support a new/unread divider for messages the current user has not yet seen.

## 19.2 Reopened visibility
If a conversation resurfaced because it reopened from archived or snoozed state, the thread should support a subtle reopened indication.

## 19.3 New inbound while scrolled away
If a new inbound arrives while the user is scrolled away from the bottom of the thread:
- show an unseen/new-message indicator
- support jump-to-latest

---

# 20. Archived Conversation Thread Behavior

## 20.1 Archived view treatment
When an archived conversation is opened:
- the thread remains readable,
- the lifecycle control shows Archived,
- active reply actions may be reduced according to permissions and channel state.

## 20.2 Restore/reopen path
If the user has permission, the conversation can be restored or reopened from the header lifecycle control or appropriate secondary actions.

## 20.3 New inbound rule
If a new inbound arrives on an archived conversation:
- the conversation auto-reopens,
- lifecycle returns to Active/Open,
- work state recalculates,
- unread state recalculates,
- the thread may show a reopened event.

---

# 21. Right Sidebar Interaction Boundary

## 21.1 Principle
The right context sidebar remains the primary place for richer CRM context and editable details.

## 21.2 Items that stay in the right sidebar
The following are expected to remain in the right sidebar in v1:
- deal stage
- deal mini-workspace and next-step editing
- contact temperature
- contact priority
- deeper ownership editing
- contact/company detail blocks
- extended participants editing
- lifecycle metadata history
- admin audit access
- admin conversation management actions such as transfer, escalation, close reason editing, and visibility restriction where permitted

## 21.3 Thread-panel boundary rule
If information is not needed for fast conversation handling, it should stay in the right sidebar rather than being promoted into the header.

The right context panel is the source of truth for CRM productivity actions and admin operational controls. The composer remains the primary message execution surface, while the context panel owns contact/company/deal editing, ownership management, lifecycle metadata, and audit-oriented actions.

---

# 22. AI Auto-Reply Future Scope

## 22.1 Scope level
AI auto-reply is a **future conversation-level automation mode**, not a simple formatting feature.

## 22.2 Entry point
The future control may appear in the composer area as a toggle or mode control.

## 22.3 Naming
Preferred product framing:
- **AI Auto-Reply**
- or equivalent language that makes automation intent explicit

Avoid casual wording that implies only a one-off assist.

## 22.4 Core concept
When enabled, AI may continue replying automatically until human intervention is required.

## 22.5 Required future statuses
Recommended future states:
- Off
- Suggest Only
- Auto-Reply Active
- Paused for Human Review
- Blocked by Channel Rule
- Error / Delivery Failed

## 22.6 Human intervention triggers
AI auto-reply should pause and require human handling when examples such as these occur:
- pricing exception request
- negotiation outside policy
- custom quote or invoice exception
- meeting or demo request requiring rep ownership
- negative or escalated sentiment
- low confidence
- policy/restricted content detection
- send failure
- channel template/session restriction preventing valid continuation

## 22.7 Thread visibility
When AI auto-reply is eventually supported, the thread should make AI handling visible through system markers such as:
- AI handling started
- AI sent reply
- AI paused for human review
- human took over

## 22.8 Guardrail principle
AI auto-reply must be documented and designed as controlled conversation automation, not as an invisible background behavior.

---

# 23. States Matrix

## 23.1 Header-related states
The header must support:
- active conversation
- archived conversation
- visible work-state badge
- no work-state badge
- presence available
- presence unavailable

## 23.2 Thread-related states
The thread must support:
- normal thread
- long thread
- unread divider
- reopened event
- archived event
- restored event
- failed message state
- sending state
- attachment state
- private note state

## 23.3 Composer-related states
The composer must support:
- normal reply mode
- private note mode
- warning state
- blocked state
- send disabled state
- send failure state
- future AI auto-reply active state
- future AI paused state

## 23.4 Panel-level states
The panel must support:
- loading selected conversation
- first-load summary
- no conversation selected
- permissions-restricted
- unavailable/error state

---

# 24. Accessibility and Interaction Requirements

## 24.1 Click targets
Header controls, work-state badge, lifecycle dropdown, composer actions, and thread controls must be comfortably clickable.

## 24.2 Keyboard support
At minimum, the panel should support:
- focusable header controls
- composer keyboard entry
- send via keyboard where allowed
- escape/close for overlays or popovers where applicable

## 24.3 Hover-only information rule
Any hover-only information, such as relative activity time on the presence dot, should not be the only way to access critical state if it materially affects workflow.

---

# 25. Permissions

Required permission concepts include:
- view conversation thread
- reply to conversation
- add private note
- change work state
- change lifecycle state
- reopen archived conversation
- restore archived conversation
- send templates
- schedule meetings
- use AI assist actions
- enable future AI auto-reply where policy allows

Rules:
- controls should hide or disable appropriately based on permissions
- permission handling must remain consistent with the sidebar and lifecycle model

---

# 26. Automations

Required/supportable automations for the panel experience:
- auto-log system events into the thread when work state changes
- auto-log lifecycle transitions into the thread when relevant
- auto-reopen archived or snoozed conversations on new inbound
- auto-show channel restrictions when they become active
- auto-maintain message delivery states
- future: auto-pause AI auto-reply when human intervention is needed

---

# 27. Edge Cases

System must account for:
- archived conversation opened while send is unavailable
- conversation switched to Snoozed from the header while a draft exists
- new inbound arrives while user is reading older messages higher in the thread
- failed outbound message in a conversation that is otherwise Waiting
- work state changes while the thread is open in multiple tabs or by another teammate
- template required warning appears after the user has started drafting a normal message
- summary requested while the conversation is loading additional history
- meeting scheduled while a reply draft exists
- private note draft accidentally left in reply mode must be prevented by clear mode indication
- AI auto-reply future mode paused due to a blocked channel state

---

# 28. Audit / Activity Events

Required events include:
- conversation_viewed
- conversation_marked_reply
- conversation_marked_late_reply
- conversation_marked_waiting
- conversation_snoozed
- conversation_unsnoozed
- conversation_archived
- conversation_restored
- conversation_reopened
- private_note_added
- template_inserted
- template_sent
- summary_requested
- meeting_scheduled_from_conversation
- message_send_failed
- future_ai_auto_reply_enabled
- future_ai_auto_reply_paused
- future_ai_auto_reply_disabled

Where technically possible, distinguish:
- manual user action
- automatic system action
- AI-originated action

---

# 29. Reporting / KPIs

Recommended panel-related metrics:
- conversation open rate from sidebar to thread
- reply sent rate from opened conversations
- private note usage rate
- template usage rate
- summary trigger rate
- meeting scheduling rate from conversation panel
- send failure rate
- average time from open to first reply
- conversations reopened while thread is open
- future AI auto-reply usage and pause rate

Filterable where relevant by:
- channel
- assignee
- team
- conversation work state
- lifecycle state
- date range

---

# 30. Recommended UI Copy

## 30.1 Header / lifecycle
- Active
- Archived
- Assigned to [name]

## 30.2 Work-state labels
- Reply
- Late Reply
- Waiting
- Snoozed

## 30.3 Composer actions
- Template
- Summarize
- Meeting
- Send
- Private Note

## 30.4 Channel warnings
- Session expires in [time]
- Session expired. Template required to continue.
- Channel unavailable
- Attachment not supported on this channel

## 30.5 Empty states
- No conversation selected
- Choose a conversation from the queue to continue
- Welcome back. Start with the conversations that need attention.
- Open Mine
- Open Reply Required

## 30.6 Future AI labels
- AI Auto-Reply
- AI Handling
- Paused for Human Review
- Human Took Over

---

# 31. Short-Term Practical Version (v1)

The short-term practical version should include:
- lightweight header with name, presence dot, channel, assignee, work-state badge, lifecycle dropdown, more menu
- clean thread with messages, private notes, system events, date dividers, message statuses
- composer with Reply / Private Note
- visible sender identity in Reply mode
- composer toolbar with Template, Summarize, Meeting, attachment/utility actions, Send
- channel warning strip near composer
- first-load summary state
- basic no-selection state
- archived/opened thread handling consistent with sidebar lifecycle logic

This version should prioritize speed, clarity, and low UI clutter.

---

# 32. Long-Term Scalable Version

The long-term scalable version may expand with:
- richer jump-to-latest and sticky date behavior
- stronger thread event filtering or collapsing
- multi-sender identity selector
- deeper template preview and insertion flows
- richer meeting scheduler UI
- advanced summary interactions
- AI auto-reply mode with human escalation rules
- teammate presence/collision signals in-thread
- deeper retry and delivery recovery flows

The scalable version should preserve the same structural principles rather than changing the core information architecture.

---

# 33. Visual State Library Requirements

Before final design lock, the product should document visuals for at least these states:
- work-state selector opened
- lifecycle dropdown opened
- archived conversation thread
- private note in thread
- message sending/failed/retry states
- unread divider / new-message marker
- reopened conversation thread state
- session warning state
- session blocked/template-required state
- template picker opened
- summary result surface
- meeting scheduling surface
- first-load summary state
- no-selection placeholder state
- future AI auto-reply active and paused states

---

# 34. Final Product Decisions Locked

The following decisions are considered final for the conversation panel unless explicitly revised later:

1. The center panel is a sales execution workspace, not a generic chat pane
2. The sidebar logic remains the source of truth for queue logic and is not redefined here
3. The header stays lightweight and must not duplicate the right CRM sidebar
4. Deal stage remains in the right sidebar, not the thread header
5. Contact priority and temperature remain in the right sidebar, not the thread header
6. Assignee is visible in the header but editable through the right sidebar, not inline in v1
7. The conversation work-state badge is always visible in the header when applicable
8. The work-state badge is clickable from the header and opens the state selector
9. Lifecycle state is shown as a visible dropdown in the header
10. Lifecycle state and work state remain separate concepts
11. Presence is shown as a lightweight dot, with relative time on hover
12. Schedule Meeting belongs in the composer toolbar, not the header
13. Summarize is on-demand only and triggered from the composer toolbar
14. Templates are a first-class composer action in v1
15. Channel/session warnings belong near the composer, not only in the header
16. Warning and blocked channel states must be visually distinct
17. Private notes are supported as a distinct composer mode and thread message type
18. System events are shown inline in the thread with lighter styling than messages
19. The first landing state uses a lightweight summary, not a blank empty view
20. A simpler no-selection placeholder may be used after normal workflow entry
21. AI auto-reply is future scope and must be treated as guarded conversation automation, not a casual toggle
22. CRM productivity actions and admin operational controls belong in the right context panel, while message execution remains in the composer

---

# 35. Final Summary

The RakanSales Omnichannel Conversation Thread Panel should operate as a **structured sales workspace** with:
- a lightweight but high-signal header,
- a readable message timeline,
- an action-oriented composer,
- clear interaction boundaries with the sidebar and right CRM context,
- visible operational events and message states,
- channel restrictions surfaced where action happens,
- on-demand assistive actions like summary,
- meeting and template flows accessible without leaving the conversation,
- and a future-safe path for AI auto-reply with human takeover.

This document is the consolidated conversation panel PRD and should be treated as the current working master for the RakanSales conversation header bar, thread area, and composer.
