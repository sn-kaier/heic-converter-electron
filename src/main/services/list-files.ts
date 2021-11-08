import { ipcMain } from 'electron';

import glob from 'glob';

const listFiles = async (dir: string, recursive: boolean): Promise<Array<string>> => {
  return new Promise<Array<string>>((resolve, reject) => {
    glob(recursive ? '**/*.heic' : '*.heic', { nodir: true, cwd: dir }, (error, matches) => {
      if (error) {
        console.log('List files failed', error);
        reject(error);
      } else {
        console.log('Listed files', matches);
        resolve(matches);
      }
    });
  });
};

const initListFiles = () => {
  ipcMain.on('list-files', async (event, { path, recursive }) => {
    console.log('Query to list files for', path, {recursive});
    const answer = await listFiles(path, recursive);
    event.reply('list-files', answer);
  });
};

export default initListFiles;
