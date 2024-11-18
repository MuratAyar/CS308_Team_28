import { User, House, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";


function MenuItems() {

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}


function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }


  if (!user) {
    // Fallback content when user is null or undefined
    return (
      <Button
        onClick={() => navigate("/auth/login")}
        variant="outline"
        className="flex items-center gap-2"
      >
        <User className="w-6 h-6" />
        Login
      </Button>
    );
  }

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Button variant="outline" size="icon">
        <ShoppingCart className="w-6 h-6 " />
        <span className="sr-only">User cart</span>
      </Button>

      {user ? (
        // Displayed if user is logged in
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black">
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
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // Displayed if user is not logged in
        <Button
          onClick={() => navigate("/auth/login")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <User className="w-6 h-6" />
          Login
        </Button>
      )}
    </div>
  );
}


function ShoppingHeader() {
  return (
    <header className="fixed top-0 z-40 w-full bg-background border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 w-full">
        
        {/* Logo or Home Link */}
        <div className="flex-1">
          <Link to="/shop/home" className="flex items-center gap-2 text-black">
            <House className="h-6 w-6 text-black" />
            <span className="font-bold">twoeight</span>
          </Link>
        </div>

        {/* Menu button for smaller screens */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          
          {/* Sheet content for smaller screens */}
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* Menu items for larger screens */}
        <div className="hidden lg:flex items-center flex-grow">
          <MenuItems />
        </div>

        {/* Right Section: Shopping cart and avatar icons */}
        <div className="hidden lg:flex items-center ml-auto">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;