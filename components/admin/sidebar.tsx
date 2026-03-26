"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Image,
  Settings,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Posts", href: "/posts", icon: FileText },
  { label: "New Post", href: "/posts/new", icon: PenSquare },
  { label: "Media", href: "/media", icon: Image },
];

const bottomLinks = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-surface-container h-screen w-64 fixed left-0 top-0 z-50 overflow-hidden flex flex-col py-8 items-center">
      {/* Logo */}
      <div className="mb-12 flex items-center px-6 w-full">
        <div className="min-w-[32px] h-10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            <BookOpen size={16} />
          </div>
        </div>
        <div className="opacity-100 ml-4 whitespace-nowrap overflow-hidden">
          <h1 className="text-sm font-bold text-on-surface uppercase tracking-widest leading-tight">
            Preeti Admin
          </h1>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter mt-0.5">
            Editorial Workspace
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 w-full space-y-1 px-3">
        {navLinks.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" &&
              href !== "/posts" &&
              pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center w-full h-11 px-3 rounded-lg transition-all duration-150 active:scale-95",
                isActive
                  ? "text-primary font-semibold border-r-4 border-primary bg-surface-container-high"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              )}
            >
              <Icon size={20} className="min-w-[20px]" />
              <span className="ml-3 opacity-100 text-sm whitespace-nowrap">
                {label}
              </span>
            </Link>
          );
        })}

        <div className="pt-6 mt-6 border-t border-outline-variant/20">
          {bottomLinks.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center w-full h-11 px-3 rounded-lg transition-all duration-150",
                  isActive
                    ? "text-primary font-semibold bg-surface-container-high"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                )}
              >
                <Icon size={20} className="min-w-[20px]" />
                <span className="ml-3 opacity-100 text-sm whitespace-nowrap">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
