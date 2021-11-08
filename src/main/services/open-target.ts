import { ipcMain } from 'electron';

const initOpenTarget = () => {
  ipcMain.on('open-target', (_, dir) => {
    require('child_process').exec(`start "" "${dir}"`);
  });
};

export default initOpenTarget;
