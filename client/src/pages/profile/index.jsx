import { useAppStore } from "@/store";

const Profile = () => {
  const { userInfo } = useAppStore();
  return (
    <div>
      <h1>This is the profile-setup page</h1>
      <p>Email:{userInfo.email}</p>
    </div>
  );
};

export default Profile;
