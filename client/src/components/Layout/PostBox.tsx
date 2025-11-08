import { useState } from "react";
import { useSelector } from "react-redux";
import { useTweetContract } from "../../hooks/useTweetContract";
import axios from "axios";
import { v5 as uuidv5 } from "uuid";
import {
  MdOutlineGif,
  MdOutlinePermMedia,
  MdOutlineSchedule,
  MdPoll,
  MdClose,
} from "react-icons/md";
import { FaUserSecret } from "react-icons/fa";
import { RootState } from "../../store";
import { toast, ToastContainer } from "react-toastify";

const icons = [
  { key: "media", icon: <MdOutlinePermMedia />, tooltip: "Attach Media" },
  { key: "gif", icon: <MdOutlineGif />, tooltip: "Attach GIF" },
  { key: "poll", icon: <MdPoll />, tooltip: "Create Poll" },
  { key: "anonymous", icon: <FaUserSecret />, tooltip: "Post Anonymously" },
  { key: "schedule", icon: <MdOutlineSchedule />, tooltip: "Schedule Post" },
];

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_API_SECRET;
const NAMESPACE = process.env.REACT_APP_UUID_NAMESPACE;

const PostBox = () => {
  const [text, setText] = useState("");
  const [postType, setPostType] = useState("Mutable");
  const [previewMediaURL, setPreviewMediaURL] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const [mediaCID, setMediaCID] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const userID = localStorage.getItem("userID");
  const { contract } = useTweetContract();

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "40px";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setText(event.target.value);
  };

  const handleIconClick = async (key: string) => {
    switch (key) {
      case "media":
        attachMedia();
        break;
      case "gif":
        alert("GIF attachment not implemented yet.");
        break;
      case "poll":
        createPoll();
        break;
      case "anonymous":
        postAnonymousTweet();
        break;
      case "schedule":
        alert("Scheduling feature coming soon!");
        break;
      default:
        console.warn("Invalid action!");
    }
  };

  const attachMedia = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            maxContentLength: Infinity,
            headers: {
              "Content-Type": `multipart/form-data`,
              pinata_api_key: PINATA_API_KEY,
              pinata_secret_api_key: PINATA_SECRET_API_KEY,
            },
          }
        );

        const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;

        const isVideo = file.type.startsWith("video");
        setMediaType(isVideo ? "video" : "image");
        setPreviewMediaURL(url);
        setMediaCID(res.data.IpfsHash);
      } catch (err) {
        console.error(err);
        toast.error("Failed to upload media.");
      }
    };
    input.click();
  };

  const removeMedia = () => {
    setPreviewMediaURL(null);
    setMediaCID(null);
    setMediaType(null);
  };

  const createPoll = () => {
    alert("Poll creation is not available in this version.");
  };

  const postTweet = async () => {
    if (contract) {
      setIsPosting(true);
      try {
        if (postType === "Mutable") {
          const transaction = await contract.postMutableTweet(
            user?.name,
            userID,
            user?.avatar,
            text,
            mediaCID || ""
          );
          await transaction.wait();
        } else {
          const transaction = await contract.postTweet(
            user?.name,
            userID,
            user?.avatar,
            text,
            mediaCID || ""
          );
          await transaction.wait();
        }
        toast.success("Tweet posted successfully!");
        setText("");
        setPreviewMediaURL(null);
        setMediaCID(null);
        setMediaType(null);
      } catch (error) {
        console.error("Error posting tweet:", error);
        toast.error("Failed to post tweet.");
      } finally {
        setIsPosting(false);
      }
    } else {
      toast.error("Contract is not available. Please connect your wallet.");
    }
  };

  const generateUserID = () => {
    if (!user || !NAMESPACE) return;
    const uuid = uuidv5(user?.walletAddress || "", NAMESPACE);
    const userID = `user_${uuid.slice(0, 8)}`;
    return userID;
  };

  const postAnonymousTweet = async () => {
    if (contract) {
      setIsPosting(true);
      try {
        const transaction = await contract.postTweet(
          "Anonymous",
          generateUserID(),
          "https://cdn-icons-png.flaticon.com/128/10/10960.png",
          text,
          mediaCID || ""
        );
        await transaction.wait();
        toast.success("Tweet posted successfully!");
        setText("");
        setPreviewMediaURL(null);
        setMediaCID(null);
        setMediaType(null);
      } catch (error) {
        console.error("Error posting tweet:", error);
        toast.error("Failed to post tweet.");
      } finally {
        setIsPosting(false);
      }
    } else {
      toast.error("Contract is not available. Please connect your wallet.");
    }
  };

  const charCount = text.length;
  const maxChars = 280;

  return (
    <div className="hidden sm:block border-b border-gray-700">
      <ToastContainer position="top-right" theme="dark" />
      
      {/* Header with Post Type Selector */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
        <h2 className="text-lg font-semibold text-white">Create Post</h2>
        <select
          value={postType}
          onChange={(event) => setPostType(event.target.value)}
          className="bg-gray-800/50 text-white border border-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Mutable">Mutable</option>
          <option value="Immutable">Immutable</option>
        </select>
      </div>

      {/* Main Content Area */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={user?.avatar}
              alt="user"
              className="w-12 h-12 rounded-full bg-white ring-2 ring-gray-700"
            />
          </div>

          {/* Text Input Area */}
          <div className="flex-1">
            <textarea
              placeholder="What's your Proof of Activity?"
              className="bg-transparent text-white text-lg w-full resize-none placeholder-gray-500 focus:outline-none"
              style={{ minHeight: "80px" }}
              value={text}
              onChange={handleInput}
            />

            {/* Media Preview */}
            {previewMediaURL && (
              <div className="relative mt-3 rounded-2xl overflow-hidden border border-gray-700">
                <button
                  onClick={removeMedia}
                  className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full p-1.5 transition-colors z-10"
                >
                  <MdClose size={20} />
                </button>
                {mediaType === "video" ? (
                  <video src={previewMediaURL} controls className="w-full" />
                ) : (
                  <img src={previewMediaURL} alt="Preview" className="w-full" />
                )}
              </div>
            )}

            {/* Character Counter */}
            {text.length > 0 && (
              <div className="flex justify-end mt-2">
                <span className={`text-sm ${charCount > maxChars ? 'text-red-500' : 'text-gray-500'}`}>
                  {charCount} / {maxChars}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
          {/* Icons */}
          <div className="flex items-center gap-1">
            {icons.map((item) => (
              <button
                key={item.key}
                className="relative group text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-2 rounded-full transition-all"
                onClick={() => handleIconClick(item.key)}
                title={item.tooltip}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {item.tooltip}
                </span>
              </button>
            ))}
          </div>

          {/* Post Button */}
          <button
            onClick={postTweet}
            disabled={!text.trim() || charCount > maxChars || isPosting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-full transition-colors"
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>

        {/* Warning for Immutable Posts */}
        {postType === "Immutable" && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm leading-relaxed">
              <span className="font-semibold">⚠️ Warning:</span> Posts flagged as immutable are permanent and cannot be modified or deleted once submitted. Refrain from posting content you might want to remove later, such as casual selfies or personal photos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostBox;