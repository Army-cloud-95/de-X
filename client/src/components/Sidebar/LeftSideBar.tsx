import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { clearUser } from "../../state";
import {
  IoIosChatboxes,
  IoIosHome,
  IoIosMore,
  IoIosPeople,
  IoIosPerson,
  IoIosSearch,
  IoIosNotifications,
} from "react-icons/io";
import { v5 as uuidv5 } from "uuid";
import { createPopper } from "@popperjs/core";
import { FaPlus } from "react-icons/fa";
import UsernameModal from "../Overlay/UsernameModal";
import logo from "../../assets/logo.jpg";

const bannerItems = [
  { name: "Home", icon: <IoIosHome />, route: "/home" },
  { name: "Explore", icon: <IoIosSearch />, route: "/explore" },
  {
    name: "Notifications",
    icon: <IoIosNotifications />,
    route: "/notifications",
  },
  { name: "Messages", icon: <IoIosChatboxes />, route: "/messages" },
  { name: "Communities", icon: <IoIosPeople />, route: "/communities" },
  { name: "Profile", icon: <IoIosPerson />, route: "/profile" },
];

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState("Home");
  const user = useSelector((state: RootState) => state.user);
  const usernameID = localStorage.getItem("userID");

  const [userNameModal, setUserNameModal] = useState(true);
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const [moreDropdownShow, setMoreDropdownShow] = useState(false);

  const btnDropdownRef = useRef<HTMLButtonElement>(null);
  const popoverDropdownRef = useRef<HTMLDivElement>(null);
  const btnMoreRef = useRef<HTMLButtonElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  const address = user?.address;
  const NAMESPACE = process.env.REACT_APP_UUID_NAMESPACE;

  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = bannerItems.find((item) => item.route === currentPath);
    setActivePage(activeItem ? activeItem.name : "Home");
  }, [location.pathname]);

  const generateUserID = (address: any) => {
    if (!NAMESPACE) return;
    if (!address && !usernameID) {
      return (
        <UsernameModal
          isVisible={userNameModal}
          toggleUsernameModal={() => setUserNameModal(!userNameModal)}
        />
      );
    }
    if (usernameID) return;
    const uuid = uuidv5(address, NAMESPACE);
    const userID = `user_${uuid.slice(0, 8)}`;
    localStorage.setItem("userID", userID);
    return userID;
  };

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("userID");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownPopoverShow((prev) => !prev);
  };

  const toggleMoreDropdown = () => {
    setMoreDropdownShow((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverDropdownRef.current &&
      !popoverDropdownRef.current.contains(event.target as Node) &&
      btnDropdownRef.current &&
      !btnDropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownPopoverShow(false);
    }
    if (
      moreDropdownRef.current &&
      !moreDropdownRef.current.contains(event.target as Node) &&
      btnMoreRef.current &&
      !btnMoreRef.current.contains(event.target as Node)
    ) {
      setMoreDropdownShow(false);
    }
  };

  useEffect(() => {
    if (dropdownPopoverShow) {
      createPopper(btnDropdownRef.current!, popoverDropdownRef.current!, {
        placement: "top-end",
        modifiers: [
          { name: "offset", options: { offset: [0, 0] } },
          { name: "preventOverflow", options: { boundary: "viewport" } },
        ],
      });
    }
    if (moreDropdownShow) {
      createPopper(btnMoreRef.current!, moreDropdownRef.current!, {
        placement: "top-end",
        modifiers: [
          { name: "offset", options: { offset: [0, 0] } },
          { name: "preventOverflow", options: { boundary: "viewport" } },
        ],
      });
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownPopoverShow, moreDropdownShow]);

  return (
    <div className="flex flex-col fixed border-r h-screen flex-shrink-0 rounded-xl w-20 lg:w-72 border-slate-700 bg-slate-900">
      <div
        className="flex flex-col p-4 lg:px-6 gap-y-1"
        style={{ fontFamily: "Roboto", fontWeight: 400 }}
      >
       

        {bannerItems.map(({ name, icon, route }) => (
          <button
            key={name}
            onClick={() => {
              setActivePage(name);
              if (route) navigate(route);
            }}
            className={`flex items-center gap-4 text-xl p-3 rounded-full transition-colors ${
              activePage === name
                ? "font-bold"
                : "hover:bg-slate-800"
            }`}
          >
            <span className="text-3xl">{icon}</span>
            <span className="hidden lg:block">{name}</span>
          </button>
        ))}

        <button
          ref={btnMoreRef}
          onClick={toggleMoreDropdown}
          className="flex items-center gap-4 text-xl p-3 rounded-full hover:bg-slate-800 transition-colors"
        >
          <span className="text-3xl">
            <IoIosMore />
          </span>
          <span className="hidden lg:block">More</span>
        </button>

        <div
          ref={moreDropdownRef}
          className={`${
            moreDropdownShow ? "block" : "hidden"
          } absolute bg-slate-800 border border-slate-700 rounded-xl py-2 z-10`}
          style={{
            minWidth: "12rem",
            top: "-20px !important",
            left: "100px !important",
          }}
        >
          <button
            onClick={() => navigate("/bookmarks")}
            className="text-sm py-3 px-4 block w-full text-left hover:bg-slate-700 transition-colors"
          >
            Bookmarks
          </button>
          <button className="text-sm py-3 px-4 block w-full text-left hover:bg-slate-700 transition-colors">
            Help
          </button>
        </div>

        <button
          className="bg-[#345eeb] hover:bg-[#4d6eeb] text-white font-semibold mt-2 p-3 lg:px-20 rounded-full transition-colors"
        >
          <span className="hidden lg:inline">Post</span>
          <span className="lg:hidden text-xl">+</span>
        </button>
      </div>

      <div className="mt-auto p-4 lg:px-6">
        <div className="relative flex items-center gap-3 p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer">
          <img
            src={user?.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full bg-white flex-shrink-0"
          />
          <div className="hidden lg:flex flex-col flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-gray-500 text-sm truncate">
              @{generateUserID(address) || usernameID}
            </p>
          </div>

          <button
            ref={btnDropdownRef}
            onClick={toggleDropdown}
            className="hidden lg:block"
          >
            <IoIosMore className="text-xl" />
          </button>

          <div
            ref={popoverDropdownRef}
            className={`${
              dropdownPopoverShow ? "block" : "hidden"
            } absolute bg-slate-800 border border-slate-700 rounded-xl py-2 z-10`}
            style={{ minWidth: "12rem", bottom: "60px", left: 0 }}
          >
            <button
              className="text-sm py-3 px-4 block w-full text-left hover:bg-slate-700 transition-colors"
              onClick={handleLogout}
            >
              Log out @{usernameID}
            </button>
            <div className="border-t border-slate-700 my-1" />
            <button className="flex items-center justify-between w-full py-3 px-4 text-sm hover:bg-slate-700 transition-colors">
              <span>Add an existing account</span>
              <FaPlus className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;