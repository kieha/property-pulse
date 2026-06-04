"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";

type ProfileEditFormProps = {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
};

const ProfileEditForm = ({ isEditing, setIsEditing }: ProfileEditFormProps) => {
  const { data: session, update: updateSession } = useSession();
  const user = session?.user;

  const [name, setName] = useState<string | undefined>(user?.username);
  const [email, setEmail] = useState<string>(user?.email as string);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (res.status === 200) {
        updateSession();
        toast.success("Profile updated successfully");
      } else {
        toast.error("Error updating profile");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <form className="md:w-1/4 md:mx-10" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-6">Update Profile</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex gap-x-10">
        <button
          className="bg-blue-500 text-white px-3 py-3 rounded-md hover:bg-blue-600"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Updating profile..." : "Update"}
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600"
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  ) : null;
};

export default ProfileEditForm;
