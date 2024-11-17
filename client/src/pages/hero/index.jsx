import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import animationSource from "@/assets/animations/circular_animation.json";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#1c1d25] flex justify-center items-center">
      <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-100 transition-all rounded-lg p-6">
        <Player
          src={animationSource}
          className="player block p-3 h-[300px] md:h-[350px]"
          loop
          autoplay
        />
        <div className="text-center p-5 flex flex-col items-center lg:text-4xl transition-all duration-300">
          <h3 className="font-bold text-3xl md:text-5xl text-white">
            Welcome to
            <span className="text-purple-500"> Synapses</span> Chat App
          </h3>
          <p className="text-lg md:text-2xl text-gray-400 mt-3">
            Where conversations spark connections. Dive into your chats today!
          </p>
          <Button
            onClick={() => navigate("/chat")}
            className="mt-8 w-[60%] md:w-[40%] rounded-full py-3 text-white text-lg bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          >
            <p className="font-semibold">Get Started</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
