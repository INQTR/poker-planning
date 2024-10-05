import { FC, useState } from "react";

import { useEditUserMutation } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts";
import { useToast } from "@/hooks/use-toast";

interface EditUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const EditUserDialog: FC<EditUserDialogProps> = ({ open, setOpen }) => {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState("");

  const [editUserMutation, { loading }] = useEditUserMutation({
    onCompleted: (data) => {
      login?.({
        id: data.editUser.id,
        username: data.editUser.username,
      });
      setOpen(false);
      toast({
        title: "Your username has been updated",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update your username: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (user) {
      await editUserMutation({
        variables: {
          userId: user.id,
          username: username.trim(),
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter your username</DialogTitle>
          <DialogDescription>
            Enter your new username below. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
