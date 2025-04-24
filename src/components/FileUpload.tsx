import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const FileUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const acceptableFiles = files.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ['rom', 'iso', 'apk', 'exe', 'zip', 'nes', 'sfc', 'smc', 'n64', 'z64', 
              'gba', 'nds', 'cso', 'bin', 'cue'].includes(ext || '');
    });
    
    if (acceptableFiles.length !== files.length) {
      toast.error("Some files were skipped", { 
        description: "Only ROM, ISO, APK, EXE and supported emulator files are allowed."
      });
    }
    
    if (acceptableFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...acceptableFiles]);
      toast.success(`${acceptableFiles.length} files selected`, {
        description: "Files will be saved to C:\\RetroNexus\\Games"
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("No files selected", {
        description: "Please select files to upload first."
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    let progress = 0;
    const totalFiles = selectedFiles.length;
    
    const progressToast = toast.loading(`Saving to C:\\RetroNexus\\Games (0/${totalFiles})`);
    
    const interval = setInterval(() => {
      progress += 1;
      toast.loading(`Saving to C:\\RetroNexus\\Games (${progress}/${totalFiles})`, {
        id: progressToast
      });
      
      if (progress >= totalFiles) {
        clearInterval(interval);
        setIsUploading(false);
        setSelectedFiles([]);
        toast.success('Files imported successfully!', {
          id: progressToast,
          description: `${totalFiles} files have been saved to C:\\RetroNexus\\Games`
        });
      }
    }, 800);
  };

  return (
    <div className="w-full">
      <div 
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-emulator-accent bg-emulator-accent/10' : 'border-emulator-highlight bg-emulator-card-bg'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          multiple 
          onChange={handleFileInput}
          className="hidden" 
          id="fileInput" 
        />
        
        <Upload size={40} className="mx-auto text-emulator-text-secondary mb-2" />
        
        <h3 className="font-bold mb-2 text-lg">Upload Game Files</h3>
        <p className="text-emulator-text-secondary mb-4">
          Drag & drop your ROM, ISO, APK or EXE files here, or click to browse
        </p>
        
        <label htmlFor="fileInput">
          <Button 
            className="bg-emulator-button border border-emulator-highlight hover:bg-emulator-highlight hover:text-white"
          >
            Browse Files
          </Button>
        </label>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-4 border border-emulator-highlight rounded-lg bg-emulator-card-bg">
          <div className="p-3 border-b border-emulator-highlight">
            <h4 className="font-bold">Selected Files ({selectedFiles.length})</h4>
          </div>
          
          <ul className="max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between px-4 py-2 border-b border-emulator-highlight last:border-0">
                <div className="flex items-center">
                  <span className="truncate max-w-xs">{file.name}</span>
                  <span className="text-xs text-emulator-text-secondary ml-2">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeFile(index)}
                  className="text-emulator-text-secondary hover:text-emulator-error p-0 h-auto"
                >
                  <X size={16} />
                </Button>
              </li>
            ))}
          </ul>
          
          <div className="p-3 border-t border-emulator-highlight flex justify-end">
            <Button 
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-emulator-accent text-black hover:bg-emulator-accent/80"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Upload Files
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
