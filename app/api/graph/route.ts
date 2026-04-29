import { buildConnectionGraph } from "@/lib/graph/graph-builder";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId query parameter" },
        { status: 400 }
      );
    }

    const graph = await buildConnectionGraph(userId);

    return NextResponse.json(graph);
  } catch (error) {
    console.error("Graph API Error:", error);

    return NextResponse.json(
      { error: "Failed to build graph" },
      { status: 500 }
    );
  }
}