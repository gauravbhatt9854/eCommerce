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
  const { setIsChat, user, isAdmin , isProfile , setIsProfile } = useAppState();

  if (!user) return null;

  return (
    <div className="flex justify-between -600 py-4 px-10">
      <Avatar onClick={() => setIsProfile?.(prev => !prev)}>
        <AvatarImage src={process.env.NEXT_PUBLIC_DEFAULT_PROFILE_URL} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {isProfile && <Profile />}

      <NavigationMenuItem>
        <Link href="/"><Button>Home</Button></Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/products"><Button>Store</Button></Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/myOrders"><Button>My Orders</Button></Link>
      </NavigationMenuItem>

      {isAdmin && (
        <Link href="/allorder">
          <NavigationMenuItem><Button>All Orders</Button></NavigationMenuItem>
        </Link>
      )}

      {isAdmin && (
        <Link href="/tickets">
          <NavigationMenuItem><Button>Support</Button></NavigationMenuItem>
        </Link>
      )}

      {!isAdmin && (
        <Link href="/support">
          <NavigationMenuItem><Button>Support Contact</Button></NavigationMenuItem>
        </Link>
      )}

      <NavigationMenuItem>
        <Button onClick={() => setIsChat?.(prev => !prev)}>Chat</Button>
      </NavigationMenuItem>
    </div>
  )
}

export default Nav