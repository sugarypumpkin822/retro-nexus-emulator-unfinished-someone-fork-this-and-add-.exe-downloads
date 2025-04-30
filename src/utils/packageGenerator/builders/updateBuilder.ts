
import JSZip from 'jszip';

/**
 * Create a system update archive with necessary files
 */
export const createSystemUpdateArchive = async (): Promise<Blob> => {
  const updateZip = new JSZip();
  
  // Add update manifest
  updateZip.file('update.manifest', JSON.stringify({
    version: '1.2.5.482',
    releaseDate: '2025-04-29',
    requiredVersion: '1.2.0.0',
    components: [
      {name: 'core', version: '1.2.5.482', path: 'core/'},
      {name: 'launcher', version: '1.2.5.300', path: 'launcher/'},
      {name: 'emulator', version: '1.2.5.482', path: 'emulator/'}
    ],
    changelog: [
      'Fixed compatibility issues with latest Windows update',
      'Improved performance for PlayStation 2 games',
      'Added support for more controller types',
      'Fixed save state corruption issues',
      'Added new shader effects'
    ]
  }, null, 2));
  
  // Add update components
  updateZip.file('core/update.bin', new Uint8Array([0x43, 0x4F, 0x52, 0x45, 0x00, 0x01]));
  updateZip.file('launcher/update.bin', new Uint8Array([0x4C, 0x41, 0x55, 0x4E, 0x00, 0x01]));
  updateZip.file('emulator/update.bin', new Uint8Array([0x45, 0x4D, 0x55, 0x00, 0x01]));
  
  return updateZip.generateAsync({ type: 'blob' });
};
