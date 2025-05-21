
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | null)[] = [];
    
    // Always show first page
    if (totalPages > 0) {
      pageNumbers.push(1);
    }
    
    // Calculate the range of pages to show around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push(null); // represents ellipsis
    }
    
    // Add pages in the range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1 && totalPages > 1) {
      pageNumbers.push(null); // represents ellipsis
    }
    
    // Always show last page if different from first page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="text-sm text-muted-foreground">
        Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="hidden sm:inline-flex"
        >
          Previous
        </Button>
        
        <div className="flex items-center">
          {getPageNumbers().map((pageNumber, i) => {
            if (pageNumber === null) {
              // Render ellipsis
              return (
                <span 
                  key={`ellipsis-${i}`} 
                  className="px-2 text-gray-400"
                >
                  ...
                </span>
              );
            }
            
            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className="w-8 h-8 p-0"
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="hidden sm:inline-flex"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
