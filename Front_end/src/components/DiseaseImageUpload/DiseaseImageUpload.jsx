import { useState } from "react";
import { uploadProductImage, updateDiseaseImage } from "../../../api";
import "./DiseaseImageUpload.css";

export default function DiseaseImageUpload({ diseaseId, diseaseName, onImageUpdated }) {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Vui lòng chọn file ảnh");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Ảnh không được quá 5MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Vui lòng chọn ảnh");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Upload ảnh lên Cloudinary
      const uploadResult = await uploadProductImage(file, diseaseId);
      
      if (uploadResult.success && uploadResult.url) {
        // Cập nhật ImageUrl vào database
        const updateResult = await updateDiseaseImage(diseaseId, uploadResult.url);
        
        if (updateResult.success) {
          setSuccess("Cập nhật ảnh thành công!");
          setImageUrl(uploadResult.url);
          setFile(null);
          
          // Reset input
          document.getElementById("image-upload").value = "";
          
          // Callback
          if (onImageUpdated) {
            onImageUpdated(uploadResult.url);
          }
          
          // Clear success after 3s
          setTimeout(() => setSuccess(null), 3000);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Lỗi khi upload ảnh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="disease-image-upload">
      <div className="upload-form">
        <h3>📸 Upload ảnh bệnh - {diseaseName}</h3>
        
        <form onSubmit={handleUpload}>
          <div className="input-group">
            <label htmlFor="image-upload">Chọn ảnh:</label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            {file && <span className="file-name">✓ {file.name}</span>}
          </div>

          <button 
            type="submit" 
            className="btn-upload"
            disabled={!file || loading}
          >
            {loading ? "Đang upload..." : "Upload ảnh"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {imageUrl && (
          <div className="image-preview">
            <h4>Ảnh đã upload:</h4>
            <img src={imageUrl} alt={diseaseName} />
            <p className="image-url">{imageUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
}
