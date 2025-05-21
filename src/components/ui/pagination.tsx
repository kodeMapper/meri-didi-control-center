
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // If we have fewer than maxPagesToShow pages, show them all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Determine start and end of the middle section
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust to show 3 pages in the middle
      if (startPage === 2) {
        endPage = Math.min(totalPages - 1, startPage + 2);
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(2, endPage - 2);
      }

      // Show ellipsis after first page if needed
      if (startPage > 2) {
        pages.push(-1); // use -1 as a marker for ellipsis
      } else if (startPage === 2) {
        pages.push(2);
      }

      // Add the middle pages
      for (let i = startPage; i <= endPage; i++) {
        // Avoid duplicates
        if (i !== 1 && i !== totalPages && !pages.includes(i)) {
          pages.push(i);
        }
      }

      // Show ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push(-2); // use -2 as a marker for another ellipsis
      } else if (endPage === totalPages - 1) {
        pages.push(totalPages - 1);
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="text-sm text-gray-500">
        Showing {Math.min(1 + (currentPage - 1) * itemsPerPage, totalItems)} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
      </div>
      <nav className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Page</span>
        </Button>

        {pageNumbers.map((page, i) => {
          if (page === -1 || page === -2) {
            return (
              <Button
                key={`ellipsis-${i}`}
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-default"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More Pages</span>
              </Button>
            );
          }

          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Page</span>
        </Button>
      </nav>
    </div>
  );
}
