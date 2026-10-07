/** The mock API layer: the only data source in the panel.
 *
 *  Everything the interface reads or writes goes through this module, with the shape a real HTTP
 *  service would have (async, typed, paginated, failures it can throw). Replacing it with a real
 *  backend is a change to this file and nothing else — no screen imports the seed or the store.
 *
 *  Guarantees this module owns:
 *   - mutual state: one store, one writer, persisted to browser storage across reloads;
 *   - exactly one audit event per state-changing operation, with field-level before/after;
 *   - simulated latency, and failures that are opt-in rather than random, so an empty list is
 *     never confused with a failed request. */

import { isAdministrationRole, permissionUnion, PERMISSION_IDS } from "./permissions";
import { SCHEMA_VERSION, seed, type Database } from "./seed";
import {
  ApiError,
  type AuditEvent,
  type DashboardSummary,
  type FieldChange,
  type Identity,
  type ListQuery,
  type Membership,
  type MembershipRole,
  type Organization,
  type Page,
  type Role,
  type Session,
  type User,
  type UserStatus,
  type WorkspaceSettings,
} from "./types";

const STORAGE_KEY = "admin-panel.db";
const DAY = 86_400_000;
export const PAGE_SIZES = [10, 25, 50] as const;
export const DEFAULT_PAGE_SIZE = 25;

export type FailureMode = "off" | "next" | "always";

interface Runtime {
  latencyMs: number;
  failure: FailureMode;
  actor: { id: string; name: string };
}

const runtime: Runtime = {
  latencyMs: 160,
  failure: "off",
  actor: { id: "usr_owner", name: "Mara Ilesanmi" },
};

let store: Database | null = null;

function nowMs(): number {
  return Date.now();
}

function readStore(): Database {
  if (store) return store;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Database;
      if (parsed?.version === SCHEMA_VERSION && Array.isArray(parsed.users)) {
        store = parsed;
        return store;
      }
    }
  } catch {
    // a corrupt or unreadable store is treated as empty and reseeded deterministically
  }
  store = seed(nowMs());
  persist();
  return store;
}

function persist(): void {
  if (!store) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage full or unavailable: the panel keeps working in memory for this session
  }
}

function mutate<T>(fn: (db: Database) => T): T {
  const db = readStore();
  const result = fn(db);
  persist();
  return result;
}

/* ------------------------------------------------------------------ runtime controls */

export function configure(options: { latencyMs?: number; failure?: FailureMode }): void {
  if (options.latencyMs !== undefined) runtime.latencyMs = options.latencyMs;
  if (options.failure !== undefined) runtime.failure = options.failure;
}

export function currentRuntime(): Runtime {
  return { ...runtime, actor: { ...runtime.actor } };
}

export function setActor(identity: Identity | null): void {
  runtime.actor = identity
    ? { id: identity.userId, name: identity.name }
    : { id: "system", name: "System" };
}

export function databaseInfo(): { seededAt: string; version: number; records: number } {
  const db = readStore();
  return {
    seededAt: db.seededAt,
    version: db.version,
    records:
      db.users.length +
      db.roles.length +
      db.organizations.length +
      db.sessions.length +
      db.audit.length +
      db.memberships.length,
  };
}

export function resetDatabase(): void {
  store = seed(nowMs());
  persist();
}

/** Point the board's "current session" at the signed-in account, creating a session row when the
 *  account has none, so the interface can always mark which session is the operator's own. */
export async function bindCurrentSession(userId: string): Promise<void> {
  await gate();
  return mutate((db) => {
    const existing = db.sessions.find((s) => s.userId === userId);
    if (existing) {
      db.currentSessionId = existing.id;
      return;
    }
    const session: Session = {
      id: nextId("ses", db.sessions),
      userId,
      device: navigator.userAgent.includes("Mac") ? "MacBook Pro" : "Windows Desktop",
      browser: navigator.userAgent.includes("Firefox") ? "Firefox 133" : "Chrome 141",
      location: "Hanoi, VN",
      ip: "203.0.113.24",
      startedAt: new Date(nowMs()).toISOString(),
      lastSeenAt: new Date(nowMs()).toISOString(),
      current: true,
    };
    db.sessions = [session, ...db.sessions];
    db.currentSessionId = session.id;
  });
}

async function gate(): Promise<void> {
  if (runtime.latencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, runtime.latencyMs));
  }
  if (runtime.failure === "always" || runtime.failure === "next") {
    const wasNext = runtime.failure === "next";
    if (wasNext) runtime.failure = "off";
    throw new ApiError(
      wasNext ? "server" : "offline",
      wasNext
        ? "The service returned an error (simulated). Nothing was changed."
        : "The service is unreachable (simulated). Nothing was changed.",
    );
  }
}

/* ------------------------------------------------------------------ helpers */

function nextId(prefix: string, existing: { id: string }[]): string {
  const highest = existing.reduce((max, item) => {
    const n = Number.parseInt(item.id.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `${prefix}_${String(highest + 1).padStart(4, "0")}`;
}

function compare(a: string | number | null, b: string | number | null): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a < b ? -1 : 1;
}

function paginate<T>(rows: T[], query: ListQuery): Page<T> {
  const pageSize = PAGE_SIZES.includes(query.pageSize as (typeof PAGE_SIZES)[number])
    ? (query.pageSize as number)
    : DEFAULT_PAGE_SIZE;
  const total = rows.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, query.page ?? 1), maxPage);
  return { items: rows.slice((page - 1) * pageSize, page * pageSize), total, page, pageSize };
}

function sortRows<T>(rows: T[], sort: string | undefined, dir: "asc" | "desc", key: (row: T, field: string) => string | number | null): T[] {
  if (!sort) return rows;
  const sorted = [...rows].sort((a, b) => compare(key(a, sort), key(b, sort)));
  return dir === "desc" ? sorted.reverse() : sorted;
}

function appendEvent(
  db: Database,
  input: {
    action: string;
    targetType: AuditEvent["targetType"];
    targetId: string;
    targetLabel: string;
    changes?: FieldChange[];
  },
): AuditEvent {
  const event: AuditEvent = {
    id: nextId("evt", db.audit),
    at: new Date(nowMs()).toISOString(),
    actorId: runtime.actor.id,
    actorName: runtime.actor.name,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    targetLabel: input.targetLabel,
    ip: "203.0.113.24",
    changes: input.changes ?? [],
  };
  db.audit = [event, ...db.audit];
  return event;
}

function requireUser(db: Database, id: string): User {
  const user = db.users.find((u) => u.id === id);
  if (!user) throw new ApiError("not_found", `No user ${id}. The record may have been removed.`);
  return user;
}

function permissionsOf(db: Database, roleIds: string[]): string[] {
  return permissionUnion(roleIds, db.roles);
}

/** The rule that keeps the workspace administrable: at least one ACTIVE user must hold a role
 *  that grants administration, or the check throws before the change lands. */
function assertAdministrationRemains(db: Database, nextUsers: User[]): void {
  const administrators = nextUsers.filter(
    (u) => u.status === "active" && isAdministrationRole(permissionsOf(db, u.roleIds)),
  );
  if (administrators.length === 0) {
    throw new ApiError(
      "conflict",
      "This would leave the workspace with no active administrator. Grant an administration role first.",
    );
  }
}

/* ------------------------------------------------------------------ reads */

export async function listUsers(query: ListQuery = {}): Promise<Page<User>> {
  await gate();
  let rows = [...readStore().users];
  const q = query.q?.trim().toLowerCase();
  if (q) rows = rows.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  if (query.status) rows = rows.filter((u) => u.status === query.status);
  if (query.roleId) rows = rows.filter((u) => u.roleIds.includes(query.roleId!));
  if (query.orgId) rows = rows.filter((u) => u.orgIds.includes(query.orgId!));
  rows = sortRows(rows, query.sort, query.dir ?? "asc", (u, field) => {
    if (field === "status") return u.status;
    if (field === "lastActiveAt") return u.lastActiveAt ? 0 : 1;
    if (field === "lastActiveAtRaw") return u.lastActiveAt;
    if (field === "createdAt") return u.createdAt;
    if (field === "email") return u.email;
    return u.name;
  });
  if (query.sort === "lastActiveAt") {
    rows.sort((a, b) => compare(b.lastActiveAt ?? "", a.lastActiveAt ?? ""));
    if (query.dir === "asc") rows.reverse();
  }
  return paginate(rows, query);
}

export async function getUser(id: string): Promise<{
  user: User;
  roles: Role[];
  memberships: (Membership & { organization: Organization })[];
  activity: AuditEvent[];
}> {
  await gate();
  const db = readStore();
  const user = requireUser(db, id);
  return {
    user,
    roles: db.roles.filter((r) => user.roleIds.includes(r.id)),
    memberships: db.memberships
      .filter((m) => m.userId === id)
      .map((m) => ({ ...m, organization: db.organizations.find((o) => o.id === m.orgId)! }))
      .filter((m) => Boolean(m.organization)),
    activity: db.audit.filter((e) => e.targetId === id || e.actorId === id).slice(0, 12),
  };
}

export async function listRoles(): Promise<(Role & { memberCount: number })[]> {
  await gate();
  const db = readStore();
  return db.roles.map((role) => ({
    ...role,
    memberCount: db.users.filter((u) => u.roleIds.includes(role.id)).length,
  }));
}

export async function getRole(id: string): Promise<{ role: Role; members: User[] }> {
  await gate();
  const db = readStore();
  const role = db.roles.find((r) => r.id === id);
  if (!role) throw new ApiError("not_found", `No role ${id}.`);
  return { role, members: db.users.filter((u) => u.roleIds.includes(id)) };
}

export async function listOrganizations(query: ListQuery = {}): Promise<Page<Organization & { memberCount: number }>> {
  await gate();
  const db = readStore();
  let rows = db.organizations.map((o) => ({
    ...o,
    memberCount: db.memberships.filter((m) => m.orgId === o.id).length,
  }));
  const q = query.q?.trim().toLowerCase();
  if (q) rows = rows.filter((o) => o.name.toLowerCase().includes(q) || o.slug.includes(q));
  rows = sortRows(rows, query.sort, query.dir ?? "asc", (o, field) => {
    if (field === "plan") return o.plan;
    if (field === "status") return o.status;
    if (field === "memberCount") return o.memberCount;
    if (field === "createdAt") return o.createdAt;
    return o.name;
  });
  return paginate(rows, query);
}

export async function getOrganization(id: string): Promise<{
  organization: Organization;
  members: (Membership & { user: User })[];
}> {
  await gate();
  const db = readStore();
  const organization = db.organizations.find((o) => o.id === id);
  if (!organization) throw new ApiError("not_found", `No organization ${id}.`);
  const members = db.memberships
    .filter((m) => m.orgId === id)
    .map((m) => ({ ...m, user: db.users.find((u) => u.id === m.userId)! }))
    .filter((m) => Boolean(m.user));
  return { organization, members };
}

export async function listSessions(query: ListQuery = {}): Promise<Page<Session & { user: User | undefined }>> {
  await gate();
  const db = readStore();
  let rows = db.sessions;
  if (query.orgId) {
    const inOrg = new Set(db.users.filter((u) => u.orgIds.includes(query.orgId!)).map((u) => u.id));
    rows = rows.filter((s) => inOrg.has(s.userId));
  }
  const q = query.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter((s) => {
      const user = db.users.find((u) => u.id === s.userId);
      return (
        s.device.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.ip.toLowerCase().includes(q) ||
        (user?.name.toLowerCase().includes(q) ?? false) ||
        (user?.email.toLowerCase().includes(q) ?? false)
      );
    });
  }
  const withUser = rows.map((s) => ({ ...s, current: s.id === db.currentSessionId, user: db.users.find((u) => u.id === s.userId) }));
  const sorted = sortRows(withUser, query.sort, query.dir ?? "desc", (s, field) => {
    if (field === "user") return s.user?.name ?? "";
    if (field === "device") return s.device;
    if (field === "location") return s.location;
    if (field === "lastSeenAt") return s.lastSeenAt;
    return s.startedAt;
  });
  return paginate(sorted, query);
}

export async function listAudit(query: ListQuery = {}): Promise<Page<AuditEvent>> {
  await gate();
  const db = readStore();
  let rows = [...db.audit];
  const q = query.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (e) =>
        e.actorName.toLowerCase().includes(q) ||
        e.targetLabel.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q),
    );
  }
  if (query.action) rows = rows.filter((e) => e.action === query.action);
  if (query.actorId) rows = rows.filter((e) => e.actorId === query.actorId);
  if (query.orgId) {
    const inOrg = new Set(db.users.filter((u) => u.orgIds.includes(query.orgId!)).map((u) => u.id));
    rows = rows.filter((e) => inOrg.has(e.actorId) || inOrg.has(e.targetId));
  }
  if (query.from) rows = rows.filter((e) => e.at >= query.from!);
  if (query.to) rows = rows.filter((e) => e.at <= `${query.to!}T23:59:59.999Z`);
  if (query.sort === "at" || !query.sort) {
    rows.sort((a, b) => (a.at < b.at ? 1 : -1));
    if (query.dir === "asc") rows.reverse();
  }
  return paginate(rows, query);
}

export async function getAuditEvent(id: string): Promise<AuditEvent> {
  await gate();
  const event = readStore().audit.find((e) => e.id === id);
  if (!event) throw new ApiError("not_found", `No audit event ${id}.`);
  return event;
}

export async function auditActions(): Promise<string[]> {
  await gate();
  return [...new Set(readStore().audit.map((e) => e.action))].sort();
}

export async function getSettings(): Promise<WorkspaceSettings> {
  await gate();
  return { ...readStore().settings };
}

export async function dashboardSummary(orgId?: string): Promise<DashboardSummary> {
  await gate();
  const db = readStore();
  const end = nowMs();
  const start = end - 30 * DAY;
  const previousStart = start - 30 * DAY;

  const scopedUsers = orgId ? db.users.filter((u) => u.orgIds.includes(orgId)) : db.users;
  const userIds = new Set(scopedUsers.map((u) => u.id));
  const scopedSessions = orgId ? db.sessions.filter((s) => userIds.has(s.userId)) : db.sessions;
  const scopedEvents = orgId
    ? db.audit.filter((e) => userIds.has(e.actorId) || userIds.has(e.targetId))
    : db.audit;

  const inPeriod = (iso: string, from: number, to: number) => {
    const t = new Date(iso).getTime();
    return t >= from && t <= to;
  };

  const usersThis = scopedUsers.filter((u) => inPeriod(u.createdAt, start, end)).length;
  const usersPrev = scopedUsers.filter((u) => inPeriod(u.createdAt, previousStart, start)).length;
  const sessionsThis = scopedSessions.filter((s) => inPeriod(s.startedAt, start, end)).length;
  const sessionsPrev = scopedSessions.filter((s) => inPeriod(s.startedAt, previousStart, start)).length;
  const orgsThis = db.organizations.filter((o) => inPeriod(o.createdAt, start, end)).length;
  const orgsPrev = db.organizations.filter((o) => inPeriod(o.createdAt, previousStart, start)).length;
  const eventsThis = scopedEvents.filter((e) => inPeriod(e.at, start, end)).length;
  const eventsPrev = scopedEvents.filter((e) => inPeriod(e.at, previousStart, start)).length;

  return {
    period: { from: new Date(start).toISOString(), to: new Date(end).toISOString() },
    users: {
      total: scopedUsers.length,
      active: scopedUsers.filter((u) => u.status === "active").length,
      invited: scopedUsers.filter((u) => u.status === "invited").length,
      suspended: scopedUsers.filter((u) => u.status === "suspended").length,
      delta: usersThis - usersPrev,
    },
    sessions: {
      total: scopedSessions.length,
      other: scopedSessions.filter((s) => s.id !== db.currentSessionId).length,
      delta: sessionsThis - sessionsPrev,
    },
    organizations: { total: db.organizations.length, delta: orgsThis - orgsPrev },
    events: { total: eventsThis, delta: eventsThis - eventsPrev },
    recent: scopedEvents.slice(0, 8),
  };
}

/* ------------------------------------------------------------------ writes */

function diff(changes: FieldChange[]): FieldChange[] {
  return changes.filter((c) => c.before !== c.after);
}

export async function createUser(input: {
  name: string;
  email: string;
  roleIds: string[];
  orgIds: string[];
  status?: UserStatus;
}): Promise<User> {
  await gate();
  return mutate((db) => {
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError("conflict", `“${input.email}” is not a valid email address.`);
    }
    if (db.users.some((u) => u.email.toLowerCase() === email)) {
      throw new ApiError("conflict", `${email} already belongs to a user on this board.`);
    }
    if (input.name.trim().length < 2) throw new ApiError("conflict", "A display name is required.");
    const user: User = {
      id: nextId("usr", db.users),
      name: input.name.trim(),
      email,
      status: input.status ?? db.settings.defaultUserStatus,
      roleIds: input.roleIds.length > 0 ? input.roleIds : [],
      orgIds: input.orgIds,
      mfa: false,
      createdAt: new Date(nowMs()).toISOString(),
      lastActiveAt: null,
    };
    db.users = [user, ...db.users];
    for (const orgId of input.orgIds) {
      db.memberships = [...db.memberships, { orgId, userId: user.id, memberRole: "member", joinedAt: user.createdAt }];
    }
    appendEvent(db, {
      action: user.status === "invited" ? "user.invited" : "user.created",
      targetType: "user",
      targetId: user.id,
      targetLabel: user.name,
      changes: diff([
        { field: "email", before: null, after: user.email },
        { field: "status", before: null, after: user.status },
        { field: "roles", before: null, after: user.roleIds.join(", ") || "none" },
      ]),
    });
    return user;
  });
}

export async function updateUser(
  id: string,
  input: { name?: string; email?: string; roleIds?: string[]; mfa?: boolean },
): Promise<User> {
  await gate();
  return mutate((db) => {
    const user = requireUser(db, id);
    const changes: FieldChange[] = [];
    const next: User = { ...user };

    if (input.name !== undefined && input.name.trim() !== user.name) {
      if (input.name.trim().length < 2) throw new ApiError("conflict", "A display name is required.");
      changes.push({ field: "name", before: user.name, after: input.name.trim() });
      next.name = input.name.trim();
    }
    if (input.email !== undefined) {
      const email = input.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ApiError("conflict", `“${input.email}” is not a valid email address.`);
      }
      if (db.users.some((u) => u.id !== id && u.email.toLowerCase() === email)) {
        throw new ApiError("conflict", `${email} already belongs to a user on this board.`);
      }
      if (email !== user.email) {
        changes.push({ field: "email", before: user.email, after: email });
        next.email = email;
      }
    }
    if (input.mfa !== undefined && input.mfa !== user.mfa) {
      changes.push({ field: "mfa", before: user.mfa ? "enabled" : "disabled", after: input.mfa ? "enabled" : "disabled" });
      next.mfa = input.mfa;
    }
    if (input.roleIds) {
      const sorted = [...input.roleIds].sort();
      if (sorted.join(",") !== [...user.roleIds].sort().join(",")) {
        const nextUsers = db.users.map((u) => (u.id === id ? { ...next, roleIds: sorted } : u));
        assertAdministrationRemains(db, nextUsers);
        changes.push({ field: "roles", before: user.roleIds.join(", "), after: sorted.join(", ") });
        next.roleIds = sorted;
      }
    }
    if (changes.length === 0) return user;
    db.users = db.users.map((u) => (u.id === id ? next : u));
    appendEvent(db, {
      action: "user.updated",
      targetType: "user",
      targetId: next.id,
      targetLabel: next.name,
      changes: diff(changes),
    });
    return next;
  });
}

export async function setUserStatus(id: string, status: UserStatus): Promise<User> {
  await gate();
  return mutate((db) => {
    const user = requireUser(db, id);
    if (user.status === status) return user;
    const next: User = { ...user, status };
    const nextUsers = db.users.map((u) => (u.id === id ? next : u));
    assertAdministrationRemains(db, nextUsers);
    db.users = nextUsers;
    if (status === "deactivated") {
      db.sessions = db.sessions.filter((s) => s.userId !== id);
    }
    appendEvent(db, {
      action: status === "suspended" ? "user.suspended" : status === "active" ? "user.reactivated" : `user.${status}`,
      targetType: "user",
      targetId: id,
      targetLabel: user.name,
      changes: [{ field: "status", before: user.status, after: status }],
    });
    return next;
  });
}

export async function bulkSetUserStatus(ids: string[], status: UserStatus): Promise<{ changed: number; skipped: number }> {
  await gate();
  return mutate((db) => {
    const targets = db.users.filter((u) => ids.includes(u.id));
    const applicable = targets.filter((u) => u.status !== status);
    const skipped = ids.length - applicable.length;
    if (applicable.length === 0) return { changed: 0, skipped };
    const nextUsers = db.users.map((u) => (applicable.some((a) => a.id === u.id) ? { ...u, status } : u));
    assertAdministrationRemains(db, nextUsers);
    db.users = nextUsers;
    if (status === "deactivated") {
      db.sessions = db.sessions.filter((s) => !applicable.some((a) => a.id === s.userId));
    }
    for (const user of applicable) {
      appendEvent(db, {
        action: `user.${status}`,
        targetType: "user",
        targetId: user.id,
        targetLabel: user.name,
        changes: [{ field: "status", before: user.status, after: status }],
      });
    }
    return { changed: applicable.length, skipped };
  });
}

export async function createRole(input: { name: string; description: string; permissions: string[] }): Promise<Role> {
  await gate();
  return mutate((db) => {
    const name = input.name.trim();
    if (name.length < 2) throw new ApiError("conflict", "A role name is required.");
    if (db.roles.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
      throw new ApiError("conflict", `A role called “${name}” already exists.`);
    }
    const role: Role = {
      id: nextId("role", db.roles),
      name,
      description: input.description.trim(),
      system: false,
      permissions: input.permissions.filter((p) => PERMISSION_IDS.includes(p)),
      createdAt: new Date(nowMs()).toISOString(),
    };
    db.roles = [...db.roles, role];
    appendEvent(db, {
      action: "role.created",
      targetType: "role",
      targetId: role.id,
      targetLabel: role.name,
      changes: [{ field: "permissions", before: null, after: `${role.permissions.length} granted` }],
    });
    return role;
  });
}

export async function updateRole(
  id: string,
  input: { name?: string; description?: string; permissions?: string[] },
): Promise<Role> {
  await gate();
  return mutate((db) => {
    const role = db.roles.find((r) => r.id === id);
    if (!role) throw new ApiError("not_found", `No role ${id}.`);
    const next: Role = { ...role };
    const changes: FieldChange[] = [];

    if (input.name !== undefined && input.name.trim() !== role.name) {
      const name = input.name.trim();
      if (name.length < 2) throw new ApiError("conflict", "A role name is required.");
      if (db.roles.some((r) => r.id !== id && r.name.toLowerCase() === name.toLowerCase())) {
        throw new ApiError("conflict", `A role called “${name}” already exists.`);
      }
      changes.push({ field: "name", before: role.name, after: name });
      next.name = name;
    }
    if (input.description !== undefined && input.description !== role.description) {
      changes.push({ field: "description", before: role.description, after: input.description });
      next.description = input.description;
    }
    if (input.permissions) {
      const permissions = input.permissions.filter((p) => PERMISSION_IDS.includes(p));
      const before = [...role.permissions].sort().join(",");
      const after = [...permissions].sort().join(",");
      if (before !== after) {
        const nextRoles = db.roles.map((r) => (r.id === id ? { ...next, permissions } : r));
        const administrators = db.users.filter(
          (u) => u.status === "active" && isAdministrationRole(permissionUnion(u.roleIds, nextRoles)),
        );
        if (administrators.length === 0) {
          throw new ApiError(
            "conflict",
            "This change would leave no role able to administer the workspace. Grant administration elsewhere first.",
          );
        }
        changes.push({
          field: "permissions",
          before: `${role.permissions.length} granted`,
          after: `${permissions.length} granted`,
        });
        next.permissions = permissions;
      }
    }
    if (changes.length === 0) return role;
    db.roles = db.roles.map((r) => (r.id === id ? next : r));
    appendEvent(db, {
      action: "role.updated",
      targetType: "role",
      targetId: next.id,
      targetLabel: next.name,
      changes: diff(changes),
    });
    return next;
  });
}

export async function deleteRole(id: string): Promise<void> {
  await gate();
  return mutate((db) => {
    const role = db.roles.find((r) => r.id === id);
    if (!role) throw new ApiError("not_found", `No role ${id}.`);
    if (role.system) {
      throw new ApiError("conflict", `${role.name} is a system role and cannot be deleted.`);
    }
    const holders = db.users.filter((u) => u.roleIds.includes(id));
    if (holders.length > 0) {
      throw new ApiError("conflict", `${holders.length} users still hold ${role.name}. Move them before deleting it.`);
    }
    const remaining = db.roles.filter((r) => r.id !== id);
    const administrators = db.users.filter(
      (u) => u.status === "active" && isAdministrationRole(permissionUnion(u.roleIds, remaining)),
    );
    if (administrators.length === 0) {
      throw new ApiError("conflict", "This is the last role that can administer the workspace, so it cannot be deleted.");
    }
    db.roles = remaining;
    appendEvent(db, {
      action: "role.deleted",
      targetType: "role",
      targetId: role.id,
      targetLabel: role.name,
      changes: [{ field: "state", before: "present", after: "deleted" }],
    });
  });
}

export async function addOrganizationMember(
  orgId: string,
  userId: string,
  memberRole: MembershipRole,
): Promise<Membership> {
  await gate();
  return mutate((db) => {
    const org = db.organizations.find((o) => o.id === orgId);
    if (!org) throw new ApiError("not_found", `No organization ${orgId}.`);
    const user = requireUser(db, userId);
    if (db.memberships.some((m) => m.orgId === orgId && m.userId === userId)) {
      throw new ApiError("conflict", `${user.name} is already a member of ${org.name}.`);
    }
    const membership: Membership = { orgId, userId, memberRole, joinedAt: new Date(nowMs()).toISOString() };
    db.memberships = [...db.memberships, membership];
    db.users = db.users.map((u) => (u.id === userId ? { ...u, orgIds: [...new Set([...u.orgIds, orgId])] } : u));
    appendEvent(db, {
      action: "organization.member_added",
      targetType: "organization",
      targetId: orgId,
      targetLabel: org.name,
      changes: [{ field: "member", before: null, after: `${user.name} (${memberRole})` }],
    });
    return membership;
  });
}

export async function updateOrganizationMember(orgId: string, userId: string, memberRole: MembershipRole): Promise<void> {
  await gate();
  return mutate((db) => {
    const membership = db.memberships.find((m) => m.orgId === orgId && m.userId === userId);
    if (!membership) throw new ApiError("not_found", "That user is not a member of this organization.");
    const org = db.organizations.find((o) => o.id === orgId);
    const user = requireUser(db, userId);
    if (membership.memberRole === memberRole) return;
    if (membership.memberRole === "owner") {
      const owners = db.memberships.filter((m) => m.orgId === orgId && m.memberRole === "owner");
      if (owners.length <= 1) {
        throw new ApiError("conflict", `${user.name} is the last owner of ${org?.name ?? "this organization"}. Promote someone else first.`);
      }
    }
    db.memberships = db.memberships.map((m) =>
      m.orgId === orgId && m.userId === userId ? { ...m, memberRole } : m,
    );
    appendEvent(db, {
      action: "organization.member_role_changed",
      targetType: "organization",
      targetId: orgId,
      targetLabel: org?.name ?? orgId,
      changes: [{ field: `${user.name} role`, before: membership.memberRole, after: memberRole }],
    });
  });
}

export async function removeOrganizationMember(orgId: string, userId: string): Promise<void> {
  await gate();
  return mutate((db) => {
    const membership = db.memberships.find((m) => m.orgId === orgId && m.userId === userId);
    if (!membership) throw new ApiError("not_found", "That user is not a member of this organization.");
    const org = db.organizations.find((o) => o.id === orgId);
    const user = requireUser(db, userId);
    if (membership.memberRole === "owner") {
      const owners = db.memberships.filter((m) => m.orgId === orgId && m.memberRole === "owner");
      if (owners.length <= 1) {
        throw new ApiError("conflict", `${user.name} is the last owner of ${org?.name ?? "this organization"}, so they cannot be removed.`);
      }
    }
    db.memberships = db.memberships.filter((m) => !(m.orgId === orgId && m.userId === userId));
    db.users = db.users.map((u) => (u.id === userId ? { ...u, orgIds: u.orgIds.filter((o) => o !== orgId) } : u));
    appendEvent(db, {
      action: "organization.member_removed",
      targetType: "organization",
      targetId: orgId,
      targetLabel: org?.name ?? orgId,
      changes: [{ field: "member", before: user.name, after: null }],
    });
  });
}

export async function revokeSession(id: string): Promise<void> {
  await gate();
  return mutate((db) => {
    const session = db.sessions.find((s) => s.id === id);
    if (!session) throw new ApiError("not_found", `Session ${id} is already gone.`);
    const user = db.users.find((u) => u.id === session.userId);
    db.sessions = db.sessions.filter((s) => s.id !== id);
    appendEvent(db, {
      action: "session.revoked",
      targetType: "session",
      targetId: id,
      targetLabel: `${session.device} · ${session.location}`,
      changes: [
        { field: "state", before: "active", after: "revoked" },
        { field: "held by", before: user?.name ?? session.userId, after: user?.name ?? session.userId },
      ],
    });
  });
}

export async function revokeOtherSessions(): Promise<{ revoked: number }> {
  await gate();
  return mutate((db) => {
    const others = db.sessions.filter((s) => s.id !== db.currentSessionId);
    if (others.length === 0) return { revoked: 0 };
    db.sessions = db.sessions.filter((s) => s.id === db.currentSessionId);
    appendEvent(db, {
      action: "session.revoked_others",
      targetType: "session",
      targetId: db.currentSessionId,
      targetLabel: `${others.length} other sessions`,
      changes: [{ field: "active sessions", before: String(others.length + 1), after: "1" }],
    });
    return { revoked: others.length };
  });
}

export async function updateSettings(input: Partial<WorkspaceSettings>): Promise<WorkspaceSettings> {
  await gate();
  return mutate((db) => {
    const next = { ...db.settings };
    const changes: FieldChange[] = [];
    if (input.name !== undefined && input.name.trim() !== db.settings.name) {
      if (input.name.trim().length < 2) throw new ApiError("conflict", "The workspace needs a name of at least two characters.");
      changes.push({ field: "name", before: db.settings.name, after: input.name.trim() });
      next.name = input.name.trim();
    }
    if (input.slug !== undefined && input.slug !== db.settings.slug) {
      const slug = input.slug.trim();
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length < 3) {
        throw new ApiError("conflict", `“${slug}” is not a valid slug. Use lowercase letters, numbers and single hyphens.`);
      }
      if (db.organizations.some((o) => o.slug === slug)) {
        throw new ApiError("conflict", `The slug “${slug}” is already used by an organization.`);
      }
      changes.push({ field: "slug", before: db.settings.slug, after: slug });
      next.slug = slug;
    }
    if (input.defaultUserStatus !== undefined && input.defaultUserStatus !== db.settings.defaultUserStatus) {
      changes.push({ field: "default user status", before: db.settings.defaultUserStatus, after: input.defaultUserStatus });
      next.defaultUserStatus = input.defaultUserStatus;
    }
    if (input.defaultLanding !== undefined && input.defaultLanding !== db.settings.defaultLanding) {
      changes.push({ field: "default landing", before: db.settings.defaultLanding, after: input.defaultLanding });
      next.defaultLanding = input.defaultLanding;
    }
    if (changes.length === 0) return db.settings;
    db.settings = next;
    appendEvent(db, {
      action: "settings.updated",
      targetType: "settings",
      targetId: "workspace",
      targetLabel: "Workspace settings",
      changes: diff(changes),
    });
    return next;
  });
}
