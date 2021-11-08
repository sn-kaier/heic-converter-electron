import { PropsWithChildren, useState } from 'react';
import Spinner from 'renderer/Spinner/Spinner';

import './ConvertAll.css';

type ProgressState = 'none' | 'progress' | 'finished';

const ConvertAll = (
  props: PropsWithChildren<{
    basePath: string;
    files: Array<string>;
    moveOriginalsPath: string | undefined;
    quality: number;
    onFinished: () => void;
    onStarted: () => void;
  }>
) => {
  const [convertedFiles, setConvertedFiles] = useState(0);
  const [progress, setProgress] = useState<ProgressState>('none');
  const [totalFiles, setTotalFiles] = useState(0);

  const convertAll = () => {
    const files = props.files.map((f) => props.basePath + '/' + f);
    setTotalFiles(files.length);
    setConvertedFiles(0);
    setProgress('progress');
    props.onStarted();
    let countConverted = 0;

    const topic = window.electron.ipcRenderer.convertAndSave(
      files,
      props.quality,
      props.moveOriginalsPath
    );
    window.electron.ipcRenderer.on(topic, (file) => {
      // file: the whole path of the heic file
      countConverted++;
      console.log('file converted', file, countConverted, 'of', files.length);

      setConvertedFiles(countConverted);
      if (countConverted === files.length) {
        setProgress('finished');
        props.onFinished();
      }
    });
  };

  return (
    <div className="convert-all">
      {progress === 'progress' && (
        <div className="progress">
          <div
            className="progress-bar"
            style={{ width: `${(convertedFiles / totalFiles) * 100}%` }}
          />
        </div>
      )}

      <button hidden={progress !== 'none' || !props.files.length} onClick={convertAll} type="button">
        Alle Konvertieren
      </button>
      {progress === 'progress' && <Spinner /> || undefined}
    </div>
  );
};

export default ConvertAll;
