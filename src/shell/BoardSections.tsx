/** The section boards.
 *
 *  A record is a child route of the board it belongs to, so each section needs a component that renders
 *  the board and then its record child (see `screens/record-drawers.tsx`). They live here rather than
 *  inside `router.tsx` because that file declares routes and one exported router — a component defined
 *  there breaks fast refresh for every edit to the route tree.
 *
 *  Keeping the board mounted under its record is the point of the pattern: the operator keeps the list
 *  they were reading while the record is open. */

import type { ReactNode } from "react";
import { Outlet } from "@tanstack/react-router";
import { AuditListScreen } from "../screens/AuditListScreen";
import { OrganizationListScreen } from "../screens/OrganizationListScreen";
import { RoleListScreen } from "../screens/RoleListScreen";
import { UserListScreen } from "../screens/UserListScreen";

function BoardSection({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Outlet />
    </>
  );
}

export function UsersSection() {
  return (
    <BoardSection>
      <UserListScreen />
    </BoardSection>
  );
}

export function RolesSection() {
  return (
    <BoardSection>
      <RoleListScreen />
    </BoardSection>
  );
}

export function OrganizationsSection() {
  return (
    <BoardSection>
      <OrganizationListScreen />
    </BoardSection>
  );
}

export function AuditSection() {
  return (
    <BoardSection>
      <AuditListScreen />
    </BoardSection>
  );
}
