"use client"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useBookmarkStatus from "../../hooks/useBookmarkStatus"
import { useRetrieveAllTweets } from "../../hooks/useRetrieveTweets"
import { usePostInteractions } from "../../hooks/usePostInteractions"
import type { Tweet } from "../../types"
import { IoIosReturnLeft } from "react-icons/io"
import UserPosts from "./UserPosts"

const Bookmarks = () => {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState<Tweet[]>([])
  const { tweets } = useRetrieveAllTweets()
  const { contract } = usePostInteractions()
  const { bookmarkedTweets } = useBookmarkStatus(tweets, contract)

  useEffect(() => {
    const updatedTweets = tweets.filter((tweet: Tweet) => bookmarkedTweets[tweet.id])
    setBookmarks(updatedTweets)
  }, [bookmarkedTweets, tweets])

  return (
    <>
      <div className="sticky top-0 z-10 bg-slate-900 rounded-xl border-b border-slate-700">
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-800 transition-colors"
          >
            <IoIosReturnLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: "Roboto" }}>
              Bookmarks
            </h1>
            <div className="text-sm text-gray-500">@{localStorage.getItem("userID")}</div>
          </div>
        </div>
      </div>
      
      <UserPosts tweets={bookmarks} isProfile={false} />
    </>
  )
}

export default Bookmarks