"use client"

import { type ChangeEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setUser } from "../../state"

interface UserData {
  firstName: string
  lastName: string
  email: string
  password: string
}

const RegisterModal = ({
  toggleRegisterModal,
  isVisible,
}: {
  toggleRegisterModal: () => void
  isVisible: boolean
}) => {
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleFieldChange = (field: keyof UserData) => (event: ChangeEvent<HTMLInputElement>) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: event.target.value,
    }))
    if (error) setError("")
  }

  const handleRegister = async (userData: UserData) => {
    try {
      setIsLoading(true)
      const response = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Failed to register")
      }

      const registered = await response.json()

      const userResponse = await fetch("http://localhost:3001/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${registered.access_token}`,
        },
      })

      const registeredUser = await userResponse.json()

      console.log(registeredUser)
      dispatch(
        setUser({
          user: {
            name: `${registeredUser.firstName} ${registeredUser.lastName}` || "User",
            avatar: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
          },
          token: registered.access_token,
        }),
      )
      navigate("/home")
    } catch (err) {
      console.log(err)
      setError(err instanceof Error ? err.message : "Registration failed")
      setIsLoading(false)
    }
  }

  const handleRegisterClick = async () => {
    await handleRegister(userData)
  }

  return (
    <div
      className={`${
        isVisible ? "animate-fade-in" : "hidden"
      } fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/50 transition-all duration-300`}
    >
      <div
        className={`relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl shadow-cyan-500/20 p-8 md:p-10 max-w-lg min-w-[340px] leading-relaxed transition-all duration-300 ease-in-out transform rounded-2xl border border-slate-700/50 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div
          className="p-2 absolute top-4 right-4 cursor-pointer hover:bg-red-600/20 hover:text-red-400 text-slate-400 transition duration-300 ease-in-out rounded-lg"
          onClick={toggleRegisterModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        </div>

        <h1
          className="text-4xl font-bold py-3 pb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
          style={{ fontFamily: "Prompt", fontWeight: 600 }}
        >
          Create Account
        </h1>
        <p className="text-slate-400 text-sm mb-6">Join the decentralized network</p>

        {error && (
          <div className="mb-5 p-3 bg-red-600/10 border border-red-600/50 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        <div className="flex flex-row gap-4 mb-5">
          <input
            className="bg-slate-800/50 p-3 border border-slate-600/50 w-full rounded-lg shadow-sm shadow-slate-900/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition duration-300 text-slate-100 placeholder-slate-500"
            placeholder="First Name"
            onChange={handleFieldChange("firstName")}
            disabled={isLoading}
          />
          <input
            className="bg-slate-800/50 p-3 border border-slate-600/50 w-full rounded-lg shadow-sm shadow-slate-900/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition duration-300 text-slate-100 placeholder-slate-500"
            placeholder="Last Name"
            onChange={handleFieldChange("lastName")}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-y-4 pb-8">
          <div className="relative">
            <input
              type="email"
              className="bg-slate-800/50 p-3 pl-10 border border-slate-600/50 w-full rounded-lg shadow-sm shadow-slate-900/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition duration-300 text-slate-100 placeholder-slate-500"
              placeholder="Email Address"
              onChange={handleFieldChange("email")}
              disabled={isLoading}
            />
            <svg
              className="absolute left-3 top-3.5 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="relative">
            <input
              type="password"
              className="bg-slate-800/50 p-3 pl-10 border border-slate-600/50 w-full rounded-lg shadow-sm shadow-slate-900/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition duration-300 text-slate-100 placeholder-slate-500"
              placeholder="Password"
              onChange={handleFieldChange("password")}
              disabled={isLoading}
            />
            <svg
              className="absolute left-3 top-3.5 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleRegisterClick}
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition duration-300 ease-in-out text-white p-3 px-12 rounded-full flex items-center justify-center gap-2 font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-sm" style={{ fontFamily: "Poppins", fontWeight: 500 }}>
                  Creating Account...
                </span>
              </>
            ) : (
              <>
                <span className="text-sm" style={{ fontFamily: "Poppins", fontWeight: 500 }}>
                  Create Account
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal
