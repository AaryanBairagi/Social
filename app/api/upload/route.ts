import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: "deazqe0j0",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const isImage = file.type.startsWith("image/");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result : UploadApiResponse = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        // resource_type: "raw", 
        resource_type: isImage? "image" : "raw",
        type: "upload",        
        access_mode:"public"
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Cloudinary upload returned no result"));
        else resolve(result);
      }
    ).end(buffer);
  });

  // return Response.json(result);
  return Response.json({
    url: result.secure_url,
    type: result.resource_type,   // "image" or "raw"
    name: file.name               // original file name
  });
}