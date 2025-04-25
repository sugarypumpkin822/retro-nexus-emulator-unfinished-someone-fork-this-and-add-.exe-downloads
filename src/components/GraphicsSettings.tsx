
import React from 'react';
import { toast } from 'sonner';

const GraphicsSettings: React.FC = () => {
  return (
    <div className="p-6 text-center">
      <p className="text-lg text-emulator-text-secondary mb-4">
        Graphics settings are now accessible in the BIOS menu.
      </p>
      <p className="text-emulator-text-secondary">
        To access graphics settings, restart the emulator and use the BIOS interface 
        that appears during startup. Press any key during the BIOS screen to access settings 
        or wait for the emulator to boot automatically.
      </p>
    </div>
  );
};

export default GraphicsSettings;
