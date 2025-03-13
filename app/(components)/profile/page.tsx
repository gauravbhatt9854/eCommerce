"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAppState } from "../provider/AppStateProvider";

const Profile = () => {

  const { user } = useAppState();
  const handleEditProfile = () => {
    console.log("Edit Profile Clicked");
    // Implement edit functionality
  };
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "GET" });
    window.location.href = "/sign-in"; // Redirect to login page
  };


  return (
    <div className="fixed top-[10%] left-0 w-[350px] h-auto bg-white shadow-lg rounded-lg border border-gray-300 p-4 z-10">
      <Card>
        <CardHeader className="flex flex-col items-center">
          <Image
            src={user?.profileUrl || "/default-avatar.png"} // Provide a fallback image
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full"
          />
          <CardTitle className="mt-2 text-xl">{user?.fullName}</CardTitle>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>DOB:</strong> {user?.dob || "not available"}
          </p>
          <p>
            <strong>Address:</strong> {user?.address || "not available"}
          </p>
        </CardContent>
        <div className="flex justify-between px-4 pb-4">
          <Button onClick={handleEditProfile} variant="outline">
            Edit Profile
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
