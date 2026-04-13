"use client";

import Banner from "@/components/Banner";
import Deco from "@/components/Deco";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { sortTeamMembersByHierarchy } from "@/lib/teamHierarchy";

function TeamProfileModal({ member, onClose }) {
  if (!member) return null;

  return (
    <div className="fixed text-justify inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white max-w-5xl w-full rounded-xl shadow-2xl p-6 md:p-10 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row md:space-x-10 gap-6">
          <div className="relative w-full md:w-[45%]">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                width={1000}
                height={1000}
                loading="lazy"
                quality={100}
                className="rounded-xl w-full h-auto"
              />
            ) : (
              <div className="rounded-xl bg-gray-100 aspect-[4/5]" />
            )}
          </div>

          <div className="w-full">
            <h2 className="font-bold text-2xl uppercase text-gray-800 mb-2">
              {member.name}
            </h2>
            <div className="font-semibold text-lg text-gray-700 mb-4">
              {member.title}
            </div>
            <div className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-line">
              {member.intro}
            </div>
          </div>
        </div>
        {member.bio && (
          <div className="mt-10 text-[15px] text-gray-800 leading-[1.8] whitespace-pre-line">
            {member.bio}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OurTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const teamQuery = query(collection(db, "teamMembers"), orderBy("order", "asc"));
        const snapshot = await getDocs(teamQuery);
        const members = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setTeam(sortTeamMembersByHierarchy(members));
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      <Banner
        title="About Us"
        subtitle={
          <span className="text-center font-medium text-white/70">
            <Link href="/" className="hover:underline ">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/about" className="hover:underline ">
              About Us
            </Link>{" "}
            /{" "}
            <Link href="/about/team" className="hover:underline text-white font-bold">
              Our Team
            </Link>
          </span>
        }
      />
      <Deco />
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold uppercase text-[var(--color-title-text)] mb-1">
            OUR TEAM
          </h2>
          <div className="w-24 h-1 bg-[var(--color-primary-olive)] rounded-full mb-6" />
        </div>

        {loading ? (
          <div className="text-gray-500">Loading team members...</div>
        ) : team.length === 0 ? (
          <div className="text-gray-500">No team members have been added yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 justify-center items-start">
            {team.map((member, idx) => (
              <div
                key={member.id}
                className="w-full pb-5 items-center bg-white rounded-xl shadow "
              >
                <div className="w-full rounded-xl overflow-hidden mb-4 bg-gray-100">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={400}
                      height={500}
                      className="w-full h-[35vh] lg:h-[30vh] object-cover"
                    />
                  ) : (
                    <div className="w-full h-[35vh] lg:h-[30vh] bg-gray-100" />
                  )}
                </div>
                <div className="font-bold text-[13px] uppercase text-center mb-1 text-[var(--color-title-text)]">
                  {member.name}
                </div>
                <div className="text-xs text-gray-700 text-center mb-1">
                  {member.title}
                </div>
                <button
                  className="mx-auto block text-[var(--color-primary-magenta)] text-xs font-semibold hover:underline"
                  onClick={() => setOpenIdx(idx)}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

        <TeamProfileModal
          member={openIdx !== null ? team[openIdx] : null}
          onClose={() => setOpenIdx(null)}
        />
      </section>
    </main>
  );
}
