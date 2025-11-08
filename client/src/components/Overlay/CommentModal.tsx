"use client"

import { type ChangeEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import useCommentHandler from "../../hooks/useCommentHandler"
import { usePostInteractions } from "../../hooks/usePostInteractions"
import axios from "axios"
import type { RootState } from "../../store"
import type { Tweet } from "../../types"
import { toast } from "react-toastify"
import ReactLoading from "react-loading"
import { MdOutlineGif, MdOutlinePermMedia, MdOutlineSchedule, MdPoll } from "react-icons/md"
import { FaUserSecret } from "react-icons/fa"

interface Comment {
  comment: string
}

const icons = [
  { key: "media", icon: <MdOutlinePermMedia />, tooltip: "Attach Media" },
  { key: "gif", icon: <MdOutlineGif />, tooltip: "Attach GIF" },
  { key: "poll", icon: <MdPoll />, tooltip: "Create Poll" },
  { key: "anonymous", icon: <FaUserSecret />, tooltip: "Post Anonymously" },
  { key: "schedule", icon: <MdOutlineSchedule />, tooltip: "Schedule Post" },
]

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_API_SECRET

const CommentModal = ({
  toggleCommentModal,
  isVisible,
  tweet,
  tweets,
}: {
  toggleCommentModal: () => void
  isVisible: boolean
  tweet: Tweet | undefined
  tweets: Tweet[]
}) => {
  const [comment, setComment] = useState<Comment>({
    comment: "",
  })
  const [previewMediaURL, setPreviewMediaURL] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)

  const [mediaCID, setMediaCID] = useState<string | null>(null)

  const navigate = useNavigate()

  const userID = localStorage.getItem("userID")

  const user = useSelector((state: RootState) => state.user)
  const { contract } = usePostInteractions()

  const { handleSetComment } = useCommentHandler(tweets, contract)

  const handleIconClick = async (key: string) => {
    switch (key) {
      case "media":
        attachMedia()
        break
      case "gif":
        alert("GIF attachment not implemented yet.")
        break
      case "poll":
        createPoll()
        break
      case "anonymous":
        toggleAnonymousPost()
        break
      case "schedule":
        alert("Scheduling feature coming soon!")
        break
      default:
        console.warn("Invalid action!")
    }
  }

  const attachMedia = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,video/*"
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          maxContentLength: Number.POSITIVE_INFINITY,
          headers: {
            "Content-Type": `multipart/form-data`,
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
        })

        const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`

        const isVideo = file.type.startsWith("video")
        setMediaType(isVideo ? "video" : "image")
        setPreviewMediaURL(url)
        setMediaCID(res.data.IpfsHash)
      } catch (err) {
        console.error(err)
        toast.error("Failed to upload media.")
      }
    }
    input.click()
  }

  const createPoll = () => {
    alert("Poll creation is not available in this version.")
  }

  const toggleAnonymousPost = () => {
    alert("Posting anonymously!")
  }

  const handleFieldChange = (field: keyof Comment) => (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment((prevData) => ({
      ...prevData,
      [field]: event.target.value,
    }))
  }

  if (!tweet) {
    return <ReactLoading />
  }

  return (
    <div
      className={`${
        isVisible ? "animate-fade-in" : "hidden"
      } fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm`}
    >
      <div
        className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/20 max-w-lg min-w-[320px] rounded-2xl shadow-2xl p-6 md:p-8 leading-relaxed transition-all duration-300 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div
          className="absolute top-4 right-4 p-2 cursor-pointer hover:bg-cyan-500/10 rounded-lg transition duration-200 text-gray-400 hover:text-cyan-400"
          onClick={toggleCommentModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        </div>

        <div className="flex flex-row gap-3 mb-6 pb-6 border-b border-slate-700">
          <img
            src={tweet.avatar || "/placeholder.svg"}
            alt="profile"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
          />
          <div className="flex flex-col flex-1">
            <div className="flex flex-col sm:flex-row gap-2">
              <p
                className="font-semibold text-white cursor-pointer hover:text-cyan-400 transition"
                style={{ fontFamily: "Roboto" }}
                onClick={() => navigate(`/profile/${tweet.authorID}`)}
              >
                {tweet.name}
              </p>
              <p
                className="text-sm text-slate-500 cursor-pointer hover:text-cyan-400 transition"
                style={{ fontFamily: "Roboto" }}
                onClick={() => navigate(`/profile/${tweet.authorID}`)}
              >
                @{tweet.authorID}
              </p>
              <p className="text-sm text-slate-500" style={{ fontFamily: "Roboto" }}>
                {tweet.date} {tweet.month}
              </p>
            </div>
            <p
              className="text-white mt-2 cursor-pointer hover:text-cyan-300 transition"
              onClick={() =>
                navigate(`/${tweet.authorID}/status/${tweet.id}`, {
                  state: { tweet },
                })
              }
            >
              {tweet.content}
            </p>
            <p className="mt-3 text-slate-500">
              Replying to <span className="text-cyan-400">@{tweet.authorID}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-row gap-3 mb-6">
          <img src={tweet.avatar || "/placeholder.svg"} alt="profile" className="w-12 h-12 rounded-full object-cover" />
          <textarea
            className="bg-slate-800/50 border border-slate-600 hover:border-cyan-500/50 focus:border-cyan-500 p-3 text-lg resize-none placeholder:text-slate-500 focus:outline-none w-full rounded-lg transition duration-200 text-white"
            placeholder="Post your reply"
            onChange={handleFieldChange("comment")}
          />
        </div>

        <div className="flex flex-row gap-3 mb-4 px-4">
          {icons.map((item) => (
            <span
              key={item.key}
              className="relative group text-xl cursor-pointer text-slate-400 hover:text-cyan-400 transition duration-200"
              onClick={() => handleIconClick(item.key)}
            >
              {item.icon}
              <span className="absolute bottom-8 left-1/2 -translate-x-1/2 w-max px-3 py-1 text-xs bg-slate-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {item.tooltip}
              </span>
            </span>
          ))}
        </div>

        {previewMediaURL && (
          <div className="flex justify-center mb-6 bg-slate-800/30 p-4 rounded-lg">
            {mediaType === "video" ? (
              <video src={previewMediaURL} controls className="w-full max-w-sm rounded-lg" />
            ) : (
              <img src={previewMediaURL || "/placeholder.svg"} alt="Preview" className="max-w-sm rounded-lg" />
            )}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => handleSetComment(tweet, user, userID, comment, mediaCID, toggleCommentModal)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold p-3 px-16 rounded-full transition duration-300 ease-in-out shadow-lg hover:shadow-cyan-500/50"
            style={{ fontFamily: "Poppins" }}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentModal
