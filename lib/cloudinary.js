function sanitizeCloudinaryPathSegment(value = "") {
  return value
    .toString()
    .normalize("NFKD")
    .replace(/[^\w\s-/]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "")
    .toLowerCase();
}

function sanitizeCloudinaryPath(path = "") {
  return path
    .split("/")
    .map((segment) => sanitizeCloudinaryPathSegment(segment))
    .filter(Boolean)
    .join("/");
}

export function buildCloudinaryAsset(uploadResult) {
  if (!uploadResult?.secure_url || !uploadResult?.public_id) {
    return null;
  }

  return {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    resourceType: uploadResult.resource_type || "image",
    format: uploadResult.format || "",
    version: uploadResult.version || null,
    bytes: uploadResult.bytes || 0,
    originalFilename: uploadResult.original_filename || "",
  };
}

export async function uploadToCloudinary(file, options = {}) {
  const { folder, resourceType = "auto", publicId } = options;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("resourceType", resourceType);

  const sanitizedFolder = folder ? sanitizeCloudinaryPath(folder) : "";
  const sanitizedPublicId = publicId ? sanitizeCloudinaryPath(publicId) : "";

  if (sanitizedFolder) {
    formData.append("folder", sanitizedFolder);
  }

  if (sanitizedPublicId) {
    formData.append("publicId", sanitizedPublicId);
  }

  const response = await fetch("/api/cloudinary/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Cloudinary upload failed.");
  }

  return data;
}

export { sanitizeCloudinaryPath, sanitizeCloudinaryPathSegment };

export async function deleteCloudinaryAsset(asset) {
  if (!asset?.publicId) {
    return;
  }

  const response = await fetch("/api/cloudinary/destroy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicId: asset.publicId,
      resourceType: asset.resourceType || "image",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to delete Cloudinary asset.");
  }

  return data;
}
