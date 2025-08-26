"use client";
import { useEffect, useState } from "react";
import { NavigationMenuItem } from "../../TEMP/ui/navigation-menu";
import { Button } from "../../TEMP/ui/button";
import Link from "next/link";
import { useAppState } from "../provider/AppStateProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Profile from '../profile/Profile'; // ✅ client component now

const Nav = () => {
  const { setIsChat, user, isAdmin, isProfile, setIsProfile } = useAppState();
  const [mounted, setMounted] = useState(false);

  // ✅ Prevent hydration mismatch (wait until client is ready)
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex justify-between py-4 px-10 items-center">
      {user && (
        <Avatar onClick={() => setIsProfile?.((prev) => !prev)} className="cursor-pointer">
          <AvatarImage src={process.env.NEXT_PUBLIC_DEFAULT_PROFILE_URL || "/default.png"} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}

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

      {user && (
        <NavigationMenuItem>
          <Button onClick={() => setIsChat?.((prev) => !prev)}>Chat</Button>
        </NavigationMenuItem>
      )}

      {!user && (
        <NavigationMenuItem>
          <Link href="/sign-in"><Button>Login</Button></Link>
        </NavigationMenuItem>
      )}
    </div>
  );
};

export default Nav;