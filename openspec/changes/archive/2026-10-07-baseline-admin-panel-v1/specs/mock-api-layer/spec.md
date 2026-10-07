## Purpose

Provide the deterministic in-browser data source that stands in for a backend: a seeded catalogue of
the administered objects, complete create/read/update/delete operations with simulated latency and
failures, durable local mutations, and a typed contract a real service can honour without any change
to the user interface.

## ADDED Requirements

### Requirement: Deterministic seeded catalogue
The data source SHALL expose a fixed, deterministic set of records for users, roles, organizations,
sessions and audit events that is identical on every load of the same build.

#### Scenario: Repeated list request is stable
- **WHEN** the same list request is issued twice within one session
- **THEN** both responses contain the same records in the same order with the same identifiers

#### Scenario: Cold start
- **WHEN** the application loads with no locally persisted changes
- **THEN** every administered object resolves to the built-in seed records and no request fails for lack of data

### Requirement: Operations across every administered object
The data source SHALL provide list, read, create, update and delete operations for each of users,
roles, organizations, sessions and audit events.

#### Scenario: List and read
- **WHEN** a list operation is requested for an administered object
- **THEN** a collection is returned whose records each carry a stable identifier, and a read operation by one such identifier returns that record

#### Scenario: Missing record
- **WHEN** a read, update or delete is requested with an identifier that does not exist
- **THEN** a not-found failure response is returned and no record is changed

#### Scenario: Create and update return the new state
- **WHEN** a record is created or updated through the data source
- **THEN** the response describes the stored record, and a later read of the same identifier returns those values

### Requirement: Simulated latency and failure responses
The data source SHALL simulate request latency and SHALL be able to return failure responses so that
consuming views can exercise their in-flight and error states.

#### Scenario: Requests do not resolve immediately
- **WHEN** any request is issued
- **THEN** it does not resolve synchronously and the caller can observe an in-flight state before the result

#### Scenario: Simulated failure leaves data unchanged
- **WHEN** a request is configured to fail
- **THEN** a failure response that identifies the failure is returned and no stored record is mutated

#### Scenario: Failure is distinguishable from an empty result
- **WHEN** a list request fails
- **THEN** the outcome is distinguishable from a successful request that legitimately returns no records

### Requirement: Mutations persist across a reload
The data source SHALL persist mutations locally so that created, updated and deleted records survive
a page reload without any server.

#### Scenario: Created record survives a reload
- **WHEN** a record is created and the page is then reloaded
- **THEN** the record is still returned by subsequent list and read operations

#### Scenario: Deletion survives a reload
- **WHEN** a seeded record is deleted and the page is then reloaded
- **THEN** the record is no longer returned and re-seeding does not restore it

### Requirement: Backend-substitutable contract
The data source SHALL satisfy a typed request and response contract for every operation such that a
real backend implementing the same contract can replace it without any change to the user interface.

#### Scenario: Every operation goes through the contract
- **WHEN** a consumer performs any supported operation
- **THEN** it does so only through the shared contract, so the same calls succeed against any implementation of that contract

#### Scenario: Failures conform to the contract
- **WHEN** an implementation returns a not-found or failure response
- **THEN** that response conforms to the shared contract so the consumer handles it without implementation-specific knowledge
