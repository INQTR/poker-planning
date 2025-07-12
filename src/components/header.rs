// import { Link } from "@tanstack/react-router";
// import { Copy } from "lucide-react";
// import { FC } from "react";

// import { AccountMenu } from "@/components/AccountMenu";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useAuth } from "@/contexts";
// import { useCopyRoomUrlToClipboard } from "@/hooks";
// import { Room, User } from "@/types";

// interface HeaderProps {
//   room?: Room;
//   users?: User[];
// }

// export const Header: FC<HeaderProps> = ({ room, users }) => {
//   const { user } = useAuth();
//   const { copyRoomUrlToClipboard } = useCopyRoomUrlToClipboard();

//   const handleCopyRoomUrl = async () => {
//     if (room) {
//       await copyRoomUrlToClipboard(room.id);
//     }
//   };

//   return (
//     <header className="flex justify-between items-center h-14 px-4 border-b">
//       <div className="flex items-center space-x-4">
//         <Link to="/" className="text-lg font-semibold flex items-center">
//           <img
//             src="/logo.svg"
//             alt="PokerPlanning.org Logo"
//             className="h-8 w-8 mr-2"
//           />
//           <span className="hidden md:block">Planning poker</span>
//         </Link>
//         {room && (
//           <>
//             <Separator orientation="vertical" className="h-6" />
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="ghost" size="icon" onClick={handleCopyRoomUrl}>
//                   <Copy className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Copy room link</p>
//               </TooltipContent>
//             </Tooltip>
//           </>
//         )}
//       </div>
//       {user && (
//         <div className="flex items-center space-x-4">
//           {users && (
//             <div className="flex items-center space-x-4 invisible md:visible">
//               <div className="flex -space-x-2">
//                 {users.slice(0, 5).map((user) => (
//                   <Tooltip key={user.id}>
//                     <TooltipTrigger asChild>
//                       <Avatar
//                         key={user.id}
//                         className="border-2 border-background"
//                       >
//                         <AvatarFallback>
//                           {user.username[0].toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>{user.username}</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 ))}
//                 {users.length > 5 && (
//                   <Avatar className="border-2 border-background">
//                     <AvatarFallback>+{users.length - 5}</AvatarFallback>
//                   </Avatar>
//                 )}
//               </div>
//               <Separator orientation="vertical" className="h-6" />
//             </div>
//           )}
//           <AccountMenu />
//         </div>
//       )}
//     </header>
//   );
// };

use leptos::prelude::*;
use crate::domain::room::Room;

#[component]
pub fn Header(_room: Option<Room>) -> impl IntoView {
    view! {
        <header class="flex justify-between items-center h-14 px-4 border-b">
            <div class="flex items-center space-x-4">
                <a href="/" class="text-lg font-semibold flex items-center">
                    <img src="/logo.svg" alt="PokerPlanning.org Logo" class="h-8 w-8 mr-2" />
                    <span class="hidden md:block">Planning poker</span>
                </a>
            </div>
        </header>
    }
}
