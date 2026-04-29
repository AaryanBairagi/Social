import { NextRequest } from "next/server";
import { Usage } from "@/models/usage.model";
import { User } from "@/models/user.model";

export async function GET(req: NextRequest) {
  try {
    const userId = new URL(req.url).searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    const dailyData = await Promise.all(
      last7Days.map(async (date) => {
        const usage = await Usage.findOne({
          user: user._id,
          date,
        });

        return {
          date,
          timeSpent: usage?.timeSpent || 0,
        };
      })
    );

    // last 4 weeks
    const weeklyData = [];

    for (let i = 0; i < 4; i++) {
      const start = new Date();
      start.setDate(start.getDate() - i * 7);

      const end = new Date(start);
      end.setDate(start.getDate() - 6);

      const usages = await Usage.find({
        user: user._id,
        createdAt: {
          $gte: end,
          $lte: start,
        },
      });

      const total = usages.reduce((sum, u) => sum + u.timeSpent, 0);

      weeklyData.unshift({
        week: `Week ${4 - i}`,
        timeSpent: total,
      });
    }

    return Response.json({
      daily: dailyData,
      weekly: weeklyData,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}