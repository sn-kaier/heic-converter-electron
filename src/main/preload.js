const { contextBridge, ipcRenderer } = require('electron');

const validChannels = ['select-directory', 'convert-and-save'];

const queryOnce = (topic, params) => {
  ipcRenderer.send(topic, params);
  return new Promise((resolve) =>
    ipcRenderer.once(topic, (event, ...args) => resolve(...args))
  );
};

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    async selectDirectory() {
      return queryOnce('select-directory', '');
    },
    async listFiles(path, recursive) {
      return queryOnce('list-files', { path, recursive });
    },
    async convert(filePath, quality) {
      return queryOnce('convert', { filePath, quality });
    },
    openTarget(filePath) {
      ipcRenderer.send('open-target', filePath);
    },
    /**
     * @param filePaths: Array<string>
     * @param quality: number
     * @param moveOriginalsPath: string | undefined
     * @return {string} the topic
     */
    convertAndSave(filePaths, quality, moveOriginalsPath) {
      ipcRenderer.send('convert-and-save', { filePaths, quality, moveOriginalsPath });
      return 'convert-and-save';
    },
    on(channel, func) {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
