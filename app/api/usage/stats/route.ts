import { NextRequest, NextResponse } from "next/server";
import { Usage } from "@/models/usage.model";
import { getAuth } from "@/lib/auth/getAuth";

// Previously trusted a client-supplied ?userId= query param with no
// verification - any logged-in user could view any other user's usage
// analytics just by changing the value. Identity now comes from the
// verified auth cookie instead.
export async function GET(req: NextRequest) {
  try {
    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
          user: userId,
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
        user: userId,
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

    return NextResponse.json({
      daily: dailyData,
      weekly: weeklyData,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
