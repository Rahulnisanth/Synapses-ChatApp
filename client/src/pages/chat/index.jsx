import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profile_setup) {
      toast.error("Please setup the profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div>
      <h1>This is the chat page!</h1>
      <p>{userInfo.first_name}</p>
      <p>{userInfo.last_name}</p>
      <p>{userInfo.image}</p>
      <p>{userInfo.profile_setup}</p>
    </div>
  );
};

export default Chat;
