import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PostTweetABI from "../contracts/PostTweet.json";
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// Use the deployed contract address from your local network
// const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const useRetrieveTweetsByUser = (userAddress: string) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const loadTweets = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
          // use the provider for read-only calls (safer for view functions)
          const provider = ethProvider;

          // quickly check whether a contract exists at the address
          try {
            const code = await provider.getCode(CONTRACT_ADDRESS);
            if (!code || code === "0x") {
              console.error(`No contract deployed at ${CONTRACT_ADDRESS} on the current network`);
              return;
            }
          } catch (e) {
            console.error("Failed to fetch contract code:", e);
          }

          const tweetContract = new ethers.Contract(CONTRACT_ADDRESS, PostTweetABI.abi, provider);

          const fetchedTweets = await tweetContract.getTweetsByUser(userAddress);
          setTweets(fetchedTweets);
        } catch (error) {
          console.error("Failed to fetch tweets:", error);
        }
      } else {
        console.error("Ethereum provider not found.");
      }
    };

    loadTweets();
  }, [userAddress]);

  return { tweets };
};

export const useRetrieveAllTweets = () => {
  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    const loadTweets = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
          const provider = ethProvider;

          // check contract exists at address before calling
          try {
            const code = await provider.getCode(CONTRACT_ADDRESS);
            if (!code || code === "0x") {
              console.error(`No contract deployed at ${CONTRACT_ADDRESS} on the current network`);
              return;
            }
          } catch (e) {
            console.error("Failed to fetch contract code:", e);
          }

          const tweetContract = new ethers.Contract(CONTRACT_ADDRESS, PostTweetABI.abi, provider);

          try {
            const fetchedTweets = await tweetContract.getAllTweets();
            setTweets(fetchedTweets);
          } catch (err: any) {
            // Log and attempt to decode revert reason when available
            console.error("Failed to fetch tweets:", err);
            if (err && err.data) {
              try {
                // ethers v5 revert reason decoding (Error(string))
                const hex = err.data as string;
                if (hex.startsWith("0x08c379a0")) {
                  // skip 0x + selector + two 32-byte words (offset + length)
                  const reason = ethers.utils.toUtf8String("0x" + hex.slice(138));
                  console.error("Revert reason:", reason);
                } else {
                  console.error("Revert data:", hex);
                }
              } catch (decErr) {
                console.error("Failed to decode revert reason:", decErr);
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch tweets:", error);
        }
      } else {
        console.error("Ethereum provider not found.");
      }
    };

    loadTweets();
  }, []);

  return { tweets };
};