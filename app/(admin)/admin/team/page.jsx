"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { buildCloudinaryAsset, deleteCloudinaryAsset, uploadToCloudinary } from "@/lib/cloudinary";
import { teamMembersSeed } from "@/data/teamMembersSeed";
import { sortTeamMembersByHierarchy } from "@/lib/teamHierarchy";
import UploadDropzone from "@/components/admin/UploadDropzone";

const emptyForm = {
  name: "",
  title: "",
  intro: "",
  bio: "",
  order: "",
  image: "",
  imageAsset: null,
};

export default function AdminTeamPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeamMembers = async () => {
    try {
      const teamQuery = query(collection(db, "teamMembers"), orderBy("order", "asc"));
      const snapshot = await getDocs(teamQuery);
      const members = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
      setTeamMembers(sortTeamMembersByHierarchy(members));
    } catch (fetchError) {
      console.error("Error fetching team members:", fetchError);
      setError("Failed to load team members.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setSelectedFile(null);
    setPreview("");
    setEditingId(null);
    setError("");
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name || "",
      title: member.title || "",
      intro: member.intro || "",
      bio: member.bio || "",
      order: member.order ?? "",
      image: member.image || "",
      imageAsset: member.imageAsset || null,
    });
    setPreview(member.image || "");
    setSelectedFile(null);
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Delete ${member.name}?`)) {
      return;
    }

    try {
      if (member.imageAsset?.publicId) {
        await deleteCloudinaryAsset(member.imageAsset);
      }
      await deleteDoc(doc(db, "teamMembers", member.id));
      fetchTeamMembers();
      if (editingId === member.id) {
        resetForm();
      }
    } catch (deleteError) {
      console.error("Error deleting team member:", deleteError);
      setError("Failed to delete team member.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.title.trim()) {
      setError("Name and title are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let image = formData.image || "";
      let imageAsset = formData.imageAsset || null;

      if (selectedFile) {
        const uploadResult = await uploadToCloudinary(selectedFile, {
          folder: "mdcl/team",
          resourceType: "image",
        });
        const uploadedAsset = buildCloudinaryAsset(uploadResult);

        if (editingId && formData.imageAsset?.publicId) {
          await deleteCloudinaryAsset(formData.imageAsset).catch(() => null);
        }

        image = uploadedAsset?.url || "";
        imageAsset = uploadedAsset;
      }

      const payload = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        intro: formData.intro.trim(),
        bio: formData.bio.trim(),
        order: Number(formData.order || 0),
        image,
        imageAsset,
        updatedAt: Timestamp.now(),
      };

      if (editingId) {
        await updateDoc(doc(db, "teamMembers", editingId), payload);
      } else {
        await addDoc(collection(db, "teamMembers"), {
          ...payload,
          createdAt: Timestamp.now(),
        });
      }

      resetForm();
      fetchTeamMembers();
    } catch (submitError) {
      console.error("Error saving team member:", submitError);
      setError("Failed to save team member.");
    } finally {
      setLoading(false);
    }
  };

  const handleTeamImageSelected = (files) => {
    const file = files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImportStaticMembers = async () => {
    if (!window.confirm("Import the original static team members into Firestore? Existing team members will be replaced.")) {
      return;
    }

    setImporting(true);
    setError("");

    try {
      const existingSnapshot = await getDocs(query(collection(db, "teamMembers")));
      await Promise.all(
        existingSnapshot.docs.map(async (item) => {
          const data = item.data();
          if (data.imageAsset?.publicId) {
            await deleteCloudinaryAsset(data.imageAsset).catch(() => null);
          }
          await deleteDoc(item.ref);
        })
      );

      for (const member of teamMembersSeed) {
        const response = await fetch(member.imagePath.replace(/^public/, ""));
        const blob = await response.blob();
        const fileName = member.imagePath.split("/").pop() || `${member.name}.jpg`;
        const file = new File([blob], fileName, { type: blob.type || "image/jpeg" });
        const uploadResult = await uploadToCloudinary(file, {
          folder: "mdcl/team",
          resourceType: "image",
        });
        const imageAsset = buildCloudinaryAsset(uploadResult);

        await addDoc(collection(db, "teamMembers"), {
          name: member.name,
          title: member.title,
          intro: member.intro,
          bio: member.bio,
          order: member.order,
          image: imageAsset?.url || "",
          imageAsset,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }

      await fetchTeamMembers();
    } catch (importError) {
      console.error("Error importing static team members:", importError);
      setError("Failed to import the original team members.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingId ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <button
            type="button"
            onClick={handleImportStaticMembers}
            disabled={importing}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {importing ? "Importing..." : "Import Original Team"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Display order"
              value={formData.order}
              onChange={(e) => setFormData((prev) => ({ ...prev, order: e.target.value }))}
              className="border border-gray-300 rounded-md px-4 py-2"
            />
            <UploadDropzone
              accept="image/*"
              disabled={loading}
              onFilesSelected={handleTeamImageSelected}
              title="Click to upload a team photo or drag and drop"
              subtitle="Use a portrait image for best display"
            />
          </div>

          {preview && (
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <textarea
            placeholder="Short introduction"
            value={formData.intro}
            onChange={(e) => setFormData((prev) => ({ ...prev, intro: e.target.value }))}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />

          <textarea
            placeholder="Full biography"
            value={formData.bio}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            rows={8}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : editingId ? "Update Member" : "Add Member"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Current Team Members</h2>

        {pageLoading ? (
          <div className="text-gray-500">Loading team members...</div>
        ) : teamMembers.length === 0 ? (
          <div className="text-gray-500">No team members added yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-56 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{member.title}</p>
                <p className="text-sm text-gray-500 line-clamp-3">{member.intro}</p>
                <div className="mt-4 flex gap-3 text-sm">
                  <button onClick={() => handleEdit(member)} className="text-blue-700 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(member)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
