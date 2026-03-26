"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Posts", href: "/posts", icon: FileText },
  { label: "New Post", href: "/posts/new", icon: PenSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-surface-container h-screen w-64 fixed left-0 top-0 z-50 overflow-hidden flex flex-col py-8 items-center">
      {/* Logo */}
      <div className="mb-12 flex items-center px-6 w-full">
        <div className="min-w-[32px] h-10 flex items-center justify-center">
          <img src="/favicon.ico" alt="Preeti Admin" className="w-8 h-8 rounded-lg flex-shrink-0" />
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

      </nav>
    </aside>
  );
}
