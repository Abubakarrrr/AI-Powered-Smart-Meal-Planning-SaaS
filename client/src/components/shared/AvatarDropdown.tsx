import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function AvatarDropdown() {
  const { user, clearAuth } = useAuthStore();
  const { toast } = useToast();
  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/v1/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast({
          title: "Logout successfully",
          description: "",
        });
        clearAuth();
      } else {
        toast({
          title: "Error logging out",
          description: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Logout failed",
        description: "",
      });
    }
  };
  // const dashboardLink =
  //   user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.avatar} alt="@shadcn" />
          <AvatarFallback>
            {" "}
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuItem>
          <Link to="">Dashboard</Link>
        </DropdownMenuItem> */}
        <Link to="/profile">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
