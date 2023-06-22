import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SingleFileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3003/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File upload was successful");
        navigate("/Tabla");
      } else {
        alert("Failed to upload the file");
      }
    } catch (error) {
      console.error("Error while uploading the file:", error);
      alert("Error occurred while uploading the file");
    }
  };

  return (
    <div>
      <h2>Subir tablas Anexos_Unificados*.xlsx y SAEGAL-INF-InformeSemanal*.xlsm </h2>
      <input type="file" name="file" accept=".csv, .xlsm, .xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}