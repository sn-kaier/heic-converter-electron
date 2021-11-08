import './App.css';
import DirectorySelector from './DirectorySelector/DirectorySelector';
import { useState } from 'react';
import FilesList from './FilesList/FilesList';
import Preview from './Preview/Preview';
import MoveOriginal from './MoveOriginal/MoveOriginal';
import ConvertAll from './ConvertAll/ConvertAll';
import Finished from './Finished/Finished';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        selectDirectory: () => Promise<string>;
        openTarget: (path: string) => void;
        listFiles: (path: string, recursive: boolean) => Promise<Array<string>>;
        convert: (
          filePath: string,
          quality: number
        ) => Promise<Buffer | string>;
        convertAndSave: (
          filePaths: Array<string>,
          quality: number,
          moveOriginalsPath: string | undefined
        ) => string;
        on: (topic: string, cb: (...args: any[]) => void) => void;
      };
    };
  }
}

type AppState = 'preparation' | 'converting' | 'converted' | 'error';

export default function App() {
  const [appState, setAppState] = useState<AppState>('preparation');
  const [files, setFiles] = useState<Array<string>>([]);
  const [directory, setDirectory] = useState<string>('');
  const [recursive, setRecursive] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [moveOriginal, setMoveOriginal] = useState<string | undefined>(
    undefined
  );

  const onDirectorySelected = async (path: string, r = recursive) => {
    setDirectory(path);
    const files = await window.electron.ipcRenderer.listFiles(path, r);
    if (Array.isArray(files)) {
      setFiles(files);
    }
    console.log('listed files', files);
  };

  const onSelectImage = (fileName: string) => {
    setSelectedImage(fileName);
  };

  const onMoveSpecified = (path: string | undefined) => {
    setMoveOriginal(path);
  };

  const onRecursiveChanged = (recursive: boolean) => {
    onDirectorySelected(directory, recursive);
    setRecursive(recursive);
  };

  const onConvertFinished = () => {
    console.log('Finished converting');
    setAppState('converted');
  };

  const onConvertStarted = () => {
    setAppState('converting');
  };

  return (
    <div className="App">
      {appState === 'preparation' || appState === 'converting' ? (
        <div className="container">
          <h2>HEIC nach JPEG Converter</h2>
          <DirectorySelector
            disabled={appState !== 'preparation'}
            onDirectorySelected={onDirectorySelected}
            recursive={recursive}
            onRecursiveChanged={onRecursiveChanged}
            directory={directory}
          />
          <MoveOriginal
            disabled={appState !== 'preparation'}
            onSpecifyMove={onMoveSpecified}
          />
          <div className="center">
            <FilesList
              files={files}
              onSelect={onSelectImage}
              selectedFile={selectedImage}
            />
            <Preview
              selectedImagePath={
                selectedImage ? directory + '/' + selectedImage : undefined
              }
            />
          </div>
          <ConvertAll
            basePath={directory}
            files={files}
            moveOriginalsPath={moveOriginal}
            quality={0.8}
            onFinished={onConvertFinished}
            onStarted={onConvertStarted}
          />
        </div>
      ) : (
        <div className="container">
          <Finished directory={directory} filesCount={files.length} />
        </div>
      )}
    </div>
  );
}
