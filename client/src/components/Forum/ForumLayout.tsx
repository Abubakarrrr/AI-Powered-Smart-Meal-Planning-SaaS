import React from "react";
import { ForumSidebar } from "./ForumSideBar";
import { Toaster } from "@/components/ui/toaster";

const ForumLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="container mx-auto py-6 flex gap-6">
      <aside className="w-64 shrink-0">
        <ForumSidebar />
      </aside>
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  );
};
export default ForumLayout;
