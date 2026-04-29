export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return new Response("Missing URL", { status: 400 });
    }

    const res = await fetch(fileUrl, {
      method: "GET",
      headers: {
        "Accept": "application/pdf",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.log("Cloudinary fetch failed:", res.status);
      return new Response("Failed to fetch PDF", { status: 500 });
    }

    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "no-store",
      },
    });

  } catch (err) {
    console.log("PDF API error:", err);
    return new Response("Server error", { status: 500 });
  }
}