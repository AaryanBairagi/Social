"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import SectionHeader from "@/global/SectionHeader";
import { IoMdTime } from "react-icons/io";

/* ---------------- HELPERS ---------------- */

const formatTime = (sec: number) => {
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);

  if (hrs > 0) return `${hrs}h ${min % 60}m`;
  return `${min}m`;
};

/* ---------------- PAGE ---------------- */

export default function TimeManagementPage() {
  const { user } = useUser();

  const [daily, setDaily] = useState<any[]>([]);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/usage/stats?userId=${user.id}`);
        const data = await res.json();

        setDaily(data.daily || []);
        setWeekly(data.weekly || []);
      } catch (err) {
        console.error("Failed to fetch usage stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  /* ---------------- STATS ---------------- */

  const dailyAvg = useMemo(() => {
    if (!daily.length) return 0;
    return daily.reduce((sum, d) => sum + d.timeSpent, 0) / daily.length;
  }, [daily]);

  const weeklyAvg = useMemo(() => {
    if (!weekly.length) return 0;
    return weekly.reduce((sum, w) => sum + w.timeSpent, 0) / weekly.length;
  }, [weekly]);

  const todayUsage = daily[daily.length - 1]?.timeSpent || 0;

  const maxDay = daily.reduce(
    (max, d) => (d.timeSpent > max.timeSpent ? d : max),
    { timeSpent: 0 }
  );

  const dailyFormatted = daily.map((d) => ({
  ...d,
  timeSpent: +(d.timeSpent / 60).toFixed(1), // seconds → minutes
    }));

  const weeklyFormatted = weekly.map((w) => ({
    ...w,
    timeSpent: +(w.timeSpent / 60).toFixed(1),
}));

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex flex-row justify-center items-center py-10 gap-4">
        <p className="text-gray-400">Loading Analytics</p>
        <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br  text-cyan-600 p-6 space-y-10">

      {/* HEADER */}

        {/* <h1 className="text-3xl font-bold mb-2">Time Management</h1> */}
        <SectionHeader title={"Time Management"} icon={<IoMdTime className="w-8 h-8"/>} />
        <p className="text-gray-400 text-sm">
          Track your usage and stay productive
        </p>
 

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/80 p-4 rounded-xl shadow">

        <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-800 shadow">
          <p className="text-gray-400 text-sm">Today</p>
          <h2 className="text-2xl font-semibold text-cyan-400">
            {formatTime(todayUsage)}
          </h2>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-800 shadow">
          <p className="text-gray-400 text-sm">Daily Avg</p>
          <h2 className="text-2xl font-semibold text-cyan-400">
            {formatTime(dailyAvg)}
          </h2>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-800 shadow">
          <p className="text-gray-400 text-sm">Peak Day</p>
          <h2 className="text-2xl font-semibold text-cyan-400">
            {formatTime(maxDay.timeSpent)}
          </h2>
        </div>

      </div>

      {/* DAILY CHART */}
      <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800 shadow">
        <h2 className="text-lg font-semibold mb-4 text-cyan-400">
          Daily Usage (Last 7 Days)
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyFormatted}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                background: "#020617",
                border: "1px solid #1e293b",
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Line
              type="monotone"
              dataKey="timeSpent"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* WEEKLY CHART */}
      <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800 shadow">
        <h2 className="text-lg font-semibold mb-4 text-cyan-400">
          Weekly Usage
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyFormatted}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              stroke="#64748b"
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                background: "#020617",
                border: "1px solid #1e293b",
              }}
            />
            <Bar dataKey="timeSpent" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}