import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvestorDashboard from "./InvestorDashboard";
import Login from "./Login";
import ResetPassword from "./ResetPassword";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(
      "https://6f529007-98e5-4fa4-ade7-bb402b3938de-00-303mdev3z3mre.kirk.replit.dev/auth/validate-token",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setLoggedIn(true);
          setUserInfo(data.user); // ✅ Store user info
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn && userInfo ? (
              <InvestorDashboard
                userInfo={userInfo}
                onLogout={() => setLoggedIn(false)}
              />
            ) : (
              <Login onLogin={() => setLoggedIn(true)} />
            )
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}
