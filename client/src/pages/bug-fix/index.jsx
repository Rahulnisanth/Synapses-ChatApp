import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import animationFile from "@/assets/animations/debugging_animation.json";

const BugFix = () => {
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
            OOPS! Undertaking bug fixes
          </h3>
          <p className="text-lg md:text-2xl text-gray-400 mt-3">
            It looks like the site is fixing the bugs may be try again sometimes
          </p>
        </div>
      </div>
    </div>
  );
};

export default BugFix;
