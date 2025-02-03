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
  } from "@/components/ui/navigation-menu"
  import { UserButton, useUser } from '@clerk/nextjs'
  import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect , useState } from "react"

  

const Nav = () => {
  return (
    <div  className="flex justify-between -600 py-4 px-10">
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
    <NavigationMenuItem>
      <Link href="/components/allorder">
        <Button>All Orders</Button>
      </Link>
    </NavigationMenuItem>
    </div>

  )
}

export default Nav