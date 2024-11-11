import React from "react";
import { Avatar } from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaCircleUser } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { api_client } from "@/lib/api-client";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await api_client.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate(`/auth`);
        setUserInfo(null);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="absolute bottom-0 flex justify-between items-center w-full h-16 px-4 bg-[#2a2b33]">
      <div className="flex justify-center items-center gap-3">
        <div className="relative h-8 w-8">
          <Avatar className="h-8 w-8 rounded-full overflow-hidden">
            {userInfo.image ? (
              <img
                src={`${userInfo.image}`}
                className="object-cover h-full w-full rounded-full"
              />
            ) : (
              <div className="uppercase text-xs font-bold h-8 w-8 rounded-full flex justify-center items-center bg-[#712a4c57] text-[#ff006e] border-[1px] border-[#ff006faa] cursor-pointer">
                {userInfo.first_name
                  ? userInfo.first_name.split("").slice(0, 2)
                  : userInfo.email.split("").slice(0, 2)}
              </div>
            )}
          </Avatar>
        </div>
        <div className="font-bold tracking-wide text-opacity-90 text-lg text-gray-400">
          {userInfo.first_name && userInfo.last_name
            ? `${userInfo.first_name} ${userInfo.last_name}`
            : ""}
        </div>
      </div>
      <div className="flex gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaCircleUser
                onClick={() => navigate(`/profile`)}
                className="text-green-500 text-xl"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaCircleXmark
                onClick={handleLogout}
                className="text-red-500 text-xl"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
