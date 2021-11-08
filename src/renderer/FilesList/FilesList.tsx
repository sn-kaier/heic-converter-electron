import './FilesList.css';
import { PropsWithChildren } from 'react';

const FilesList = (props: PropsWithChildren<{ files: Array<string>, onSelect: (path: string) => void, selectedFile?: string }>) => {
  return (
    <div className='files-list'>
      {props.files.length && <h3>HEIF Bilder in diesem Ordner:</h3> || null}
      {props.files.map((file, index) => {
        const classes = ['file-item'];
        if (props.selectedFile === file) {
          classes.push('selected');
        }
        return <div key={index} className={classes.join(' ')} onClick={() => props.onSelect(file)}>
          <div className='file-name'>{file}</div>
        </div>;
      })}
    </div>
  )
}

export default FilesList;
