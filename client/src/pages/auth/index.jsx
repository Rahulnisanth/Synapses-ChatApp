import Emoji from "@/assets/victory.svg";
import Abstract from "@/assets/login2.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { api_client } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validate_signup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password) {
      toast.error("Password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.");
      return false;
    }
    return true;
  };

  const validate_login = () => {
    if (!email.length) {
      toast.error("Email is required.");
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
      const response = await api_client.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 201) {
        navigate("/profile");
      }
      console.log(response);
    }
  };

  const handle_signup = async () => {
    if (validate_signup()) {
      const response = await api_client.post(SIGNUP_ROUTE, { email, password });
      console.log(response);
    }
  };

  return (
    <div className="h-[90vh] flex justify-center items-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center md:ml-4">
            <div className="flex items-center justify-center">
              <h1 className="text-4xl ml-4 font-bold sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome
              </h1>
              <img
                src={Emoji}
                alt="Emoji"
                className="w-24 h-24 md:w-32 md:h-32"
              />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full mt-10">
            <Tabs defaultValue="login" className="w-3/4">
              <TabsList className="w-full bg-transparent rounded-none">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-purple-500 p-3 duration-300 transition-all"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-purple-500 p-3 duration-300 transition-all"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent
                className="flex flex-col items-center justify-center gap-5 mt-10"
                value="login"
              >
                <Input
                  className="rounded-full p-6"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  className="rounded-full p-6"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="mt-4 w-full rounded-full p-6"
                  onClick={() => handle_login()}
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent
                className="flex flex-col items-center justify-center gap-5"
                value="signup"
              >
                <Input
                  className="rounded-full p-6"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  className="rounded-full p-6"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  className="rounded-full p-6"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="mt-4 w-full rounded-full p-6"
                  onClick={() => handle_signup()}
                >
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex items-center justify-center">
          <img
            src={Abstract}
            className="h-[650px]"
            alt="Authentication Abstract"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
