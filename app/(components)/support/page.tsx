"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Github, MapPin } from "lucide-react";
import Image from "next/image";

export default function SupportPage() {
  const handleLinkedInClick = () => {
    window.open("https://www.linkedin.com/in/golubhattuk01", "_blank");
  };


  const handleGithubClick = () => {
    window.open("https://github.com/golubhattuk01", "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl bg-white p-6">
        <div className="flex flex-col items-center">
          <Image
            src="https://golu.codes/static/media/HeroImage.d2fd600e58540e8e5da1.jpg"
            alt="Gaurav Bhatt"
            width={100}
            height={100}
            className="rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Gaurav Bhatt</h2>
          <p className="text-center text-gray-600 mb-6">Full-Stack Developer | Tech Enthusiast</p>
        </div>
        <CardContent className="space-y-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Connect with me</h3>
          <div className="flex justify-center space-x-4 mt-3">
            <button className="flex items-center text-gray-600 hover:text-blue-600" onClick={handleLinkedInClick}>
              <Linkedin className="mr-2" /> LinkedIn
            </button>

            <button className="flex items-center text-gray-600 hover:text-blue-600" onClick={handleGithubClick}>
              <Github className="mr-2" /> GitHub
            </button>
          </div>
          <p className="flex items-center justify-center text-gray-600 mt-4">
            <MapPin className="mr-2" /> Almora, Uttarakhand, India
          </p>
        </CardContent>
      </Card>
    </div>
  );
}