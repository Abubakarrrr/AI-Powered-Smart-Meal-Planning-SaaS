import { useEffect, useState } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAddDialog } from "./AddDialog";
import { EditDialog } from "./EditDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BASE_URL = import.meta.env.VITE_API_URL;

interface UserData {
  _id?: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  password?: string;
  status?: string;
}

export default function UserManagementDashboard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/v1/get-all-users`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data.data.users);
    } catch (error) {
      console.error("Error fetching users:", (error as Error).message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (userData: UserData) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/v1/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add user");
      setUsers([...users, result.data.user]);
    } catch (error) {
      console.error("Error adding user:", (error as Error).message);
    }
  };

  const updateUser = async (userId: string, updatedData: UserData) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/v1/update-user/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update user");
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, ...updatedData } : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", (error as Error).message);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/v1/delete-user/${userId}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete user");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", (error as Error).message);
    }
  };

  const openAddDialog = () => {
    setCurrentUser(null);
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (user: UserData) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={openAddDialog}>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteUser(user._id || "")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add User Dialog */}
      <UserAddDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={addUser}
      />

      {/* Edit User Dialog */}
      {currentUser && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={updateUser}
          user={currentUser}
        />
      )}
    </div>
  );
}
