// Lottie :
import { Player } from "@lottiefiles/react-lottie-player";
import animationSource from "@/assets/animations/circular_animation.json";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-100 transition-all">
      <Player
        src={animationSource}
        className="player block p-3 h-[300px]"
        loop
        autoplay
      />
      <div className="text-center text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-4xl text-3xl transition-all duration-300">
        <h3 className="font-bold">
          <span className="text-5xl">🚀</span> Welcome to
          <span className="text-purple-500"> Synapses</span> Chat App
        </h3>
        <p className="text-xl lg:text-2xl text-gray-400 mt-2">
          Your conversations start here. Select a chat or start a new one to
          connect.
        </p>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
