"use client"

import { type ChangeEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../../state"

interface UserData {
  email: string
  password: string
}

const LoginModal = ({
  toggleLoginModal,
  isVisible,
}: {
  toggleLoginModal: () => void
  isVisible: boolean
}) => {
  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleFieldChange = (field: keyof UserData) => (event: ChangeEvent<HTMLInputElement>) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: event.target.value,
    }))
  }

  const handleLogin = async (userData: UserData) => {
    try {
      const response = await fetch("http://localhost:3001/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Failed to login")
      }

      const loggedIn = await response.json()

      const userResponse = await fetch("http://localhost:3001/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedIn.access_token}`,
        },
      })

      const loggedInUser = await userResponse.json()

      console.log(loggedInUser)
      dispatch(
        setUser({
          user: {
            name: `${loggedInUser.firstName} ${loggedInUser.lastName}` || "User",
            avatar: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
          },
          token: loggedIn.access_token,
        }),
      )
      navigate("/home")
    } catch (err) {
      console.error(err)
    }
  }

  const handleLoginClick = async () => {
    await handleLogin(userData)
  }

  return (
    <div
      className={`${
        isVisible ? "animate-fade-in" : "hidden"
      } fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm`}
    >
      <div
        className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/20 p-8 md:p-10 max-w-sm min-w-[320px] rounded-2xl shadow-2xl transition-all duration-300 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div
          className="absolute top-4 right-4 p-2 cursor-pointer hover:bg-cyan-500/10 rounded-lg transition duration-200 text-gray-400 hover:text-cyan-400"
          onClick={toggleLoginModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold py-4 pb-8 text-white" style={{ fontFamily: "Prompt" }}>
          Sign in Now
        </h1>

        <div className="flex flex-col gap-4 pb-8">
          <input
            type="email"
            className="bg-slate-800/50 p-3 border border-slate-600 hover:border-cyan-500/50 focus:border-cyan-500 rounded-lg text-white placeholder:text-slate-500 focus:outline-none transition duration-200"
            placeholder="Email Address"
            onChange={handleFieldChange("email")}
          />
          <input
            type="password"
            className="bg-slate-800/50 p-3 border border-slate-600 hover:border-cyan-500/50 focus:border-cyan-500 rounded-lg text-white placeholder:text-slate-500 focus:outline-none transition duration-200"
            placeholder="Password"
            onChange={handleFieldChange("password")}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleLoginClick}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold p-3 px-12 rounded-full transition duration-300 ease-in-out shadow-lg hover:shadow-cyan-500/50"
            style={{ fontFamily: "Poppins" }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
