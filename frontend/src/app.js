import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      setResult({
        class_id: response.data.class_id,
        class_name: response.data.class_name,
        error: null,
      });
    } catch (error) {
      console.error(error);
      setResult({ error: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚗 Car Model Classifier</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
          <button type="submit" style={styles.button}>Classify</button>
        </form>

        {previewUrl && (
          <div style={styles.preview}>
            <p style={styles.label}>Preview</p>
            <img src={previewUrl} alt="Preview" style={styles.image} />
          </div>
        )}

        {result && result.error && (
          <p style={styles.error}>{result.error}</p>
        )}

        {result && result.class_name && (
          <div style={styles.result}>
            <p><strong>ID:</strong> {result.class_id}</p>
            <p><strong>Name:</strong> {result.class_name}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '540px',
    textAlign: 'center',
  },
  title: {
    fontSize: '26px',
    color: '#003366',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fileInput: {
    padding: '12px',
    border: '2px solid #cfd8dc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    fontSize: '14px',
    cursor: 'pointer',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  preview: {
    marginTop: '20px',
  },
  label: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '8px',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '250px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  result: {
    marginTop: '24px',
    fontSize: '18px',
    backgroundColor: '#e3f2fd',
    padding: '16px',
    borderRadius: '10px',
    border: '1px solid #90caf9',
    color: '#0d47a1',
  },
  error: {
    color: '#d32f2f',
    marginTop: '20px',
  },
};

export default App;