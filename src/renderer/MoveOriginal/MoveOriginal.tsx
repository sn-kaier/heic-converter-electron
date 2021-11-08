import './MoveOriginal.css';
import { useState } from 'react';

const MoveOriginal = (props: {
  onSpecifyMove: (path: string | undefined) => void;
  disabled: boolean;
}) => {
  const [moveToInput, setMoveToInput] = useState('heic');
  const [cbChecked, setCbChecked] = useState(false);

  return (
    <div className="move-original">
      <div className="move-block">
        <input
          disabled={props.disabled}
          type="checkbox"
          id="cb-move-original"
          value={+cbChecked}
          onInput={(event) => {
            const checked = (event.target as HTMLInputElement).checked;
            setCbChecked(checked);

            props.onSpecifyMove(checked ? moveToInput : undefined);
          }}
        />
        <label htmlFor="cb-move-original">Originale verschieben</label>
      </div>

      <div className="move-block">
        <label htmlFor="input-move-to">Nach Unterordner</label>
        <input
          type="text"
          id="input-move-to"
          className="input-move-to"
          disabled={!cbChecked || props.disabled}
          value={moveToInput}
          onInput={(inp) => {
            const input = (inp.target as HTMLInputElement).value;
            setMoveToInput(input);
            props.onSpecifyMove(cbChecked ? input : undefined);
          }}
        />
      </div>
    </div>
  );
};

export default MoveOriginal;
