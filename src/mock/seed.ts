/** Deterministic seed data.
 *
 *  Every list, count and capture in the panel comes from here, so two runs of the same seed
 *  produce the same board. Timestamps are derived from one anchor taken at first run, which is
 *  stored with the data — a reload keeps the board identical, and the recent-activity views stay
 *  meaningful instead of ageing into a fixed date. */

import { DEMO_IDENTITIES } from "./accounts";
import { ROLE_TEMPLATES } from "./permissions";
import type {
  AuditEvent,
  FieldChange,
  Membership,
  MembershipRole,
  Organization,
  OrgPlan,
  OrgStatus,
  Role,
  Session,
  User,
  UserStatus,
  WorkspaceSettings,
} from "./types";

export const SCHEMA_VERSION = 3;

export interface Database {
  version: number;
  seededAt: string;
  users: User[];
  roles: Role[];
  organizations: Organization[];
  memberships: Membership[];
  sessions: Session[];
  audit: AuditEvent[];
  settings: WorkspaceSettings;
  currentSessionId: string;
}

/** mulberry32 — small, deterministic, and good enough for authored demo data. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = [
  "Mara", "Tobias", "Ravi", "Ines", "Kelvin", "Yara", "Dmitri", "Amara", "Sofia", "Noor",
  "Hendrik", "Priya", "Lucas", "Zainab", "Mateo", "Elif", "Anders", "Grace", "Idris", "Lena",
  "Tomas", "Ada", "Bruno", "Mei", "Oskar", "Farida", "Jonas", "Camila", "Viktor", "Aisha",
  "Petra", "Sami", "Nadia", "Emil", "Rosa", "Kaito", "Hanna", "Musa", "Clara", "Diego",
];

const LAST = [
  "Ilesanmi", "Brandt", "Krishnan", "Ferreira", "Osei", "Haddad", "Volkov", "Nwosu", "Marchetti",
  "Rahman", "de Vries", "Nair", "Beaumont", "Aziz", "Herrera", "Yilmaz", "Lindqvist", "Adeyemi",
  "Okonkwo", "Novak", "Silva", "Bergström", "Costa", "Zhang", "Kowalski", "Belkacem", "Fischer",
  "Duarte", "Petrov", "Mensah", "Schneider", "Karim", "Haugen", "Vargas", "Rossi", "Tanaka",
];

const ORG_POOL: { name: string; slug: string; plan: OrgPlan; status: OrgStatus }[] = [
  { name: "Aurora Freight", slug: "aurora-freight", plan: "enterprise", status: "active" },
  { name: "Kestrel Health", slug: "kestrel-health", plan: "growth", status: "active" },
  { name: "Meridian Analytics", slug: "meridian-analytics", plan: "growth", status: "active" },
  { name: "Northline Logistics", slug: "northline-logistics", plan: "starter", status: "trial" },
  { name: "Halcyon Ports", slug: "halcyon-ports", plan: "enterprise", status: "active" },
  { name: "Brightwater Co-op", slug: "brightwater-co-op", plan: "starter", status: "past_due" },
  { name: "Verity Public Works", slug: "verity-public-works", plan: "growth", status: "active" },
  { name: "Lantern Union", slug: "lantern-union", plan: "starter", status: "active" },
];

const DEVICES = ["MacBook Pro", "Dell Latitude 7440", "ThinkPad X1 Carbon", "iPhone 15", "Pixel 9", "iPad Air", "Windows Desktop"];
const BROWSERS = ["Chrome 141", "Safari 18", "Firefox 133", "Edge 141"];
const LOCATIONS = [
  "Hanoi, VN", "Ho Chi Minh City, VN", "Singapore, SG", "Helsinki, FI", "Berlin, DE", "Lagos, NG",
  "São Paulo, BR", "Bengaluru, IN", "Toronto, CA", "Warsaw, PL", "Cairo, EG", "Osaka, JP",
];

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

function pick<T>(r: () => number, list: T[]): T {
  return list[Math.floor(r() * list.length)]!;
}

function weightedStatus(r: () => number): UserStatus {
  const n = r();
  if (n < 0.7) return "active";
  if (n < 0.82) return "invited";
  if (n < 0.92) return "suspended";
  return "deactivated";
}

function ip(r: () => number): string {
  return `198.51.${Math.floor(r() * 200) + 10}.${Math.floor(r() * 240) + 5}`;
}

/** The four demo identities exist so every permission state is reachable without an admin
 *  ceremony: the seed always contains one account per system role. */
const DEMO = DEMO_IDENTITIES;

const ACTION_POOL: { action: string; targetType: AuditEvent["targetType"] }[] = [
  { action: "user.invited", targetType: "user" },
  { action: "user.updated", targetType: "user" },
  { action: "user.suspended", targetType: "user" },
  { action: "user.reactivated", targetType: "user" },
  { action: "user.role_changed", targetType: "user" },
  { action: "role.updated", targetType: "role" },
  { action: "role.created", targetType: "role" },
  { action: "organization.member_added", targetType: "organization" },
  { action: "organization.member_removed", targetType: "organization" },
  { action: "organization.updated", targetType: "organization" },
  { action: "session.revoked", targetType: "session" },
  { action: "settings.updated", targetType: "settings" },
];

export function seed(anchorMs: number): Database {
  const r = rng(20261007);
  const iso = (msAgo: number) => new Date(anchorMs - msAgo).toISOString();

  const roles: Role[] = ROLE_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    system: t.system,
    permissions: [...t.permissions],
    createdAt: iso(120 * DAY),
  }));

  const organizations: Organization[] = ORG_POOL.map((o, i) => ({
    id: `org_${String(i + 1).padStart(3, "0")}`,
    name: o.name,
    slug: o.slug,
    plan: o.plan,
    status: o.status,
    createdAt: iso((400 - i * 23) * DAY),
  }));

  const users: User[] = DEMO.map((d, i) => ({
    id: d.id,
    name: d.name,
    email: d.email,
    status: "active",
    roleIds: [d.roleId],
    orgIds: [organizations[i % organizations.length]!.id, organizations[(i + 3) % organizations.length]!.id],
    mfa: i !== 3,
    createdAt: iso((320 - i * 7) * DAY),
    lastActiveAt: iso((0.2 + i * 0.6) * HOUR),
  }));

  const used = new Set(users.map((u) => u.name));
  let seq = 0;
  while (users.length < 148) {
    const name = `${pick(r, FIRST)} ${pick(r, LAST)}`;
    if (used.has(name)) {
      seq += 1;
      if (seq > 400) break;
      continue;
    }
    used.add(name);
    seq += 1;
    const id = `usr_${String(users.length + 1).padStart(3, "0")}`;
    const status = weightedStatus(r);
    const rolePool = ["role_admin", "role_support", "role_viewer", "role_billing", "role_viewer", "role_support"];
    const roleIds = [pick(r, rolePool)];
    if (r() < 0.14) roleIds.push("role_support");
    const orgCount = 1 + Math.floor(r() * 3);
    const orgIds: string[] = [];
    for (let i = 0; i < orgCount; i += 1) {
      const org = pick(r, organizations).id;
      if (!orgIds.includes(org)) orgIds.push(org);
    }
    const email = `${name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "")}@panel.example`;
    users.push({
      id,
      name,
      email,
      status,
      roleIds,
      orgIds,
      mfa: r() < 0.62,
      createdAt: iso(Math.floor((5 + r() * 300) * DAY)),
      lastActiveAt: status === "active" && r() < 0.9 ? iso(Math.floor(r() * 14 * DAY)) : status === "invited" ? null : iso(Math.floor((20 + r() * 60) * DAY)),
    });
  }

  const memberships: Membership[] = [];
  for (const org of organizations) {
    const members = users.filter((u) => u.orgIds.includes(org.id));
    if (members.length === 0) continue; // an empty organization is a state the panel must survive
    members.forEach((u, idx) => {
      const memberRole: MembershipRole = idx === 0 ? "owner" : idx === 1 ? "admin" : "member";
      memberships.push({
        orgId: org.id,
        userId: u.id,
        memberRole,
        joinedAt: iso(Math.floor((30 + r() * 250) * DAY)),
      });
    });
  }

  const sessions: Session[] = [];
  const sessionUsers = users.filter((u) => u.status === "active").slice(0, 96);
  for (const u of sessionUsers) {
    const count = 1 + Math.floor(r() * 2);
    for (let i = 0; i < count; i += 1) {
      const started = Math.floor(r() * 9 * DAY);
      sessions.push({
        id: `ses_${String(sessions.length + 1).padStart(4, "0")}`,
        userId: u.id,
        device: pick(r, DEVICES),
        browser: pick(r, BROWSERS),
        location: pick(r, LOCATIONS),
        ip: ip(r),
        startedAt: iso(Math.max(started, 2 * HOUR)),
        lastSeenAt: iso(Math.floor(r() * 6 * HOUR)),
        current: false,
      });
    }
  }

  const audit: AuditEvent[] = [];
  const actors = users.filter((u) => u.status === "active");
  const targetUsers = users.filter((u) => u.status !== "invited" || r() < 0.3);
  for (let i = 0; i < 340; i += 1) {
    const { action, targetType } = pick(r, ACTION_POOL);
    const actor = pick(r, actors);
    let targetId = "";
    let targetLabel = "";
    const changes: FieldChange[] = [];

    if (targetType === "user") {
      const t = pick(r, targetUsers) ?? users[0]!;
      targetId = t.id;
      targetLabel = t.name;
      if (action === "user.updated") {
        changes.push({ field: "name", before: t.name, after: `${pick(r, FIRST)} ${pick(r, LAST)}` });
        changes.push({ field: "mfa", before: t.mfa ? "enabled" : "disabled", after: t.mfa ? "disabled" : "enabled" });
      }
      if (action === "user.suspended" || action === "user.reactivated" || action === "user.invited") {
        const before: UserStatus = action === "user.suspended" ? "active" : action === "user.reactivated" ? "suspended" : "—" as unknown as UserStatus;
        const after: UserStatus = action === "user.suspended" ? "suspended" : action === "user.reactivated" ? "active" : "invited";
        changes.push({ field: "status", before: action === "user.invited" ? null : before, after });
      }
      if (action === "user.role_changed") {
        changes.push({ field: "roles", before: t.roleIds.join(", "), after: pick(r, ["role_support", "role_viewer", "role_admin"]) });
      }
    } else if (targetType === "role") {
      const t = pick(r, roles);
      targetId = t.id;
      targetLabel = t.name;
      changes.push({
        field: "permissions",
        before: `${t.permissions.length} granted`,
        after: `${Math.max(1, t.permissions.length + (r() < 0.5 ? -1 : 1))} granted`,
      });
    } else if (targetType === "organization") {
      const t = pick(r, organizations);
      targetId = t.id;
      targetLabel = t.name;
      if (action === "organization.updated") {
        changes.push({ field: "plan", before: t.plan, after: pick(r, ["starter", "growth", "enterprise"]) });
      } else {
        const u = pick(r, users) ?? users[0]!;
        changes.push({ field: "member", before: null, after: u.name });
      }
    } else if (targetType === "session") {
      const s = pick(r, sessions);
      targetId = s.id;
      targetLabel = `${s.device} · ${s.location}`;
      changes.push({ field: "state", before: "active", after: "revoked" });
    } else {
      targetId = "workspace";
      targetLabel = "Workspace settings";
      changes.push({ field: "name", before: "Admin panel", after: "admin-panel" });
    }

    audit.push({
      id: `evt_${String(i + 1).padStart(4, "0")}`,
      at: iso(Math.floor(r() * 60 * DAY) + Math.floor(r() * 12 * HOUR)),
      actorId: actor.id,
      actorName: actor.name,
      action,
      targetType,
      targetId,
      targetLabel,
      ip: ip(r),
      changes,
    });
  }
  audit.sort((a, b) => (a.at < b.at ? 1 : -1));

  const settings: WorkspaceSettings = {
    name: "Admin panel",
    slug: "admin-panel",
    defaultUserStatus: "invited",
    defaultLanding: "dashboard",
  };

  return {
    version: SCHEMA_VERSION,
    seededAt: new Date(anchorMs).toISOString(),
    users,
    roles,
    organizations,
    memberships,
    sessions,
    audit,
    settings,
    currentSessionId: sessions[0]?.id ?? "ses_0001",
  };
}
