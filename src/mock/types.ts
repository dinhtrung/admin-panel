/** The domain the panel administers. Every value here is authored synthetic data: no real
 *  person, company or measurement appears anywhere in this project. */

export type UserStatus = "active" | "invited" | "suspended" | "deactivated";

export const USER_STATUSES: UserStatus[] = ["active", "invited", "suspended", "deactivated"];

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  roleIds: string[];
  orgIds: string[];
  mfa: boolean;
  createdAt: string;
  lastActiveAt: string | null;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  system: boolean;
  permissions: string[];
  createdAt: string;
}

export type OrgPlan = "starter" | "growth" | "enterprise";
export type OrgStatus = "active" | "trial" | "past_due";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: OrgPlan;
  status: OrgStatus;
  createdAt: string;
}

export type MembershipRole = "owner" | "admin" | "member";

export interface Membership {
  orgId: string;
  userId: string;
  memberRole: MembershipRole;
  joinedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  startedAt: string;
  lastSeenAt: string;
  current: boolean;
}

export interface FieldChange {
  field: string;
  before: string | null;
  after: string | null;
}

export interface AuditEvent {
  id: string;
  at: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: "user" | "role" | "organization" | "session" | "settings";
  targetId: string;
  targetLabel: string;
  ip: string;
  changes: FieldChange[];
}

export interface WorkspaceSettings {
  name: string;
  slug: string;
  defaultUserStatus: UserStatus;
  defaultLanding: "dashboard" | "users" | "sessions" | "audit";
}

export interface Identity {
  userId: string;
  name: string;
  email: string;
  roleIds: string[];
}

export interface ListQuery {
  page?: number;
  pageSize?: number;
  sort?: string;
  dir?: "asc" | "desc";
  q?: string;
  status?: string;
  roleId?: string;
  orgId?: string;
  action?: string;
  actorId?: string;
  from?: string;
  to?: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardSummary {
  period: { from: string; to: string };
  users: { total: number; active: number; invited: number; suspended: number; delta: number };
  sessions: { total: number; other: number; delta: number };
  organizations: { total: number; delta: number };
  events: { total: number; delta: number };
  recent: AuditEvent[];
}

export class ApiError extends Error {
  readonly code: "offline" | "server" | "not_found" | "conflict";
  constructor(code: ApiError["code"], message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}
