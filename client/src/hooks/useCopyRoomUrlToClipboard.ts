import { useCallback, useMemo } from "react";

import { toast } from "@/lib/toast";
import { copyTextToClipboard } from "@/utils";

interface UseCopyRoomUrlReturn {
  copyRoomUrlToClipboard: (roomId: string) => Promise<void>;
}

export function useCopyRoomUrlToClipboard(): UseCopyRoomUrlReturn {
  const copyRoomUrlToClipboard = useCallback(async (roomId: string) => {
    const { origin } = window.location;
    const roomPath = `/room/${roomId}`;

    const isCopySuccess = await copyTextToClipboard(`${origin}${roomPath}`);

    if (isCopySuccess) {
      toast.success("Invite link copied to clipboard");
    } else {
      toast.error(
        "When copying an invite link something went wrong. But don't be discouraged, just copy it yourself from the browser.",
      );
    }
  }, []);

  return useMemo(() => ({ copyRoomUrlToClipboard }), [copyRoomUrlToClipboard]);
}
