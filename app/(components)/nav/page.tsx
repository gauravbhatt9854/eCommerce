"use client"
import {
  NavigationMenuItem,
} from "../../TEMP/ui/navigation-menu"
import { UserButton } from '@clerk/nextjs'
import { Button } from "../../TEMP/ui/button"
import Link from "next/link"
import { useAppState } from "../provider/AppStateProvider"



const Nav = () => {
  const { setIsChat , user} = useAppState();
  if(!user){
    return null;
  }
  const { isAdmin } = useAppState();

  return (
    <div className="flex justify-between -600 py-4 px-10">
      <UserButton />
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