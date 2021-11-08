import { ipcMain } from 'electron';
import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const convertHeic = require('heic-convert');

const covertHeicToJpg = async (filePath: string, quality = 0.8) => {
  const buf = await fsPromises.readFile(filePath);
  return convertHeic({
    buffer: buf,
    format: 'JPEG', // output format
    quality, // the jpeg compression quality, between 0 and 1
  });
};

const initHeicConvert = () => {
  ipcMain.on(
    'convert',
    async (event, params: { filePath: string; quality: number }) => {
      console.log('Query to convert for', params.filePath);
      let answer: string | Buffer;
      try {
        answer = await covertHeicToJpg(params.filePath, params.quality);
      } catch (e) {
        answer = (e as Error).message;
      }
      event.reply('convert', answer);
    }
  );

  ipcMain.on(
    'convert-and-save',
    async (
      event,
      params: {
        filePaths: Array<string>;
        quality: number;
        moveOriginalsPath: string | undefined;
      }
    ) => {
      for (const filePath of params.filePaths) {
        try {
          const converted = await covertHeicToJpg(
            filePath,
            params.quality
          );
          const baseName = filePath.split('/').pop();
          if (!baseName) {
            throw new Error('No base name');
          }
          const basePath = filePath.replace(baseName, '');
          const fileNameWithoutEnding = baseName.substr(0, baseName.length - '.heic'.length);
          let convertedFileName = `${fileNameWithoutEnding}.jpg`;

          let i = 1;
          while (existsSync(`${basePath}${convertedFileName}`)) {
            convertedFileName = `${fileNameWithoutEnding}_${i}.jpg`;
            i++
          }
          const newFilePath = `${basePath}${convertedFileName}`;
          await fsPromises.writeFile(newFilePath, converted);

          if (params.moveOriginalsPath) {
            const newDir = basePath + params.moveOriginalsPath;
            await fsPromises.mkdir(newDir, {recursive: true});
            const newLocation = path.join(newDir, baseName);
            await fsPromises.rename(filePath, newLocation);
          }

          event.reply('convert-and-save', { filePath });
        } catch (e) {
          // todo: handle error
          event.reply('convert-and-save', { filePath, error: e });
        }
      }
    }
  );
};

export default initHeicConvert;
