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

    const { publicId, resourceType = "image" } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: "publicId is required." }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = {
      invalidate: true,
      public_id: publicId,
      timestamp,
    };

    const signature = signParams(paramsToSign, CLOUDINARY_API_SECRET);
    const body = new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      invalidate: "true",
      signature,
      api_key: CLOUDINARY_API_KEY,
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Cloudinary delete failed." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unexpected Cloudinary delete error." },
      { status: 500 }
    );
  }
}
