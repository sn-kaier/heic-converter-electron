const Finished = (props: {directory: string, filesCount: number}) => {
  const openTargetDirectory = () => {
    window.electron.ipcRenderer.openTarget(props.directory);
  }

  return (
    <div className="finished">
      <h1>{props.filesCount} Bilder Konvertiert</h1>
      <button onClick={openTargetDirectory}>Ordner öffnen</button>
    </div>
  );
}

export default Finished;
