import Emoji from "@/assets/victory.svg";
import Abstract from "@/assets/login2.png";
import animationSource from "@/assets/animations/circular_animation.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { api_client } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
// Lottie :
import { Player } from "@lottiefiles/react-lottie-player";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validate_signup = () => {
    if (!email.trim().length) {
      toast.error("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      toast.error("Password is required.");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password should be at least 8 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be the same.");
      return false;
    }
    return true;
  };

  const validate_login = () => {
    if (!email.trim().length) {
      toast.error("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const handle_login = async () => {
    if (validate_login()) {
      try {
        const response = await api_client.post(
          LOGIN_ROUTE,
          { email: email.trim(), password },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setUserInfo(response.data.user);
          toast.success("Login successful!");

          // Navigate based on user profile setup
          if (response.data.user.profile_setup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (error) {
        console.error("Login error:", error.response || error.message);

        if (error.response && error.response.data) {
          toast.error(
            error.response.data.message || "Login failed. Please try again."
          );
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  const handle_signup = async () => {
    if (validate_signup()) {
      try {
        const response = await api_client.post(
          SIGNUP_ROUTE,
          {
            email: email.trim(),
            password,
          },
          {
            withCredentials: true,
          }
        );
        setUserInfo(response.data.user);
        toast.success("Signup successful! Welcome.");
      } catch (error) {
        console.error("Signup error:", error.response || error.message);
        if (error.response && error.response.data) {
          toast.error(
            error.response.data.message || "Signup failed. Please try again."
          );
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1b1c24] flex justify-center items-center">
      <div className="min-h-[80vh] bg-[#1b1c24] border-2 border-[#1b1c24] text-white/90 md:shadow-2xl w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl flex flex-col-reverse xl:flex-row">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center md:ml-4">
            <div className="flex items-center justify-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ml-4">
                Welcome
              </h1>
              <img
                src={Emoji}
                alt="Emoji"
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32"
              />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with Synapses
            </p>
          </div>

          {/* Tabs for Login and Signup */}
          <div className="flex items-center justify-center w-full mt-10">
            <Tabs defaultValue="login" className="w-full md:w-3/4">
              <TabsList className="w-full bg-transparent rounded-none">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-white/90 border-b-2 rounded-none w-full data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-white/90 border-b-2 rounded-none w-full data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-purple-500 p-3 transition-all duration-300"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              {/* Login Tab Content */}
              <TabsContent
                className="flex flex-col items-center justify-center gap-5 mt-10"
                value="login"
              >
                <Input
                  className="rounded-lg text-white p-4 sm:p-6 bg-[#2c2e3b] border-none"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  className="rounded-lg text-white p-4 sm:p-6 bg-[#2c2e3b] border-none"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="mt-4 w-full rounded-lg p-4 sm:p-6 text-white bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                  onClick={() => handle_login()}
                >
                  Login
                </Button>
              </TabsContent>

              {/* Signup Tab Content */}
              <TabsContent
                className="flex flex-col items-center justify-center gap-5"
                value="signup"
              >
                <Input
                  className="rounded-lg text-white p-4 sm:p-6 bg-[#2c2e3b] border-none"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  className="rounded-lg text-white p-4 sm:p-6 bg-[#2c2e3b] border-none"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  className="rounded-lg text-white p-4 sm:p-6 bg-[#2c2e3b] border-none"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="mt-4 w-full rounded-lg p-4 sm:p-6 text-white bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                  onClick={() => handle_signup()}
                >
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Image on Larger Screens */}
        <div className="hidden xl:flex items-center justify-center">
          <img
            src={Abstract}
            className="h-[500px] md:h-[600px] xl:h-[650px] mix-blend-mode multiply"
            alt="Authentication Abstract"
          />
        </div>

        {/* Animation on Small Screens */}
        <Player
          src={animationSource}
          className="player block p-3 sm:order-1 h-[300px] md:hidden"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default Auth;
