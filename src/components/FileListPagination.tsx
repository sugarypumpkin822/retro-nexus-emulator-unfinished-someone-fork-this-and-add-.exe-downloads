
import React, { useState, useEffect } from 'react';
import { SetupFile } from '@/utils/setupTypes';
import { paginateItems, getPaginationState, defaultPaginationState } from '@/utils/packageGenerator/packageBuilder';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Check, Download, Loader2, X } from 'lucide-react';

interface FileListPaginationProps {
  files: SetupFile[];
  itemsPerPage?: number;
  onFileAction?: (file: SetupFile, index: number) => void;
  isProcessingFile?: boolean;
  currentFileIndex?: number;
}

const FileListPagination: React.FC<FileListPaginationProps> = ({
  files,
  itemsPerPage = 10,
  onFileAction,
  isProcessingFile,
  currentFileIndex
}) => {
  const [pagination, setPagination] = useState(defaultPaginationState);
  const [paginatedFiles, setPaginatedFiles] = useState<SetupFile[]>([]);
  
  // Initialize pagination
  useEffect(() => {
    const newPagination = getPaginationState(files, 1, itemsPerPage);
    setPagination(newPagination);
    setPaginatedFiles(paginateItems(files, 1, itemsPerPage));
  }, [files, itemsPerPage]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    
    const newPagination = { ...pagination, currentPage: page };
    setPagination(newPagination);
    setPaginatedFiles(paginateItems(files, page, itemsPerPage));
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];
    const { currentPage, totalPages } = pagination;
    
    // Always show first page, last page, current page, and 1 page before/after current
    const pageRange = new Set<number>();
    pageRange.add(1); // First page
    pageRange.add(totalPages); // Last page
    pageRange.add(currentPage); // Current page
    
    if (currentPage > 1) pageRange.add(currentPage - 1);
    if (currentPage < totalPages) pageRange.add(currentPage + 1);
    
    // Convert to array and sort
    return Array.from(pageRange).sort((a, b) => a - b);
  };
  
  // Get file status icon
  const getFileStatusIcon = (file: SetupFile, index: number) => {
    const isCurrentFile = currentFileIndex === index;
    
    switch (file.status) {
      case 'completed':
        return <Check size={16} className="text-emulator-success" />;
      case 'error':
        return <X size={16} className="text-emulator-error" />;
      case 'downloading':
        return isCurrentFile && isProcessingFile 
          ? <Loader2 size={16} className="animate-spin text-emulator-accent" /> 
          : <Download size={16} className="text-emulator-accent" />;
      default:
        return <Download size={16} className="text-emulator-text-secondary" />;
    }
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="space-y-4">
      <div className="border border-emulator-highlight rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-emulator-highlight">
          <thead className="bg-emulator-highlight/20">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-emulator-text-secondary uppercase tracking-wider">File Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-emulator-text-secondary uppercase tracking-wider">Size</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-emulator-text-secondary uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-xs font-medium text-emulator-text-secondary uppercase tracking-wider">Required</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-emulator-text-secondary uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-emulator-card-bg divide-y divide-emulator-highlight">
            {paginatedFiles.map((file, index) => {
              const actualIndex = (pagination.currentPage - 1) * itemsPerPage + index;
              
              return (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm font-medium text-emulator-text">{file.name}</td>
                  <td className="px-4 py-3 text-sm text-emulator-text-secondary">{file.size}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {getFileStatusIcon(file, actualIndex)}
                      <span className="ml-2 text-xs capitalize">{file.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {file.required && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emulator-error/20 text-emulator-error">
                        Required
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      onClick={() => onFileAction?.(file, actualIndex)}
                      disabled={isProcessingFile || file.status === 'downloading'}
                      size="sm"
                      variant={file.status === 'completed' ? "outline" : "default"}
                      className={
                        file.status === 'completed' 
                          ? "bg-emulator-success/10 text-emulator-success hover:bg-emulator-success/20 border-emulator-success" 
                          : "bg-emulator-accent text-black hover:bg-emulator-accent/80"
                      }
                    >
                      {file.status === 'completed' ? 'Installed' : file.status === 'error' ? 'Retry' : 'Install'}
                    </Button>
                  </td>
                </tr>
              );
            })}
            
            {paginatedFiles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-emulator-text-secondary">
                  No files to display in this page
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pagination.currentPage - 1);
                }}
                aria-disabled={pagination.currentPage === 1}
                className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {pageNumbers.map((page, i) => {
              // Add ellipsis when there are gaps in page numbers
              if (i > 0 && page > pageNumbers[i - 1] + 1) {
                return (
                  <React.Fragment key={`ellipsis-${i}`}>
                    <PaginationItem className="cursor-default">
                      <div className="h-9 w-9 flex items-center justify-center">
                        <span>...</span>
                      </div>
                    </PaginationItem>
                    <PaginationItem key={page}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={page === pagination.currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                );
              }
              
              return (
                <PaginationItem key={page}>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    isActive={page === pagination.currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pagination.currentPage + 1);
                }}
                aria-disabled={pagination.currentPage === pagination.totalPages}
                className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      <div className="text-xs text-emulator-text-secondary text-center">
        Showing {paginatedFiles.length} of {files.length} files 
        | Page {pagination.currentPage} of {pagination.totalPages}
      </div>
    </div>
  );
};

export default FileListPagination;
