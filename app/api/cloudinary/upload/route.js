import crypto from "crypto";
import { NextResponse } from "next/server";

function getEnv(name, fallback) {
  return (process.env[name] || (fallback ? process.env[fallback] : "") || "").trim();
}

const CLOUDINARY_CLOUD_NAME = getEnv("CLOUDINARY_CLOUD_NAME", "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY", "NEXT_PUBLIC_CLOUDINARY_API_KEY");
const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET", "NEXT_PUBLIC_CLOUDINARY_API_SECRET");

function signParams(params, apiSecret) {
  const paramString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${paramString}${apiSecret}`)
    .digest("hex");
}

export async function POST(request) {
  try {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "Cloudinary server environment variables are missing." },
        { status: 500 }
      );
    }

    const incomingFormData = await request.formData();
    const file = incomingFormData.get("file");
    const folder = incomingFormData.get("folder")?.toString() || "";
    const resourceType = incomingFormData.get("resourceType")?.toString() || "auto";
    const publicId = incomingFormData.get("publicId")?.toString() || "";

    if (!file) {
      return NextResponse.json({ error: "file is required." }, { status: 400 });
    }

    if (typeof file === "string") {
      return NextResponse.json({ error: "Invalid file payload." }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = {
      folder,
      public_id: publicId,
      timestamp,
    };

    const signature = signParams(paramsToSign, CLOUDINARY_API_SECRET);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const upstreamFile = new File([fileBuffer], file.name || "upload", {
      type: file.type || "application/octet-stream",
    });
    const formData = new FormData();
    formData.append("file", upstreamFile);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);

    if (folder) {
      formData.append("folder", folder);
    }

    if (publicId) {
      formData.append("public_id", publicId);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Cloudinary upload failed." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unexpected Cloudinary upload error." },
      { status: 500 }
    );
  }
}
