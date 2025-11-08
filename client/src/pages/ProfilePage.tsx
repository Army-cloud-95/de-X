import { useState } from "react";
import googlelogo from "../assets/google.png";
import metamasklogo from "../assets/metamask.png";
import RegisterModal from "../components/Overlay/RegisterModal";
import LoginModal from "../components/Overlay/LoginModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { handleGoogleAuth, connectWallet } = useAuth();
  localStorage.setItem("userID", "");
  const [registerModal, setRegisterModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  const toggleRegisterModal = () => {
    setRegisterModal(!registerModal);
  };

  const toggleLoginModal = () => {
    setLoginModal(!loginModal);
  };

  return (
    <>
      {registerModal && (
        <RegisterModal
          toggleRegisterModal={toggleRegisterModal}
          isVisible={registerModal}
        />
      )}
      {loginModal && (
        <LoginModal
          toggleLoginModal={toggleLoginModal}
          isVisible={loginModal}
        />
      )}
      <div className="w-full h-screen bg-slate-900 flex items-center justify-center p-4">
        <ToastContainer theme="dark" position="top-right" />
        
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1
              className="text-5xl md:text-6xl font-bold mb-4"
              style={{ fontFamily: "Bebas Neue" }}
            >
              Decentralize your voice
            </h1>
            <p
              className="text-2xl text-gray-300"
              style={{ fontFamily: "Prompt", fontWeight: 600 }}
            >
              Get started today
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleAuth}
              className="w-full bg-white hover:bg-gray-100 text-black font-semibold p-3 rounded-full flex items-center justify-center gap-3 transition-colors"
              style={{ fontFamily: "Poppins" }}
            >
              <img src={googlelogo} width={20} alt="google" />
              Sign up with Google
            </button>

            <button
              onClick={connectWallet}
              className="w-full bg-white hover:bg-gray-100 text-black font-semibold p-3 rounded-full flex items-center justify-center gap-3 transition-colors"
              style={{ fontFamily: "Poppins" }}
            >
              <img src={metamasklogo} width={20} alt="metamask" />
              Sign up with MetaMask
            </button>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 border-t border-slate-700"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-slate-700"></div>
            </div>

            <button
              className="w-full bg-[#345eeb] hover:bg-[#4d6eeb] text-white font-semibold p-3 rounded-full transition-colors"
              onClick={toggleRegisterModal}
              style={{ fontFamily: "Poppins" }}
            >
              Create account
            </button>

            <p className="text-center text-sm text-gray-400 mt-6" style={{ fontFamily: "Poppins" }}>
              Already have an account?{" "}
              <button
                onClick={toggleLoginModal}
                className="text-[#345eeb] hover:underline font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center mt-8" style={{ fontFamily: "Poppins" }}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;