
import React from 'react';
import { Check, AlertTriangle, FileCode, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SetupFile } from '@/utils/setupTypes';
import FileListPagination from '../FileListPagination';

interface DllManagementStepProps {
  requiredDlls: SetupFile[];
  optionalDlls: SetupFile[];
  executableFiles: SetupFile[];
  installedDlls: string[];
  isInstalling: boolean;
  currentFileIndex: number | undefined;
  handleInstallDll: (file: SetupFile, index: number) => void;
  onTabChange: (tab: string) => void;
  currentTabView: string;
  checkRequiredDllsInstalled: () => boolean;
}

const DllManagementStep: React.FC<DllManagementStepProps> = ({
  requiredDlls,
  optionalDlls,
  executableFiles,
  installedDlls,
  isInstalling,
  currentFileIndex,
  handleInstallDll,
  onTabChange,
  currentTabView,
  checkRequiredDllsInstalled
}) => {
  return (
    <div className="space-y-4">
      <p className="text-emulator-text-secondary">
        Install and manage the required DLL files for the RetroNexus Emulator. <strong>All required DLLs must be installed</strong> for the emulator to function properly.
      </p>
      
      <Tabs defaultValue={currentTabView} onValueChange={onTabChange}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="required">
            Required DLLs
            <span className="ml-2 px-2 py-0.5 text-xs bg-emulator-error/20 text-emulator-error rounded-full">
              {requiredDlls.filter(dll => installedDlls.includes(dll.name)).length}/{requiredDlls.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="optional">Optional DLLs</TabsTrigger>
          <TabsTrigger value="executables">Executables</TabsTrigger>
        </TabsList>
        
        <TabsContent value="required" className="mt-4 space-y-4">
          <div className="bg-emulator-highlight/10 p-3 rounded-md text-sm text-emulator-text-secondary border border-emulator-highlight mb-4">
            <div className="flex items-center mb-1">
              <AlertTriangle className="mr-2 text-emulator-warning" size={16} />
              <span className="text-emulator-warning font-medium">All these DLLs are required</span>
            </div>
            <p>The RetroNexus Emulator requires all of these DLLs to function properly. Make sure to install them all.</p>
          </div>
          
          <FileListPagination 
            files={requiredDlls} 
            onFileAction={handleInstallDll}
            isProcessingFile={isInstalling}
            currentFileIndex={currentFileIndex}
          />
        </TabsContent>
        
        <TabsContent value="optional" className="mt-4">
          <div className="bg-emulator-highlight/10 p-3 rounded-md text-sm text-emulator-text-secondary border border-emulator-highlight mb-4">
            <div className="flex items-center mb-1">
              <FileCode className="mr-2 text-emulator-accent" size={16} />
              <span className="text-emulator-accent font-medium">Optional enhancements</span>
            </div>
            <p>These DLLs add additional features like enhanced graphics or controller support but are not required.</p>
          </div>
          
          <FileListPagination 
            files={optionalDlls} 
            onFileAction={handleInstallDll}
            isProcessingFile={isInstalling}
            currentFileIndex={currentFileIndex}
          />
        </TabsContent>
        
        <TabsContent value="executables" className="mt-4">
          <div className="bg-emulator-highlight/10 p-3 rounded-md text-sm text-emulator-text-secondary border border-emulator-highlight mb-4">
            <div className="flex items-center mb-1">
              <Code className="mr-2 text-emulator-accent" size={16} />
              <span className="text-emulator-accent font-medium">Executable Files</span>
            </div>
            <p>These are the main executable files required for RetroNexus Emulator.</p>
          </div>
          
          <FileListPagination 
            files={executableFiles} 
            onFileAction={handleInstallDll}
            isProcessingFile={isInstalling}
            currentFileIndex={currentFileIndex}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 pt-4 border-t border-emulator-highlight">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">DLL Installation Status</p>
            <p className="text-xs text-emulator-text-secondary">
              {installedDlls.length} of {requiredDlls.length} required DLLs installed
            </p>
          </div>
          
          <div>
            {checkRequiredDllsInstalled() ? (
              <div className="flex items-center text-emulator-success">
                <Check size={16} className="mr-1" />
                <span className="text-sm">All required DLLs installed</span>
              </div>
            ) : (
              <div className="flex items-center text-emulator-error">
                <AlertTriangle size={16} className="mr-1" />
                <span className="text-sm">Missing required DLLs</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DllManagementStep;
