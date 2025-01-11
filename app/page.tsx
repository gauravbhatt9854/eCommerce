"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import { useEffect } from "react";
import PayPage from "@/app/components/payment/page"
import CreateUser from './components/db/CreateUser';
import { auth } from '@clerk/nextjs/server';
import ProductsPage from "@/app/components/products/page";


export default function Home() {
  const { user } = useUser();
  return (
    <div className="h-screen w-screen p-10">
      {/* <PayPage></PayPage> */}
      {/* <CreateUser></CreateUser> */}
      {/* <ProductsPage></ProductsPage> */}
    </div>
  );
}
