import { LogOut, Settings } from "lucide-react";
import { ReactElement, useState } from "react";

import { useLogoutMutation } from "@/api";
import { EditUserDialog } from "@/components/EditUserDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts";
import { toast } from "@/lib/toast";

export function AccountMenu(): ReactElement {
  const { user, logout } = useAuth();
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const [logoutMutation] = useLogoutMutation({
    onCompleted() {
      logout?.();
    },
    onError: (error) => {
      toast.error(`Logout: ${error.message}`);
    },
  });

  function handleLogout() {
    if (user) {
      logoutMutation({
        variables: {
          userId: user.id,
        },
      });
    }
  }

  function handleOpenEditUserDialog() {
    setOpenEditUserDialog(true);
  }

  return (
    <>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full"
              aria-label="Account menu"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.username}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleOpenEditUserDialog}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Change username</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <EditUserDialog
        open={openEditUserDialog}
        setOpen={setOpenEditUserDialog}
      />
    </>
  );
}
