import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import { teamMembersSeed } from "../data/teamMembersSeed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error("Missing Firebase environment variables.");
}

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Missing Cloudinary environment variables.");
}

function signUpload(params) {
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

async function uploadImageToCloudinary(relativeFilePath, publicId) {
  const absolutePath = path.resolve(rootDir, relativeFilePath);
  const fileBuffer = await fs.readFile(absolutePath);
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "mdcl/team";
  const params = {
    folder,
    public_id: publicId,
    timestamp,
    overwrite: true,
  };

  const formData = new FormData();
  formData.append("file", new Blob([fileBuffer]));
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("overwrite", "true");
  formData.append("signature", signUpload(params));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || `Cloudinary upload failed for ${relativeFilePath}`);
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type || "image",
    format: data.format || "",
    version: data.version || null,
    bytes: data.bytes || 0,
    originalFilename: data.original_filename || "",
  };
}

async function seedTeamMembers() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const existingQuery = query(collection(db, "teamMembers"));
  const existingSnapshot = await getDocs(existingQuery);
  await Promise.all(existingSnapshot.docs.map((item) => deleteDoc(item.ref)));

  for (const member of teamMembersSeed) {
    const publicId = member.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const imageAsset = await uploadImageToCloudinary(member.imagePath, publicId);

    await addDoc(collection(db, "teamMembers"), {
      name: member.name,
      title: member.title,
      intro: member.intro,
      bio: member.bio,
      order: member.order,
      image: imageAsset.url,
      imageAsset,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`Seeded ${member.name}`);
  }

  console.log("Team member seeding complete.");
}

seedTeamMembers().catch((error) => {
  console.error(error);
  process.exit(1);
});
