import { ipcMain, dialog } from 'electron';

const openDirectory = async (): Promise<string> => {
  const answer = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    buttonLabel: 'Ordner wählen',
  });
  if (answer.canceled) {
    return '';
  }

  return answer.filePaths[0];
};

const initSelectDirectory = () => {
  ipcMain.on('select-directory', async (event) => {
    const answer = await openDirectory();
    event.reply('select-directory', answer);
  });
};

export default initSelectDirectory;
