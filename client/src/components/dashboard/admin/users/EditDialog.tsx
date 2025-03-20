import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserData {
  _id?: string; // Optional _id
  name: string;
  email: string;
  role: string;
  password?: string;
  status?: string;
}

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string, userData: UserData) => void; // Fix the type to include both userId and userData
  user: UserData;
}

export function EditDialog({
  isOpen,
  onClose,
  onSubmit,
  user,
}: UserDialogProps) {
  const [userData, setUserData] = useState<UserData>({
    name: user.name,
    email: user.email,
    role: user.role,
    password: user.password || "",
    status: user.status || "", // Handle optional status
  });

  useEffect(() => {
    setUserData(user); // Re-initialize state when user prop changes
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, role, status } = userData;
    const newUserData = {
      name,
      email,
      password,
      role,
      status,
    };
    if (user._id) {
      onSubmit(user._id, newUserData); // Pass both _id and new user data
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name Field (Disabled) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={userData.name}
                disabled
                className="col-span-3"
              />
            </div>

            {/* Email Field (Disabled) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                disabled
                className="col-span-3"
              />
            </div>

            {/* Role Dropdown */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={userData.role}
                onValueChange={(value) =>
                  setUserData({ ...userData, role: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="nutritionist">Nutritionist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Dropdown */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={userData.status}
                onValueChange={(value) =>
                  setUserData({ ...userData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="unblocked">Unblocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Edit user</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
