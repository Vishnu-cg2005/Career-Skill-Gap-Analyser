import React, { useRef, useState } from 'react';
import { Upload, Check, FileText } from 'lucide-react';
import './ResumeUpload.css';

export default function ResumeUpload({ onUploadComplete }) {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const validateFile = (file) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            return 'Please upload a valid PDF or DOCX file.';
        }
        if (file.size > 5 * 1024 * 1024) return 'File size exceeds 5MB limit.';
        return null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        setError(null);
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setUploading(true);

        // Simulate scanning/uploading delay for effect
        setTimeout(() => {
            setUploading(false);
            setSuccess(true);

            // Wait a moment for success animation before proceeding
            setTimeout(() => {
                onUploadComplete(file);
            }, 800);
        }, 2000);
    };

    return (
        <div className="resume-square-wrapper">
            <div
                className={`resume-upload-square ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !uploading && !success && fileInputRef.current.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleChange}
                />

                {/* Main Content (Hidden when uploading/success) */}
                <div className="upload-content" style={{ opacity: uploading || success ? 0 : 1 }}>
                    <div className="icon-circle">
                        <Upload size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="upload-title">Upload Resume</h3>
                    <p className="upload-desc">
                        Drag & drop a <span className="font-semibold text-slate-700">PDF</span> or <span className="font-semibold text-slate-700">DOCX</span> here, or click to browse.
                    </p>
                </div>

                {/* Uploading Scanner Overlay */}
                {uploading && (
                    <div className="upload-scanning-overlay">
                        <div className="scanner-line"></div>
                        <p className="scanning-text">Analyzing Structure...</p>
                    </div>
                )}

                {/* Success Overlay */}
                {success && (
                    <div className="upload-success">
                        <div className="check-icon">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <p className="text-green-600 font-bold text-lg">Resume Verified!</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
