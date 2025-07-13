import { ReactElement, ReactNode } from "react";

import { Header } from "@/components/Header";
import { Room, User } from "@/types";

interface PageLayoutProps {
  children: ReactNode;
  room?: Room;
  users?: User[];
}

export function PageLayout({
  children,
  room,
  users,
}: PageLayoutProps): ReactElement {
  return (
    <div className="h-screen flex flex-col">
      <Header room={room} users={users} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
