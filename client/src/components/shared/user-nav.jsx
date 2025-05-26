import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/features/api/auth";
import { userHasLoggedOut } from "@/features/auth/slice";
import { User, Settings, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function UserNav({ user }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [logout] = useLogoutMutation()

    async function handleLogout() {
      try {
        await logout().unwrap();
        dispatch(userHasLoggedOut());
        window.location.reload();
      } catch(err) {
        console.error(err);
      }
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={`${user?.firstName}'s avatar`} />
            <AvatarFallback className="bg-[#0000000A] text-[#000000DE] font-medium">
              {user?.firstName[0]}
              {user?.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-white border-[#0000001A]" 
        align="end" 
        forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-[#000000DE]">{user?.firstName}</p>
            <p className="text-xs leading-none text-[#00000099]">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#0000001A]" />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onSelect={() => navigate("/me")}
            className="hover:bg-[#0000000A] focus:bg-[#0000000A] cursor-pointer text-[#00000099] hover:text-[#000000DE]">
            <User className="mr-2 h-4 w-4" />
            Profile
            <DropdownMenuShortcut className="text-[#00000099]">⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => navigate("/me/preferences")}
            className="hover:bg-[#0000000A] focus:bg-[#0000000A] cursor-pointer text-[#00000099] hover:text-[#000000DE]">
            <Settings className="mr-2 h-4 w-4" />
            Preferences
            <DropdownMenuShortcut className="text-[#00000099]">⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-[#0000001A]" />
        <DropdownMenuItem 
          onSelect={handleLogout}
          className="hover:bg-[#0000000A] focus:bg-[#0000000A] cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
          <DropdownMenuShortcut className="text-[#00000099]">⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
