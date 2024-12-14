import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import { api_client } from "./lib/api-client";
import { USER_INFO_ROUTE } from "./utils/constants";
import Hero from "./pages/hero";
import NotFound from "./pages/not-found";
import { ScaleLoader } from "react-spinners";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await api_client.get(USER_INFO_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setUserInfo(undefined);
      } finally {
        setTimeout(() => setLoading(false), 3000);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setTimeout(() => setLoading(false), 3000);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return (
      <div className="flex bg-[#1c1d25] items-center justify-center h-screen">
        <ScaleLoader color="#6b46c1" size={250} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Hero />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
