"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppState } from "../provider/AppStateProvider";

const Profile = () => {
  const { user, setUser } = useAppState();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [updatedUser, setUpdatedUser] = useState({
    userId: user?.id || "",
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });

  // ✅ Keep updatedUser in sync with context user
  useEffect(() => {
    if (user) {
      setUpdatedUser({
        userId: user.id || "",
        fullName: user.fullName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleEditProfile = async () => {
    if (editing) {
      setLoading(true);
      try {
        const response = await fetch("/api/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        });
        const data = await response.json();
        if (response.ok) {
          setUser((prev) => ({ ...prev, ...data }));
          setEditing(false);
        } else {
          alert("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
      setLoading(false);
    } else {
      setEditing(true);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "GET" });
    setUser(() => null);
    router.push("/sign-in");
  };

  return (
    <div className="fixed top-[10%] left-0 w-[350px] h-auto bg-white shadow-lg rounded-lg border border-gray-300 p-4 z-10">
      <Card>
        <CardHeader className="flex flex-col items-center">
          <Image
            src={user?.profileUrl || "/OIP.jpg"}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full"
          />
          {editing ? (
            <Input
              value={updatedUser.fullName}
              onChange={(e) => setUpdatedUser({ ...updatedUser, fullName: e.target.value })}
              className="mt-2 text-center"
            />
          ) : (
            <CardTitle className="mt-2 text-xl">{user?.fullName}</CardTitle>
          )}
          <p className="text-sm text-gray-500">{user?.role}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Email:</strong> {user?.email || "not available"}
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            {editing ? (
              <Input
                value={updatedUser.phone}
                onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
              />
            ) : (
              user?.phone || "not available"
            )}
          </p>
        </CardContent>
        <div className="flex justify-between px-4 pb-4">
          <Button onClick={handleEditProfile} variant="outline" disabled={loading}>
            {editing ? "Save" : "Edit Profile"}
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