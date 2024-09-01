import Emoji from "@/assets/victory.svg";
import Abstract from "@/assets/login2.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
    console.log("login invoked!");
  };
  const handleSignup = async () => {
    console.log("signup invoked!");
  };

  return (
    <div className="h-[90vh] flex justify-center items-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Emoji} alt="Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full mt-10">
            <Tabs className="w-3/4">
              <TabsList
                default="login"
                className="w-full bg-transparent rounded-none"
              >
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
                  className="w-full rounded-full p-6"
                  onClick={() => handleLogin()}
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
                  className="w-full rounded-full p-6"
                  onClick={() => handleSignup()}
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
