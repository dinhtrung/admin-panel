# app-shell Specification

## Purpose
Provides the persistent application chrome — primary navigation, page header and breadcrumbs, route-level loading, error, empty and not-found states, responsive collapse, keyboard reachability, and addressable deep links — so every view of the admin panel is reached the same way and never renders an unexplained blank surface.
## Requirements
### Requirement: Persistent shell with primary navigation
The panel SHALL present a persistent shell that keeps a primary navigation region and a top bar available while the main content area changes between views, and SHALL mark the entry for the current view as active.

#### Scenario: Chrome persists across views
- **WHEN** the operator moves from one view to another
- **THEN** the primary navigation region and the top bar remain present and the entry for the newly opened view is indicated as active

#### Scenario: All destinations are reachable
- **WHEN** the shell is loaded
- **THEN** the primary navigation lists every destination the panel offers, so no destination is reachable only through an action inside another view

### Requirement: Addressable location and breadcrumbs
The panel SHALL keep the current location reflected in the address bar as a link that can be reopened, and SHALL show a breadcrumb trail naming the current view and its parent views.

#### Scenario: A deep link restores a view
- **WHEN** a link to a list or detail view is opened in a fresh session
- **THEN** the panel opens that view with its identifying state restored

#### Scenario: Breadcrumbs reflect and navigate location
- **WHEN** the operator is inside a detail view
- **THEN** the breadcrumb trail shows the parent list and the current item, and selecting a parent segment returns to that parent

#### Scenario: Unknown location
- **WHEN** the address does not match any view the panel offers
- **THEN** a not-found state is shown with a control that returns the operator to the landing view

### Requirement: Route-level outcome states
The panel SHALL present clearly distinguishable loading, failed, empty and not-found outcomes for a view, so an in-progress request is never confused with a failure, and a genuinely empty result is never confused with a missing record.

#### Scenario: Loading a view
- **WHEN** a view is waiting for its data
- **THEN** a loading indication is shown in the content area instead of an empty or stale surface

#### Scenario: A request fails
- **WHEN** a view's data request fails
- **THEN** a failed state is shown with a retry control, and using the retry control re-issues the request

#### Scenario: Empty result versus missing record
- **WHEN** a list is valid but holds no records, or a requested record does not exist
- **THEN** the empty list shows a state explaining that no records are present and the missing record shows a not-found state, and the two are visually distinct

### Requirement: Responsive shell collapse
The panel SHALL adapt the shell at narrow viewports by collapsing the primary navigation into an overlay that can be opened and closed, without removing any destination.

#### Scenario: Collapse at a narrow width
- **WHEN** the viewport is narrow
- **THEN** the primary navigation collapses and a control to open it is shown in the top bar

#### Scenario: Open and close the collapsed navigation
- **WHEN** the operator opens the collapsed navigation
- **THEN** it is presented over the content, can be dismissed, and dismissing it returns focus to the control that opened it

#### Scenario: No destination is lost
- **WHEN** the primary navigation is collapsed
- **THEN** every destination remains reachable through the overlay

### Requirement: Keyboard reachability and focus order
The panel SHALL make every shell control reachable and operable with the keyboard in a logical order, SHALL show a visible focus indicator on the focused control, and SHALL offer a way to skip past repeated navigation into the main content.

#### Scenario: Skip to main content
- **WHEN** the operator first moves focus by keyboard after a page load
- **THEN** a skip-to-content control is offered and activating it moves focus into the main content

#### Scenario: Visible and ordered focus
- **WHEN** focus moves through the shell by keyboard
- **THEN** the focused control shows a visible focus indicator and the order follows the reading order of the shell

#### Scenario: An overlay returns focus
- **WHEN** an overlay opened from the shell is closed
- **THEN** focus returns to the control that opened it

