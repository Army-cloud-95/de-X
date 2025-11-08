"use client"
import { useState, useEffect } from "react"
import ForYouContent from "../components/Layout/ForYouContent"
import FollowingContent from "../components/Layout/FollowingContent"

const HomePage = () => {
  const [activeComponent, setActiveComponent] = useState("foryou")
  const [userID, setUserID] = useState<string | null>(null)

  useEffect(() => {
    setUserID(localStorage.getItem("userID"))
  }, [])

  if (!userID) return null

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              
              <h1 
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#345eeb] to-[#78c7ff]" 
                style={{ fontFamily: "Poppins" }}
              >
                Decentralized-X
              </h1>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1.5 border border-slate-700/50 shadow-inner">
              <button
                onClick={() => setActiveComponent("foryou")}
                className={`relative px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm overflow-hidden ${
                  activeComponent === "foryou"
                    ? "text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                }`}
              >
                {activeComponent === "foryou" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#345eeb] to-[#4d6eeb] rounded-lg" />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
                    />
                  </svg>
                  For You
                </span>
              </button>
              <button
                onClick={() => setActiveComponent("following")}
                className={`relative px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm overflow-hidden ${
                  activeComponent === "following"
                    ? "text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                }`}
              >
                {activeComponent === "following" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#345eeb] to-[#4d6eeb] rounded-lg" />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                  Following
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        <div className="min-h-full">
          {activeComponent === "foryou" ? <ForYouContent /> : <FollowingContent />}
        </div>
      </div>
    </div>
  )
}

export default HomePage