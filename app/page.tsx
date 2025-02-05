"use client"
import { useUser } from '@clerk/nextjs'
import HomePage from './components/home/page';

export default function Home() {
  const { user } = useUser();

  return (
      <div className="h-screen w-screen p-10">
        <HomePage />
      </div>
  );
}
