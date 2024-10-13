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

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  console.log("User Info in PrivateRoute:", userInfo);
  return userInfo ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  console.log("User Info in AuthRoute:", userInfo);
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
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return;
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
