"use client"

import { useState, useEffect } from "react"
import googlelogo from "../assets/google.png"
import metamasklogo from "../assets/metamask.png"
import RegisterModal from "../components/Overlay/RegisterModal"
import LoginModal from "../components/Overlay/LoginModal"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../hooks/useAuth"

type ButtonType = string | null

const LoginPage = () => {
  const { handleGoogleAuth, connectWallet } = useAuth()
  const [registerModal, setRegisterModal] = useState(false)
  const [loginModal, setLoginModal] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [activeButton, setActiveButton] = useState<ButtonType>(null)

  useEffect(() => {
    localStorage.setItem("userID", "")

    // Fade-in animation on load
    setTimeout(() => {
      setLoaded(true)
    }, 300)

    return () => {}
  }, [])

  const toggleRegisterModal = () => {
    setRegisterModal(!registerModal)
  }

  const toggleLoginModal = () => {
    setLoginModal(!loginModal)
  }

  const handleButtonHover = (button: ButtonType) => {
    setActiveButton(button)
  }

  const resetButtonHover = () => {
    setActiveButton(null)
  }

  return (
    <>
      {registerModal && <RegisterModal toggleRegisterModal={toggleRegisterModal} isVisible={registerModal} />}
      {loginModal && <LoginModal toggleLoginModal={toggleLoginModal} isVisible={loginModal} />}

      <div
        className={`w-full min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-all duration-1000`}
      >
        <ToastContainer bodyClassName={() => "text-sm font-medium block p-3 bg-gray-900 border-l-4 border-cyan-500"} />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Grid */}
          <div className="absolute inset-0 animated-grid"></div>

          {/* Free Speech Animation */}
          <div className="speech-container">
            <div className="speech-bubble speech-1">Free Speech</div>
            <div className="speech-bubble speech-2">Decentralized Voice</div>
            <div className="speech-bubble speech-3">Be Heard</div>
            <div className="speech-bubble speech-4">Express Freely</div>
            <div className="speech-bubble speech-5">Power to People</div>
            <div className="speech-bubble speech-6">Uncensored</div>
            <div className="speech-bubble speech-7">Your Voice Matters</div>
          </div>

          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse-slower"></div>
        </div>

        <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-12 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                DECENTRALIZED-X
              </h1>
              <p className="text-lg text-gray-300 font-medium">Your Voice, Your Power</p>
              <p className="text-sm text-gray-400 mt-2">Free speech on the blockchain</p>
            </div>

            <div className="animate-slideUp" style={{ animationDelay: "0.6s" }}>
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl hover:border-cyan-500/30 transition-all duration-300">
                <div className="relative z-10 space-y-4">
                  {/* Google Auth */}
                  <button
                    onClick={handleGoogleAuth}
                    onMouseEnter={() => handleButtonHover("google")}
                    onMouseLeave={resetButtonHover}
                    className={`w-full bg-slate-700/50 hover:bg-slate-600/70 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 border border-slate-600/50 hover:border-cyan-500/50 ${
                      activeButton === "google" ? "neon-glow-cyan" : ""
                    } animate-fadeIn`}
                    style={{ animationDelay: "0.9s" }}
                  >
                    <img src={googlelogo || "/placeholder.svg"} width={20} alt="google" />
                    <span className="font-medium">Continue with Google</span>
                  </button>

                  {/* MetaMask Auth */}
                  <button
                    onClick={connectWallet}
                    onMouseEnter={() => handleButtonHover("metamask")}
                    onMouseLeave={resetButtonHover}
                    className={`w-full bg-slate-700/50 hover:bg-slate-600/70 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 border border-slate-600/50 hover:border-purple-500/50 ${
                      activeButton === "metamask" ? "neon-glow-purple" : ""
                    } animate-fadeIn`}
                    style={{ animationDelay: "1.1s" }}
                  >
                    <img src={metamasklogo || "/placeholder.svg"} width={20} alt="metamask" />
                    <span className="font-medium">Connect Wallet</span>
                  </button>

                  {/* Divider */}
                  <div className="relative my-6 animate-fadeIn" style={{ animationDelay: "1.3s" }}>
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600/50"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-slate-800/50 px-3 text-xs text-gray-400 uppercase tracking-wider">or</span>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    onClick={toggleRegisterModal}
                    onMouseEnter={() => handleButtonHover("register")}
                    onMouseLeave={resetButtonHover}
                    className={`w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      activeButton === "register" ? "neon-glow-multi shadow-lg" : ""
                    } animate-fadeIn`}
                    style={{ animationDelay: "1.5s" }}
                  >
                    Create Account
                  </button>

                  {/* Sign In Link */}
                  <p
                    className="text-center text-gray-400 pt-2 text-sm animate-fadeIn"
                    style={{ animationDelay: "1.7s" }}
                  >
                    Already registered?{" "}
                    <button
                      onClick={toggleLoginModal}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold relative group focus:outline-none"
                    >
                      Sign in
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </button>
                  </p>
                </div>
              </div>
            </div>

            <div
              className="text-center mt-12 text-xs text-gray-500 space-y-2 animate-fadeIn"
              style={{ animationDelay: "1.9s" }}
            >
              <p>Secure • Decentralized • Censorship-Resistant</p>
              <p>Join the revolution in free speech</p>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
        /* Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Outfit', sans-serif;
        }
        
        /* Neon glow effects for buttons */
        .neon-glow-cyan {
          box-shadow: 0 0 5px rgba(6, 182, 212, 0.7),
                     0 0 10px rgba(6, 182, 212, 0.4);
        }
        
        .neon-glow-purple {
          box-shadow: 0 0 5px rgba(147, 51, 234, 0.7),
                     0 0 10px rgba(147, 51, 234, 0.4);
        }
        
        .neon-glow-multi {
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.7),
                     0 0 20px rgba(147, 51, 234, 0.4);
        }
        
        /* Animated Grid */
        .animated-grid {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
          animation: grid-move 20s linear infinite;
          transform-origin: center;
          perspective: 1000px;
        }
        
        @keyframes grid-move {
          0% {
            background-position: 0px 0px;
            transform: rotateX(10deg) scale(1.5);
          }
          50% {
            background-position: 25px 25px;
            transform: rotateX(20deg) scale(1.8);
          }
          100% {
            background-position: 50px 50px;
            transform: rotateX(10deg) scale(1.5);
          }
        }
        
        /* Free Speech Animation */
        .speech-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        
        .speech-bubble {
          position: absolute;
          color: rgba(6, 182, 212, 0.15);
          font-weight: bold;
          font-size: 24px;
          white-space: nowrap;
          text-transform: uppercase;
          opacity: 0;
          animation: float-up 15s linear infinite;
        }
        
        .speech-1 {
          left: 10%;
          bottom: -50px;
          animation-delay: 0s;
        }
        
        .speech-2 {
          left: 25%;
          bottom: -50px;
          animation-delay: 4s;
          color: rgba(147, 51, 234, 0.15);
        }
        
        .speech-3 {
          left: 45%;
          bottom: -50px;
          animation-delay: 7s;
        }
        
        .speech-4 {
          left: 65%;
          bottom: -50px;
          animation-delay: 10s;
          color: rgba(147, 51, 234, 0.15);
        }
        
        .speech-5 {
          left: 80%;
          bottom: -50px;
          animation-delay: 5s;
        }
        
        .speech-6 {
          left: 15%;
          bottom: -50px;
          animation-delay: 8s;
          color: rgba(147, 51, 234, 0.15);
        }
        
        .speech-7 {
          left: 60%;
          bottom: -50px;
          animation-delay: 12s;
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
        
        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        `}
      </style>
    </>
  )
}

export default LoginPage
