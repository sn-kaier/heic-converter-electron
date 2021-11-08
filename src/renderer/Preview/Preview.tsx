import './Preview.css';
import { PropsWithChildren, useState } from 'react';

interface ImageState {
  src?: string;
  loading: boolean;
  error?: string;
  convertedSrc?: string;
}

const Preview = (props: PropsWithChildren<{ selectedImagePath?: string }>) => {
  const [image, setImage] = useState<ImageState>({
    loading: false,
    error: undefined,
  });

  if (props.selectedImagePath !== image.src) {
    setImage((prev) => ({
      ...prev,
      loading: !!props.selectedImagePath,
      src: props.selectedImagePath,
      convertedSrc: undefined,
    }));

    console.log('trigger convert for', props.selectedImagePath);
    if (props.selectedImagePath) {
      window.electron.ipcRenderer
        .convert(props.selectedImagePath, 0.8)
        .then((buf) => {
          if (typeof buf === 'string') {
            setImage((prev) => ({ ...prev, error: buf, loading: false }));
          } else {
            const blob = new Blob([buf], { type: 'image/jpg' });
            const convertedSrc = URL.createObjectURL(blob);
            setImage((prev) => ({
              ...prev,
              convertedSrc,
              loading: false,
              error: undefined,
            }));
          }
        });
    }
  }

  return (
    <div className="preview">
      {image.loading ? <div className="preview-loading">Vorschau lädt...</div> : null}
      {image.error ? (
        <div className="preview-error">Fehler beim convertieren: {image.error}</div>
      ) : null}
      {image.convertedSrc ? (
        <img src={image.convertedSrc} className="preview-image" />
      ) : null}
    </div>
  );
};

export default Preview;
