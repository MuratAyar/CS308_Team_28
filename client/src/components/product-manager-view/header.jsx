import React from "react";
import { House } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    localStorage.removeItem('authToken');
    await dispatch(logoutUserAction()); // if using Redux
    navigate('/auth/login');
  };  
  

  return (
    <div className="flex items-center gap-4">
      {/* Conditional User Controls */}
      {user ? (
        // Displayed if user is logged in
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black cursor-pointer">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user.userName?.[0]?.toUpperCase() || "G"} {/* Safely access userName */}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>
              Logged in as {user.userName || "Guest"} {/* Fallback for userName */}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // Displayed if user is not logged in
        <button
          onClick={() => navigate("/auth/login")}
          className="text-black underline"
        >
          Login
        </button>
      )}
    </div>
  );
}

function ManagerHeader() {
  return (
    <header className="fixed top-0 z-40 w-full bg-background border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 w-full">
        {/* Logo or Home Link */}
        <div className="flex items-center gap-2 text-black">
          <Link to="/shop/home" className="flex items-center gap-2 text-black">
            <House className="h-6 w-6 text-black" />
            <span className="font-bold">twoeight</span>
          </Link>
        </div>

        {/* Right Section: Avatar */}
        <div className="flex items-center">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ManagerHeader;
