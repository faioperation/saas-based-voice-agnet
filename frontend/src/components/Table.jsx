"use client";
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Search } from "lucide-react";

export default function Table({ TableHeads, TableRows, headClass, tableClass, emptyState, wrapperClass = "overflow-x-auto" }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);

  // 1. Transform user's TableHeads into TanStack columns
  const columns = React.useMemo(
    () =>
      TableHeads.map((head) => ({
        accessorKey: head.key,
        header: head.Title,
        cell: (info) => {
          if (head.render) {
            return head.render(info.row.original, info.row.index);
          }
          return info.getValue();
        },
        size: head.width,
        enableSorting: head.sortable !== false,
      })),
    [TableHeads]
  );

  // 2. Initialize the table
  const table = useReactTable({
    data: TableRows,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const getPageNumbers = () => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;
    
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    let pages = [0, 1, 2];
    
    if (currentPage > 3 && currentPage < totalPages - 4) {
      pages.push("...");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...");
    } else if (currentPage === 3) {
      pages.push(3, 4, "...");
    } else if (currentPage === totalPages - 4) {
      pages.push("...", totalPages - 5, totalPages - 4);
    } else {
      pages.push("...");
    }

    pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
    
    return pages;
  };

  return (
    <div className={`space-y-4 w-full bg-white shadow-[0_4px_20px_rgba(14,165,233,0.08)] rounded-2xl border border-sky-100 overflow-hidden relative ${wrapperClass}`}>
      <div className={`w-full overflow-x-auto hide-scrollbar`}>
        <table className={`w-full border-collapse ${tableClass}`}>
          {/* ==== TABLE HEADER ==== */}  
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`text-left border-b border-sky-200 bg-sky-50/50 font-semibold text-sky-950 py-4 px-4 ${headClass} select-none`}
                    style={{ width: header.column.columnDef.size }}
                  >
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:text-sky-800 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      
                      {header.column.getCanSort() && (
                        <span className="text-sky-600">
                          {{
                            asc: <ArrowUp size={14} className="text-sky-800" />,
                            desc: <ArrowDown size={14} className="text-sky-800" />,
                          }[header.column.getIsSorted()] ?? <ArrowUpDown size={14} />}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* ==== TABLE BODY ==== */}
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-sky-50 transition-all border-y border-sky-200 last:border-0 group">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="py-5 text-left px-4 text-[15px] font-normal text-sky-950 transition-colors"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  {emptyState ? (
                    emptyState
                  ) : (
                    <div className="py-12 text-center text-sky-700">
                      No data available
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==== PAGINATION CONTROLS ==== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 bg-sky-50/50 border-t border-sky-100">
        <div className="text-sm text-sky-700 text-center sm:text-left">
          Page <span className="font-semibold text-sky-950">{table.getState().pagination.pageIndex + 1}</span> of{" "}
          <span className="font-semibold text-sky-950">{table.getPageCount()}</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
            <button
                className="p-2 sm:p-2.5 rounded-lg border border-sky-300 bg-gray-100 text-sky-700 hover:bg-sky-200 hover:text-sky-950 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1.5">
                {getPageNumbers().map((item, idx) => {
                    if (item === "...") {
                        return (
                            <span key={`ellipsis-${idx}`} className="px-1 text-sky-600">
                                ...
                            </span>
                        );
                    }
                    return (
                        <button
                            key={item}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border text-sm font-medium transition-all ${
                                table.getState().pagination.pageIndex === item
                                    ? "bg-blue-600/20 text-blue-500 border-blue-500/50"
                                    : "bg-gray-100 text-sky-700 border-sky-300 hover:border-sky-500 hover:text-sky-950 hover:bg-sky-200"
                            }`}
                            onClick={() => table.setPageIndex(item)}
                        >
                            {item + 1}
                        </button>
                    );
                })}
            </div>

            <button
                className="p-2 sm:p-2.5 rounded-lg border border-sky-300 bg-gray-100 text-sky-700 hover:bg-sky-200 hover:text-sky-950 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <ChevronRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
}