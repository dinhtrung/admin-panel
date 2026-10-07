## Purpose

Static delivery defines the contract for turning the panel into a deployable artifact: a reproducible production build, deep links that survive a direct visit or reload, the license and attribution material that must ship with it, the absence of any required secret, and the checks that gate a release.

## ADDED Requirements

### Requirement: Reproducible production build

A production build SHALL be producible from a clean checkout of the repository using the documented commands, and MUST fail loudly without publishing partial output when any step of the build fails.

#### Scenario: Clean checkout build
- **WHEN** the documented build is run against a clean checkout
- **THEN** it completes without manual intervention and produces the deployable output

#### Scenario: Build failure
- **WHEN** a step of the build fails
- **THEN** the build reports the failure and no deployable output is published

### Requirement: Deep-link resolution

Every list and detail location SHALL resolve when visited directly or reloaded, serving the application shell and rendering the requested view instead of a not-found response.

#### Scenario: Direct visit to a nested location
- **WHEN** an operator opens a nested or detail location directly in a fresh browser
- **THEN** the application shell loads and the requested view is rendered without a not-found response

#### Scenario: Reload on a deep link
- **WHEN** an operator reloads the browser on any deep link
- **THEN** the same view is restored

### Requirement: License and attribution

The repository SHALL contain the license and attribution material for the project and its included dependencies, and the published build MUST include that material.

#### Scenario: Material present in the repository
- **WHEN** the repository is inspected
- **THEN** the project license and the attribution for included dependencies are present

#### Scenario: Material shipped with the build
- **WHEN** the production artifact is published
- **THEN** the license and attribution material is reachable from the published output

#### Scenario: Missing material blocks release
- **WHEN** the license or attribution material is absent
- **THEN** the release checks fail and the artifact is not published

### Requirement: No required secret or credential

Building and running the panel SHALL require no secret, token or environment credential, and the published demonstration MUST be fully operable on first load without any configuration.

#### Scenario: Building without configuration
- **WHEN** the build and the published artifact are used on a machine that holds no project-specific credentials
- **THEN** the build succeeds and the demonstration is operable

#### Scenario: First load
- **WHEN** a reviewer opens the published build for the first time
- **THEN** the panel is usable without entering any configuration or credential

### Requirement: Release checks

A release SHALL be permitted only after the type checks, the linter, the specification validation and the design detector all pass, and any failing check MUST be reported so the release is blocked.

#### Scenario: All checks pass
- **WHEN** the type checks, the linter, the specification validation and the design detector all pass
- **THEN** the release may proceed

#### Scenario: A check fails
- **WHEN** any of those checks fails
- **THEN** the release is blocked and the failing check is named
