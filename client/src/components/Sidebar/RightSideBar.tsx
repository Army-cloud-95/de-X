import { useSelector } from "react-redux";
import { RootState } from "../../store";

const RightSideBar = () => {
  const user = useSelector((state: RootState) => state.user);
  const userID = localStorage.getItem("userID");
  
  if (!userID) return null;

  const suggestions = Array(4).fill({
    avatar: user?.avatar,
    name: user?.name,
    userID: userID,
  });

  return (
    <div className="fixed ml-6 rounded-xl border border-slate-700 w-full h-screen p-4 bg-slate-900 ">

        <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Poppins" }}>
          You might like
        </h2>
        
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              style={{ fontFamily: "Roboto" }}
            >
              <img
                src={suggestion.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full bg-white flex-shrink-0"
              />
              <div className="hidden lg:flex flex-col min-w-0 flex-1">
                <p className="font-semibold text-white truncate">{suggestion.name}</p>
                <p className="text-sm text-gray-500 truncate">@{suggestion.userID}</p>
              </div>
              <button className="hidden lg:block ml-auto px-4 py-1.5 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition-colors flex-shrink-0">
                Follow
              </button>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 text-[#345eeb] text-sm font-medium hover:underline text-left">
          Show more
        </button>
      
    </div>
  );
};

export default RightSideBar;