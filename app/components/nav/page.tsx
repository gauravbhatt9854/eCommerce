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

  

const Nav = () => {
  return (
    <div  className="flex justify-between border-2 border-red-600 p-4">
    <NavigationMenuItem>
      <UserButton />
    </NavigationMenuItem>
    <NavigationMenuItem>
      <Link href="/">
        <Button>Home</Button>
      </Link>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <Link href="/components/products">
        <Button>Products</Button>
      </Link>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <Link href="/admin/product">
        <Button>Add Product</Button>
      </Link>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <Link href="/components/myOrders">
        <Button>MY Order</Button>
      </Link>
    </NavigationMenuItem>
    <NavigationMenuItem >
      <Link href="/sign-in">
        <Button>Sign</Button>
      </Link>
    </NavigationMenuItem>
    </div>

  )
}

export default Nav