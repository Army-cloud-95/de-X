
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ExternalProvider } from "@ethersproject/providers";
import { auth } from "../firebase/config";
import axios from "axios";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setUser } from "../state";

declare global {
  interface Window {
    ethereum: ExternalProvider;
  }
}

const METAMASK_BACKEND_URL = "http://localhost:3001/metamask";
const CLIENT_URL = "http://localhost:3000";

export const useAuth = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  console.log(isWalletConnected);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      theme: "dark",
      prompt: "select_account",
    });
    
    // Check if MetaMask/Ethereum provider is available
    if (window.ethereum && typeof window.ethereum.request !== "undefined") {
      try {
        const [userAddress] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setIsWalletConnected(true);
        const address = ethers.utils.getAddress(userAddress);

        const result = await signInWithPopup(auth, provider);
        
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        
        console.log(token);
        console.log(user);

        if (token === null || !token) return;
        
        dispatch(
          setUser({
            user: {
              name: user.displayName || "User",
              avatar:
                user.photoURL ||
                "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
              walletAddress: address,
            },
            token: token,
          })
        );
        navigate("/home");

      } catch (err: any) {
        // Handle both MetaMask request errors and Firebase sign-in errors
        const errorCode = err.code || "AUTH_ERROR";
        const errorMessage = err.message;
        console.error("Google/Metamask Auth Error:", errorCode, errorMessage);
        
        toast.error(`Authentication failed: ${errorMessage.substring(0, 100)}...`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            className: "toast-custom",
        });
      }
    } else {
        toast.warn("MetaMask is not installed. Please install MetaMask to sign-up successfully.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            className: "toast-custom",
        });
    }
  };

  const connectWallet = async (): Promise<void> => {
    try {
      if (window.ethereum && typeof window.ethereum.request !== "undefined") {
        const [userAddress] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setIsWalletConnected(true);
        const address = ethers.utils.getAddress(userAddress);
        handleMetaMaskLogin(address);
      } else {
        toast.warn(
          "MetaMask is not installed. Please install MetaMask to sign-up successfully.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            className: "toast-custom",
          }
        );
      }
    } catch (err) {
      console.error("Failed to connect MetaMask and login:", err);
    }
  };

  const getSiweMessage = async (address: string): Promise<string | void> => {
    try {
      const response = await axios.post(
        `${METAMASK_BACKEND_URL}/message`,
        {
          address,
          domain: window.location.hostname || "localhost",
          uri: window.location.origin || CLIENT_URL,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err: any) {
      toast.error("Failed to authenticate with MetaMask. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "toast-custom",
      });
      if (err.response) console.error(err.response.data);
      else console.error("Error fetching SIWE message:", err.message);
    }
  };

  const signMessage = async (message: string): Promise<string | void> => {
    try {
      // @ts-ignore - window.ethereum is declared global but might need casting
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);

      return signature;
    } catch (error) {
      console.error("Failed to sign message:", error);
      toast.warn("Message signing cancelled or failed.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const verifySignature = async (
    address: string,
    message: string,
    signature: string
  ): Promise<void> => {
    try {
      const response = await axios.post(`${METAMASK_BACKEND_URL}/verify`, {
        message,
        signature,
      });
      if (response.data.success) {
        toast("Successfully authenticated with MetaMask!", {
            position: "top-right",
        });
        dispatch(
          setUser({
            user: {
              name: "Anonymous",
              // NOTE: Use 'walletAddress' to be consistent with handleGoogleAuth payload
              walletAddress: address, 
              avatar: "https://cdn-icons-png.flaticon.com/128/10/10960.png",
            },
            token: "jadfkklakssl",
          })
        );
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        // --- FIX: Replaced alert() with toast.error() ---
        toast.error("Authentication failed! Signature verification failed.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            className: "toast-custom",
        });
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Verification failed due to a network or server error.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleMetaMaskLogin = async (address: string) => {
    try {
      const message = await getSiweMessage(address);
      if (!message) {
        // Error already toasted inside getSiweMessage
        return; 
      }
      const signature = await signMessage(message);
      if (!signature) {
        // Error already toasted inside signMessage
        return;
      }
      await verifySignature(address, message, signature);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return { handleGoogleAuth, connectWallet };
};