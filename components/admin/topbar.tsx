"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, PenSquare, LogOut, AlertCircle, X } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/posts": "Posts",
  "/posts/new": "New Post",
  "/media": "Media",
  "/settings": "Settings",
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function confirmLogout() {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

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
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-sm font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <PenSquare size={15} />
            Write New Post
          </Link>

          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-sm">
            P
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container transition-all"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dropdown */}
      {showLogoutConfirm && (
        <div className="absolute top-20 right-8 bg-surface-container rounded-xl p-4 shadow-lg z-50 w-72">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-error/20 flex items-center justify-center">
              <AlertCircle size={20} className="text-error" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-on-surface">Sign Out?</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Are you sure you want to sign out from your workspace?
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 px-3 py-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              disabled={isLoggingOut}
              className="flex-1 px-3 py-2 rounded-lg bg-error text-on-error hover:opacity-90 disabled:opacity-60 transition-all font-semibold text-xs"
            >
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
