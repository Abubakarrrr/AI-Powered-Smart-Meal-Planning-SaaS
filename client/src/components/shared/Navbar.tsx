import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "./AvatarDropdown";
// import { DialogTitle } from "../ui/dialog";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const { user, isAuthenticated } = useAuthStore();

 

  return (
    <nav className="border-b font-primary">
      <div className="flex h-16 items-center justify-between px-2 sm:px-8 lg:px-16">
        <Sheet open={isOpen} onOpenChange={toggleSidebar}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            {/* <VisuallyHidden>
              <DialogTitle>Navigation</DialogTitle>
            </VisuallyHidden> */}
            <MobileNav closeSidebar={toggleSidebar} />{" "}
          </SheetContent>
        </Sheet>
        <div className="mr-4 md:mr-6">
          <Logo />
        </div>
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <DesktopNav />
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          {!user && (
            <div className="flex gap-x-2 items-center">
              <div className="space-x-2 max-sm:hidden">
                <Link to="/login">
                  <Button variant="ghost" className=" md:inline-flex border">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="">Sign up</Button>
                </Link>
              </div>
            </div>
          )}
          {user && <Avatar />}
        </div>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <a href="/" className="flex items-center space-x-2">
      <h1 className="text-2xl font-bold text-primary tracking-wide">EatWise</h1>
    </a>
  );
}

function DesktopNav() {
  const location = useLocation();
  const isActive = (path: any) => location.pathname === path;
  const navigate = useNavigate();
  const handleOpenMealPlanner = () => {
    const today = format(new Date(), "yyyy-MM-dd"); 
    navigate(`/planner/${today}`); 
  };
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link
            to="/"
            className={`${navigationMenuTriggerStyle()} ${
              isActive("/") ? "bg-gray-100" : ""
            }`}
          >
            Home
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/meals" className={navigationMenuTriggerStyle()}>
            Meals
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem onClick={handleOpenMealPlanner} className="hover:cursor-pointer">
          <div className={navigationMenuTriggerStyle()}>
            Planner
          </div>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/contact" className={navigationMenuTriggerStyle()}>
            Contact
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav({ closeSidebar }: any) {
  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <Link to="/" onClick={closeSidebar}>
          <Button variant="ghost" className="w-full justify-start">
            Home
          </Button>
        </Link>
        <Link to="/about" onClick={closeSidebar}>
          <Button variant="ghost" className="w-full justify-start">
            About
          </Button>
        </Link>
        <Link to="/services" onClick={closeSidebar}>
          <Button variant="ghost" className="w-full justify-start">
            Services
          </Button>
        </Link>
        <Link to="/contact" onClick={closeSidebar}>
          <Button variant="ghost" className="w-full justify-start">
            Contact Us
          </Button>
        </Link>
      </div>

      {/* <div className="space-x-4 flex justify-center">
        <Link to="/login" onClick={closeSidebar}>
          <Button variant="ghost" className=" md:inline-flex border">
            Login
          </Button>
        </Link>
        <Link to="/signup" onClick={closeSidebar}>
          <Button>Sign up</Button>
        </Link>
      </div> */}
    </div>
  );
}
