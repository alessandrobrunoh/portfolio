# Checkpoint details

Objective: Replace the fourth section overview with the selected checkpoint details in the same card.
Scope: Approach component and its styles; preserve localized content and the initial wave overview.
Tasks: Replace the appended detail panel; add compact checkpoint navigation and back control; animate swaps; verify types and production build.
Acceptance: Exactly one view is shown; all five checkpoints work; previous/next and back work; keyboard focus is retained; mobile stays within the viewport; reduced motion skips movement.
Risks: Different content heights and focus loss when the overview disappears. Use a shared minimum-height stage and restore focus after rendering.
Success: Detailed content replaces the overview, with a directional transition and no additional panel below it.

Validation: Typecheck and production build passed. Visual browser verification was blocked by denied localhost access.
