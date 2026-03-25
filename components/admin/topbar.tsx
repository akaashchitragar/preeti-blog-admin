"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, PenSquare, Sparkles } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/posts": "Posts",
  "/posts/new": "New Post",
  "/media": "Media",
  "/settings": "Settings",
};

export default function Topbar() {
  const pathname = usePathname();

  const title =
    Object.entries(pageTitles).find(([path]) =>
      pathname === path || (path !== "/dashboard" && pathname.startsWith(path))
    )?.[1] ?? "Admin";

  return (
    <header className="bg-surface/80 backdrop-blur-xl fixed top-0 right-0 left-64 z-40 h-16 shadow-sm shadow-outline-variant/20 border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-8 h-full w-full">
        {/* Left: page title + search */}
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-bold text-on-surface tracking-tight">{title}</h2>
          <div className="hidden lg:flex items-center bg-surface-container rounded-full px-4 py-2 w-80">
            <Search size={16} className="text-on-surface-variant mr-2 flex-shrink-0" />
            <input
              className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-on-surface-variant/60"
              placeholder="Search posts, media..."
            />
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/posts/new"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-primary hover:bg-surface-container transition-all text-sm font-medium"
          >
            <Sparkles size={16} />
            Generate with AI
          </Link>
          <Link
            href="/posts/new"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-sm font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <PenSquare size={15} />
            Write New Post
          </Link>

          <div className="h-6 w-px bg-outline-variant/20" />

          <button className="relative p-1.5 text-on-surface-variant hover:text-on-surface transition-colors">
            <Bell size={20} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface" />
          </button>

          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-sm cursor-pointer">
            P
          </div>
        </div>
      </div>
    </header>
  );
}
