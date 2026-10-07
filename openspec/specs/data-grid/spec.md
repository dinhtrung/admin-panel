# data-grid Specification

## Purpose
Define the one tabular surface every list view is assembled from: how it sorts, pages, hides columns,
selects rows and presents its loading, empty and error states, with the on-screen list state reflected
in the address bar so a view can be shared and survives a reload.
## Requirements
### Requirement: Sorting with announced state
The grid SHALL allow sorting by any sortable column and SHALL announce the column and direction that
are currently applied.

#### Scenario: Toggle sort direction
- **WHEN** a user activates the sort control on a sortable column
- **THEN** the rows are ordered by that column, and activating the same control again reverses the order

#### Scenario: Announced sort state
- **WHEN** the applied sort changes
- **THEN** assistive technology is told which column is sorted and in which direction, and the direction is also conveyed without relying on colour alone

### Requirement: Pagination, page size and addressable list state
The grid SHALL present results one page at a time, SHALL allow the page size to be changed and the
page to be navigated, and SHALL reflect the current page, sort and filters in the address bar so the
view is shareable and survives a reload.

#### Scenario: Navigate pages
- **WHEN** a result set is larger than one page
- **THEN** the grid shows a bounded page of rows with controls to move to the next, previous and a specific page

#### Scenario: Change page size
- **WHEN** the page size is changed
- **THEN** the grid shows the newly sized page of the same ordered result set and reports the visible range within the total

#### Scenario: Shared link restores the view
- **WHEN** the address bar is copied into a new tab or the current tab is reloaded
- **THEN** the grid opens on the same page, with the same sort and filters applied

#### Scenario: Keyboard operation
- **WHEN** a keyboard user operates the pagination controls
- **THEN** every control is reachable and operable without a pointer

### Requirement: Column visibility
The grid SHALL allow columns to be hidden and shown without losing the current sort, page or row
selection.

#### Scenario: Hiding then showing preserves state
- **WHEN** a column is hidden and later shown again
- **THEN** the current sort, page and row selection are unchanged

#### Scenario: At least one column remains
- **WHEN** a user attempts to hide the last remaining visible column
- **THEN** at least one column stays visible

### Requirement: Row selection and bulk action bar
The grid SHALL support selecting individual rows and all rows on the current page, and it SHALL
present a bulk action bar only while at least one row is selected.

#### Scenario: Bulk bar appears with a selection
- **WHEN** the selection changes from empty to one or more rows
- **THEN** a bulk action bar appears and states how many rows are selected

#### Scenario: Bulk bar disappears at zero
- **WHEN** the last selected row is deselected
- **THEN** the bulk action bar is removed and the grid returns to its unselected state

#### Scenario: Select all on the page
- **WHEN** the user selects all rows on the current page
- **THEN** those rows are marked selected and the bulk bar count matches the number of selected rows

### Requirement: Loading, empty and error presentation
The grid SHALL present distinct loading, empty and error states so a user can tell an in-progress
request from a genuinely empty result and from a failed one.

#### Scenario: Loading
- **WHEN** a list request is in flight
- **THEN** the grid shows a loading state and does not present stale rows as if they were current

#### Scenario: Empty result
- **WHEN** a request succeeds and returns no rows
- **THEN** the grid shows an empty state that is distinct from both the loading and the error state

#### Scenario: Failed request
- **WHEN** a list request fails
- **THEN** the grid shows an error state that identifies the failure and offers a way to retry

#### Scenario: Narrow viewport
- **WHEN** the viewport is narrow
- **THEN** the grid remains operable, its controls stay reachable, and the bulk action bar does not obscure the rows

