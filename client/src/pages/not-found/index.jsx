/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import animationFile from "@/assets/animations/404_animation.json";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#1c1d25] flex justify-center items-center">
      <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-100 transition-all rounded-lg p-6">
        <Player
          src={animationFile}
          className="player block h-[300px] md:h-[350px]"
          loop
          autoplay
        />
        <div className="text-center p-5 flex flex-col items-center lg:text-4xl transition-all duration-300">
          <h3 className="font-bold text-3xl md:text-5xl text-white">
            Oops! Page Not Found
          </h3>
          <p className="text-lg md:text-2xl text-gray-400 mt-3">
            It looks like the page you're looking for doesn't exist. Let's get
            you back on track!
          </p>
          <Button
            onClick={() => navigate("/")}
            className="mt-8 w-[60%] md:w-[40%] rounded-full py-3 text-white text-lg bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          >
            <p className="font-semibold">Go Home</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
