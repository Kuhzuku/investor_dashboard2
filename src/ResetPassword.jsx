
import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://6f529007-98e5-4fa4-ade7-bb402b3938de-00-303mdev3z3mre.kirk.replit.dev/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) setSuccess(true);
      else setError(data.message || "Something went wrong");
    } catch (err) {
      setError("Request failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Reset Password</h2>
      {success ? (
        <p>✅ Password updated successfully!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: 10, marginBottom: 10 }}
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
