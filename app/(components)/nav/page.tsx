"use client"
import {
  NavigationMenuItem,
} from "../../TEMP/ui/navigation-menu"
import { Button } from "../../TEMP/ui/button"
import Link from "next/link"
import { useAppState } from "../provider/AppStateProvider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Profile from "../profile/page"

const Nav = () => {
  const { setIsChat, user, isAdmin , isProfile , setIsProfile} = useAppState();
  if (!user) {
    return null;
  }

  return (
    <div className="flex justify-between -600 py-4 px-10">
        <Avatar onClick={() => setIsProfile((pre) => pre!=undefined &&  !pre)}>
          <AvatarImage src={user.profileUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {isProfile && <Profile />}
      <NavigationMenuItem>

        <Link href="/">
          <Button>Home</Button>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/products">
          <Button>Store</Button>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/myOrders">
          <Button>My Orders</Button>
        </Link>
      </NavigationMenuItem>

      {isAdmin && (<Link href="/allorder">
        <NavigationMenuItem>
          <Button>All Orders</Button>
        </NavigationMenuItem>
      </Link>)}

      {isAdmin && (<Link href="/tickets">
        <NavigationMenuItem>
          <Button>Support</Button>
        </NavigationMenuItem>
      </Link>)}

      <NavigationMenuItem>
        <Button onClick={() => setIsChat((pre) => !pre)}>Chat</Button>
      </NavigationMenuItem>
    </div>

  )
}

export default Nav