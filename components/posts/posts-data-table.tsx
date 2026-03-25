"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { IPost } from "@/lib/models/post";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const helper = createColumnHelper<IPost>();

const STATUS_OPTIONS = ["All", "published", "draft"] as const;
const CATEGORY_OPTIONS = [
  "All",
  "Lifestyle",
  "Travel",
  "Style",
  "Wellness",
  "Food",
  "Mindfulness",
  "Culture",
  "Personal",
];

interface PostsDataTableProps {
  posts: IPost[];
  showPagination?: boolean;
}

export default function PostsDataTable({ posts, showPagination = true }: PostsDataTableProps) {
  const router = useRouter();
  const [data, setData] = useState<IPost[]>(posts);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleDelete = useCallback(async (post: IPost) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeletingId(post._id);
    try {
      const res = await fetch(`/api/posts/${post.slug}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => prev.filter((p) => p._id !== post._id));
        startTransition(() => router.refresh());
      }
    } finally {
      setDeletingId(null);
    }
  }, [router]);

  const columns = [
    helper.accessor("title", {
      header: ({ column }) => (
        <SortableHeader column={column} label="Content" />
      ),
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="flex items-center gap-4">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-surface-container"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-surface-container flex-shrink-0" />
            )}
            <div className="max-w-xs min-w-0">
              <p className="font-semibold text-on-surface group-hover:text-primary transition-colors text-sm truncate">
                {post.title}
              </p>
              {post.excerpt && (
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        );
      },
    }),
    helper.accessor("category", {
      header: ({ column }) => <SortableHeader column={column} label="Category" />,
      cell: ({ getValue }) => (
        <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
          {getValue()}
        </span>
      ),
    }),
    helper.accessor("status", {
      header: ({ column }) => <SortableHeader column={column} label="Status" />,
      cell: ({ getValue }) => {
        const s = getValue() ?? "draft";
        const published = s === "published";
        return (
          <div className={cn("flex items-center gap-2 font-bold text-xs", published ? "text-emerald-600" : "text-amber-600")}>
            <span className={cn("w-1.5 h-1.5 rounded-full", published ? "bg-emerald-500" : "bg-amber-500")} />
            <span className="capitalize">{s}</span>
          </div>
        );
      },
    }),
    helper.accessor("publishedAt", {
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      cell: ({ row }) => {
        const post = row.original;
        return (
          <span className="text-sm text-on-surface-variant whitespace-nowrap">
            {post.status === "published" ? formatDate(post.publishedAt) : "—"}
          </span>
        );
      },
    }),
    helper.accessor("views", {
      header: ({ column }) => <SortableHeader column={column} label="Views" />,
      cell: ({ getValue }) => {
        const v = getValue() ?? 0;
        return (
          <span className="text-sm font-bold text-on-surface">
            {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
          </span>
        );
      },
    }),
    helper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Link
              href={`/posts/${post.slug}/edit`}
              className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-white transition-all"
            >
              <Edit size={15} />
            </Link>
            <button
              onClick={() => handleDelete(post)}
              disabled={deletingId === post._id}
              className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-white transition-all disabled:opacity-40"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      },
    }),
  ];

  // Apply status + category filters on top of globalFilter
  const filteredData = data.filter((p) => {
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
    return true;
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-surface-container-low p-3 rounded-2xl flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/60"
            placeholder="Search posts..."
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-surface-container-lowest border-none rounded-xl text-xs font-bold uppercase tracking-wider py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-container-lowest border-none rounded-xl text-xs font-bold uppercase tracking-wider py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <span className="text-xs text-on-surface-variant ml-auto">
          {table.getFilteredRowModel().rows.length} posts
        </span>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="bg-surface-container/50 border-b border-outline-variant/10">
                  {hg.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] font-extrabold text-on-surface-variant whitespace-nowrap">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center text-on-surface-variant text-sm">
                    No posts found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="group hover:bg-surface-container-low/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {showPagination && table.getPageCount() > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                const page = i;
                const current = table.getState().pagination.pageIndex;
                return (
                  <button
                    key={page}
                    onClick={() => table.setPageIndex(page)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-bold transition-colors",
                      current === page
                        ? "bg-primary text-on-primary"
                        : "text-on-surface-variant hover:bg-surface-container"
                    )}
                  >
                    {page + 1}
                  </button>
                );
              })}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableHeader({ column, label }: { column: any; label: string }) {
  const sorted = column.getIsSorted();
  return (
    <button
      className="flex items-center gap-1 hover:text-on-surface transition-colors group"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUp size={12} className="text-primary" />
      ) : sorted === "desc" ? (
        <ArrowDown size={12} className="text-primary" />
      ) : (
        <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
      )}
    </button>
  );
}
