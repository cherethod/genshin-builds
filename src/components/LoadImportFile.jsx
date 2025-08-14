const LoadImportFile = ({ onFileLoad }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          onFileLoad(data);
        } catch (error) {
          console.error("Error parsing file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                onFileLoad(data);
                console.log("File loaded successfully:", data);
                
            } catch (error) {
                console.error("Error parsing file:", error);
            }
            }
        reader.readAsText(file);}
        console.log("File dropped:", file);
        
}
        

  return (
    <div className="load-import-file" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {handleDrop(e)}}>
        <h2>Import Characters from File</h2>
        {/* droop box */}
        <div className="droop-container">
            <p>Drag and drop a JSON file here or click to select a file.</p>
        </div>
      <input type="file" accept=".json, .js" onChange={handleFileChange} />
    </div>
  );
}

export default LoadImportFile;