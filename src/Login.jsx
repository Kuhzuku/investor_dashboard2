import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://6f529007-98e5-4fa4-ade7-bb402b3938de-00-303mdev3z3mre.kirk.replit.dev/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        onLogin(); // Redirect or update state
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Login error");
      console.error(err);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const response = await fetch(
        "https://6f529007-98e5-4fa4-ade7-bb402b3938de-00-303mdev3z3mre.kirk.replit.dev/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        setResetMessage("✅ Reset link sent! Check the console.");
      } else {
        setResetMessage(data.message || "❌ Error sending reset link");
      }
    } catch (err) {
      setResetMessage("❌ Network error");
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Admin Login
      </Typography>
      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button onClick={handleLogin} variant="contained" fullWidth>
        Log In
      </Button>

      <Box sx={{ mt: 2 }}>
        <Button variant="text" onClick={() => setShowReset(!showReset)}>
          Forgot Password?
        </Button>
      </Box>

      {showReset && (
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Your Email"
            fullWidth
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button variant="outlined" fullWidth onClick={handlePasswordReset}>
            Send Reset Link
          </Button>
          {resetMessage && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {resetMessage}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
