// @/components/ChatHeader.tsx
"use client";
import React, { useEffect, useState } from "react";
import ProtectedImage from "@/components/ProtectedImage";
import axios from "axios";
import FAB from "@/components/FAB";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
}

const ChatHeader = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  // useEffect(() => {
  //   const fetchContributors = async () => {
  //     try {
  //       const res = await axios.get<Contributor[]>(
  //         "https://api.github.com/repos/yogawan/geektakon/contributors",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
  //           },
  //         },
  //       );
  //       setContributors(res.data);
  //     } catch (error) {
  //       console.error("Failed to fetch contributors:", error);
  //     }
  //   };

  //   fetchContributors();
  // }, []);

  return (
    <div className="pl-5 pr-5 pb-5 bg-none">
      <FAB text="Support this project" icon="mdi:coffee" />

      <ProtectedImage src="/logo.svg" alt="logo" className="h-24 mt-24 mb-3" />

      <div className="flex items-end gap-2">
        <p className="text-3xl font-thin text-white">GeekTakon</p>
        <p className="text-white/50 text-xs p-3 border border-white/15 w-fit rounded-r-2xl rounded-tl-2xl">
          Formerly JawirAI, now GeekTakon, a community-driven project.
        </p>
      </div>

      {/* <p className="text-xl font-thin text-white/50">
        <u>
          <a
            href="https://github.com/yogawan/geektakon"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Source
          </a>
        </u>{" "}
        <i className="text-white">User Interface (UI)</i>
        <br />
        to interact with LLM Models.
      </p> */}

      <div className="flex flex-wrap items-center gap-3">
        <div className="mt-3">
          <div className="flex flex-wrap">
            {contributors.map((contributor) => (
              <a
                key={contributor.login}
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  className="w-8 h-8 rounded-full border border-white/20 hover:scale-110 transition-transform"
                />
              </a>
            ))}
          </div>
        </div>
        <p className="mt-1 text-xs px-3 py-1 border border-white/15 w-fit rounded-full">
          {contributors.length}+ contributors
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
