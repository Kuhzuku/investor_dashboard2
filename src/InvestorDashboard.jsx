// 🌟 Reframed Investor Dashboard — Styled to Match Your Brand
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// ✅ Add this custom overlay FIRST
const SyncOverlay = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#000",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography
      sx={{
        fontSize: "3rem",
        fontWeight: 800,
        background: "linear-gradient(to right, #c084fc, #ffffff, #5eead4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        mb: 4,
      }}
    >
      reFrame
    </Typography>

    <Box
      sx={{
        width: "48px",
        height: "48px",
        border: "4px solid #999",
        borderTop: "4px solid #fff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />

    {/* 🔧 Define the keyframes animation directly in a <style> tag */}
    <style>
      {`@keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }`}
    </style>
  </Box>
);

//added temp
const CustomXAxisTick = ({ x, y, payload }) => {
  const fullText = payload.value;
  const shortText =
    fullText.length > 25 ? fullText.slice(0, 25) + "..." : fullText;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dy={16}
        textAnchor="end"
        transform="rotate(-30)"
        fontSize={12}
        fill="#333"
      >
        <title>{fullText}</title>
        {shortText}
      </text>
    </g>
  );
};

export default function InvestorDashboard({ userInfo, onLogout }) {
  console.log("🧠 userInfo from props:", userInfo); // 👈 ADD THIS LINE

  const [report, setReport] = useState(null);
  const [topCount, setTopCount] = useState(5);
  const [weekOffset, setWeekOffset] = useState(0);

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncError, setSyncError] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage("");
    setSyncError(false);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://6f529007-98e5-4fa4-ade7-bb402b3938de-00-303mdev3z3mre.kirk.replit.dev/sync-chatbot",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSyncMessage(data.message || "✅ Sync complete!");
        fetchReport();
      } else {
        setSyncError(true);
        setSyncMessage(data.message || "❌ Sync failed");
      }
    } catch (err) {
      setSyncError(true);
      setSyncMessage("❌ Network error");
    }

    setSyncing(false);
  };

  const fetchReport = () => {
    const token = localStorage.getItem("token");

    fetch(
      "https://6f529007-98e5-4fa4-ade7-bb402b3938de-00-303mdev3z3mre.kirk.replit.dev/generate-report-nlp",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => setReport(data.reportData))
      .catch((err) => console.error("❌ Report fetch error:", err));
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const navigate = useNavigate();

  const handleDownload = () => {
    window.open(
      "https://6f529007-98e5-4fa4-ade7-bb402b3938de-00-303mdev3z3mre.kirk.replit.dev/download-report-csv",
      "_blank",
    );
  };

  if (!report) {
    return <div style={{ padding: "1rem" }}>Loading report...</div>;
  }

  if (
    report.topQuestions?.length === 0 &&
    report.highIntentInvestors?.length === 0 &&
    Object.keys(report.engagementTrends || {}).length === 0
  ) {
    return (
      <Box sx={{ padding: 6 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          📭 No Investor Data Yet
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          This dashboard is connected to a chatbot, but we haven’t received any
          investor messages yet.
        </Typography>
        <Typography variant="body2">
          Try clicking the 🔁 Sync Now button above — or wait for investors to
          interact with the bot.
        </Typography>
      </Box>
    );
  }

  const topQuestions = report.topQuestions.slice(0, topCount);

  const trendData = Object.entries(report.engagementTrends)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const weeks = [];
  for (let i = 0; i < trendData.length; i += 7) {
    weeks.push(trendData.slice(i, i + 7));
  }
  const currentWeek = weeks[weekOffset] || [];

  return (
    <Box
      sx={{
        padding: 6,
        backgroundColor: "#fff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {syncing && <SyncOverlay />}

      <Typography
        variant="h3"
        sx={{
          mb: 4,
          fontWeight: 700,
          background:
            "linear-gradient(to right, #333, #7157db, #9680ff, #7157db, #333)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        📊 Investor Intelligence Dashboard
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2">
          Logged in as: <strong>{userInfo?.email}</strong>
        </Typography>
        <Typography variant="subtitle2">
          Company: <strong>{userInfo?.company}</strong>
        </Typography>
      </Box>

      <Box
        className="card"
        sx={{
          mb: 6,
          borderRadius: "1.5rem",
          p: 4,
          boxShadow: "0 10px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Top Investor Questions
          </Typography>
          <FormControl size="small" sx={{ width: 120 }}>
            <InputLabel id="top-select-label">Show</InputLabel>
            <Select
              labelId="top-select-label"
              value={topCount}
              label="Show"
              onChange={(e) => setTopCount(Number(e.target.value))}
            >
              <MenuItem value={5}>Top 5</MenuItem>
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={report.topQuestions.length}>All</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={topQuestions}
            margin={{ top: 10, right: 30, left: 20, bottom: 80 }}
          >
            <XAxis
              dataKey="question"
              interval={0}
              tick={({ x, y, payload }) => {
                const fullText = payload.value;
                const shortText =
                  fullText.length > 25
                    ? fullText.slice(0, 25) + "..."
                    : fullText;

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      dy={16}
                      textAnchor="end"
                      transform="rotate(-30)"
                      fontSize={12}
                      fill="#333"
                    >
                      <title>{fullText}</title>
                      {shortText}
                    </text>
                  </g>
                );
              }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#9b87f5" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box
        className="card"
        sx={{
          mb: 6,
          borderRadius: "1.5rem",
          p: 4,
          boxShadow: "0 10px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Weekly Engagement Trend
          </Typography>
          <Box>
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            >
              ⬅️ Prev
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                setWeekOffset(Math.min(weeks.length - 1, weekOffset + 1))
              }
            >
              Next ➡️
            </Button>
          </Box>
        </Box>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={currentWeek}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#F97316"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box
        className="card"
        sx={{
          mb: 6,
          borderRadius: "1.5rem",
          p: 4,
          boxShadow: "0 10px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          🎯 High-Intent Investors
        </Typography>
        <List>
          {report.highIntentInvestors.map((inv, idx) => (
            <ListItem key={idx} divider>
              <ListItemText
                primary={
                  <span style={{ fontWeight: 500 }}>
                    ID: {inv.conversationId}
                  </span>
                }
                secondary={`Score: ${inv.qualityScore} | Date: ${new Date(inv.createdAt).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box
        className="card"
        sx={{
          mb: 6,
          borderRadius: "1.5rem",
          p: 4,
          boxShadow: "0 10px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          💬 Top Investor Quotes
        </Typography>
        {report.topQuotes && report.topQuotes.length > 0 ? (
          <List>
            {report.topQuotes.map((quote, idx) => (
              <ListItem key={idx} divider>
                <ListItemText
                  primary={
                    <span style={{ color: "#8B5CF6", fontWeight: 500 }}>
                      Insight Score: {quote.score}
                    </span>
                  }
                  secondary={`"${quote.text}"`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No top quotes available.</Typography>
        )}
      </Box>

      <Box sx={{ pt: 2 }}>
        <Button
          onClick={handleDownload}
          sx={{
            py: 2,
            px: 4,
            borderRadius: "9999px",
            backgroundColor: "#9b87f5",
            color: "#fff",
            fontWeight: 500,
            "&:hover": { backgroundColor: "#7E69AB" },
          }}
        >
          📥 Download CSV Report
        </Button>
        <Box sx={{ pt: 2 }}>
          <Button
            onClick={handleSync}
            disabled={syncing}
            sx={{
              py: 2,
              px: 4,
              borderRadius: "9999px",
              backgroundColor: "#16A34A",
              color: "#fff",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#15803D" },
            }}
          >
            {syncing ? "⏳ Syncing..." : "🔁 Sync Now"}
          </Button>
          {syncMessage && (
            <Typography
              sx={{ mt: 1, fontSize: 14, color: syncError ? "red" : "green" }}
            >
              {syncMessage}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ pt: 2 }}>
        <Button
          onClick={() => {
            localStorage.removeItem("token");
            onLogout();
          }}
          sx={{
            py: 2,
            px: 4,
            borderRadius: "9999px",
            backgroundColor: "#F97316",
            color: "#fff",
            fontWeight: 500,
            "&:hover": { backgroundColor: "#ea580c" },
          }}
        >
          🔓 Log Out
        </Button>
      </Box>
    </Box>
  );
}
