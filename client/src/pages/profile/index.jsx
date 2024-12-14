import { useAppStore } from "@/store";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { FaTrash, FaPlus } from "react-icons/fa";
import { BsArrowUpLeftSquareFill } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api_client } from "@/lib/api-client";
import {
  UPDATE_USER_INFO_ROUTE,
  ADD_PROFILE_IMAGE_ROUTE,
  DELETE_PROFILE_IMAGE_ROUTE,
} from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState(userInfo.first_name || "");
  const [lastName, setLastName] = useState(userInfo.last_name || "");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleNavigate = () => {
    if (userInfo.profile_setup) {
      navigate("/chat");
    } else {
      toast.error("Please set up the profile to continue.");
    }
  };

  const validateProfile = () => {
    if (!firstName || !lastName) {
      toast.error("One or more fields are empty.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      setLoading(true);
      try {
        const response = await api_client.post(
          UPDATE_USER_INFO_ROUTE,
          { first_name: firstName, last_name: lastName },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to save changes. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Preview the image immediately
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);

      // Upload the image to the server
      const formData = new FormData();
      formData.append("profile-image", file);

      // Log each entry in formData to verify contents
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        const response = await api_client.post(
          ADD_PROFILE_IMAGE_ROUTE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.image) {
          setUserInfo({ ...userInfo, image: response.data.image });
          toast.success("Profile image added successfully.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to upload profile image.");
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      const response = await api_client.delete(DELETE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        setImage(null);
        toast.success("Profile image deleted successfully.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete profile image.");
    }
  };

  useEffect(() => {
    if (userInfo.image) {
      setImage(`${userInfo.image}`);
    }
  }, [userInfo]);

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex flex-col justify-center items-center gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <BsArrowUpLeftSquareFill
            onClick={handleNavigate}
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
            aria-label="Back to chat"
          />
        </div>
        <div className="grid grid-cols-2 justify-center items-center">
          <div
            className="h-32 w-32 md:w-48 md:h-48 relative flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="object-cover h-full w-full rounded-full"
                />
              ) : (
                <div className="uppercase text-5xl font-bold h-32 w-32 md:h-48 md:w-48 rounded-full flex justify-center items-center bg-[#712a4c57] text-[#ff006e] border-[1px] border-[#ff006faa]">
                  {firstName
                    ? firstName.slice(0, 2)
                    : userInfo.email.slice(0, 2)}
                </div>
              )}
            </Avatar>

            {hovered && (
              <div
                className="absolute inset-0 flex bg-black/50 border-[1px] border-white justify-center items-center rounded-full cursor-pointer"
                onClick={image ? handleImageDelete : handleFileInputClick}
                aria-label={
                  image ? "Delete Profile Image" : "Add Profile Image"
                }
              >
                {image ? (
                  <FaTrash className="text-white text-3xl" />
                ) : (
                  <FaPlus className="text-white text-3xl" />
                )}
              </div>
            )}

            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              ref={fileInputRef}
              name="profile-image"
              accept=".png,.jpg,.jpeg,.svg,.webp"
            />
          </div>

          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg text-white p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg text-white p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg text-white p-6 bg-[#2c2e3b] border-none"
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className={`h-16 w-full text-white bg-purple-700 hover:bg-purple-900 transition-all duration-300 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            onClick={saveChanges}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
