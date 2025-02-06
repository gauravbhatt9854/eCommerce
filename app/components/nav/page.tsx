"use client"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../../TEMP/ui/navigation-menu"
import { UserButton } from '@clerk/nextjs'
import { Button } from "../..//TEMP/ui/button"
import Link from "next/link"
import { useAdmin } from "../provider/AdminProvider"
import { useSocket } from "../provider/SocketProvider"



const Nav = () => {
  const { setIsChat } = useSocket();
  const { isAdmin } = useAdmin();
  return (
    <div className="flex justify-between -600 py-4 px-10">
      <UserButton />
      <NavigationMenuItem>
        <Link href="/">
          <Button>Home</Button>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/components/products">
          <Button>Store</Button>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/components/myOrders">
          <Button>My Orders</Button>
        </Link>
      </NavigationMenuItem>

      {isAdmin && (<Link href="/components/allorder">
        <NavigationMenuItem>
          <Button>All Orders</Button>
        </NavigationMenuItem>
      </Link>)}

      {isAdmin && (<Link href="/components/tickets">
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