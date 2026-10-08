/** The record drawers: a record address becomes a drawer over the board it belongs to.
 *
 *  The trial's third change. The incumbent shell navigates away from a list to show one record, which
 *  costs the operator the board they were reading. Here the section board stays mounted and the record
 *  rises from the bottom edge, so the row, its neighbours and the record are on screen at once — the
 *  whole reason the pattern exists.
 *
 *  Each drawer owns one thing the incumbent record page could not: the user record's audit spine, the
 *  events that touched it, weighted by the time between them. The other three records carry their own
 *  screen as-is; they have no per-record event list in the mock layer, so they grow a spine the day
 *  there is one rather than showing a decorative empty region. */

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AuditSpine, BottomDrawer, StatusMagnet } from "../components/ui";
import { getAuditEvent, getOrganization, getRole, getUser } from "../mock/api";
import { AuditDetailScreen } from "./AuditDetailScreen";
import { OrganizationDetailScreen } from "./OrganizationDetailScreen";
import { RoleDetailScreen } from "./RoleDetailScreen";
import { UserDetailScreen } from "./UserDetailScreen";

export function UserRecordDrawer({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ["user", userId], queryFn: () => getUser(userId) });
  const user = data?.user;

  return (
    <BottomDrawer
      open
      onClose={() => void navigate({ to: "/users" })}
      title={user ? user.name : "User record"}
      meta={
        user ? (
          <>
            <span className="font-mono">{user.email}</span>
            <span className="ml-2 align-middle">
              <StatusMagnet status={user.status} />
            </span>
          </>
        ) : undefined
      }
      spine={data ? <AuditSpine events={data.activity} /> : undefined}
    >
      <UserDetailScreen userId={userId} embedded />
    </BottomDrawer>
  );
}

export function RoleRecordDrawer({ roleId }: { roleId: string }) {
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ["role", roleId], queryFn: () => getRole(roleId) });
  const role = data?.role;

  return (
    <BottomDrawer
      open
      headless
      padded={false}
      onClose={() => void navigate({ to: "/roles" })}
      title={role ? `Role: ${role.name}` : "Role record"}
    >
      <RoleDetailScreen roleId={roleId} />
    </BottomDrawer>
  );
}

export function OrganizationRecordDrawer({ orgId }: { orgId: string }) {
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ["organization", orgId], queryFn: () => getOrganization(orgId) });
  const organization = data?.organization;

  return (
    <BottomDrawer
      open
      headless
      padded={false}
      onClose={() => void navigate({ to: "/organizations" })}
      title={organization ? `Organization: ${organization.name}` : "Organization record"}
    >
      <OrganizationDetailScreen orgId={orgId} />
    </BottomDrawer>
  );
}

export function AuditEventRecordDrawer({ eventId }: { eventId: string }) {
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ["auditEvent", eventId], queryFn: () => getAuditEvent(eventId) });

  return (
    <BottomDrawer
      open
      headless
      padded={false}
      onClose={() => void navigate({ to: "/audit" })}
      title={data ? `Event: ${data.action}` : "Audit event"}
    >
      <AuditDetailScreen eventId={eventId} />
    </BottomDrawer>
  );
}
