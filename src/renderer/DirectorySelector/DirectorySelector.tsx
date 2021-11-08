import { PropsWithChildren } from 'react';

import './DirectorySelector.css';

const DirectorySelector = (
  props: PropsWithChildren<{
    onDirectorySelected: (s: string) => void;
    onRecursiveChanged: (recursive: boolean) => void;
    directory: string;
    recursive: boolean;
    disabled: boolean;
  }>
) => {
  const selectDirectory = async () => {
    const dir = await window.electron.ipcRenderer.selectDirectory();
    if (dir) {
      props.onDirectorySelected(dir);
    }
  };

  return (
    <div className="directory-selector">
      <div className="directory-selector__directory">
        <div className='directory-selector__group'>
          <label htmlFor="heicDir">Verzeichnis:</label>
          <span id="heicDir">{props.directory || 'Keines ausgewählt'}</span>
        </div>
        <div className='directory-selector__group'>
          <input id="cb-recursive" type='checkbox' value={+props.recursive} onInput={(event) => {
            props.onRecursiveChanged((event.target as HTMLInputElement).checked);
          }} disabled={props.disabled} />
          <label htmlFor="cb-recursive">Unterverzeichnisse mit einbeziehen</label>
        </div>
      </div>
      <button onClick={selectDirectory} type="button" disabled={props.disabled}>
        Wähle Ordner
      </button>
    </div>
  );
};

export default DirectorySelector;
