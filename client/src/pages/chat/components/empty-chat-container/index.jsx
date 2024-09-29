// Lottie :
import { Player } from "@lottiefiles/react-lottie-player";
import animationSource from "@/assets/lottie_animation.json";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-100 transition-all">
      <Player
        src={animationSource}
        className="player block p-3 h-[300px]"
        loop
        autoplay
      />
      <div className="text-center text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300">
        <h3 className="font-bold">
          <span>👋</span> Welcome to
          <span className="text-purple-500"> Synapsex</span> Chat App.
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
