import React, { useState } from 'react';
import { imageService } from '../../api/imageService';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import { useToast } from '../../contexts/ToastContext';

interface ImageUploaderProps {
    onSuccess?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { showToast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            showToast('Please select a file to upload', 'error');
            return;
        }

        try {
            setUploading(true);
            const response = await imageService.uploadImage(file, description);

            if (response.success) {
                showToast('Image uploaded successfully', 'success');
                setFile(null);
                setDescription('');
                setPreviewUrl(null);

                // Reset the file input
                const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                if (fileInput) fileInput.value = '';

                // Call the success callback if provided
                if (onSuccess) onSuccess();
            } else {
                showToast(response.message || 'Failed to upload image', 'error');
            }
        } catch (error) {
            showToast('Error uploading image', 'error');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image File
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                        disabled={uploading}
                    />
                </div>

                <FormInput
                    label="Description (optional)"
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    disabled={uploading}
                />

                {previewUrl && (
                    <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-40 rounded border"
                        />
                    </div>
                )}

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={uploading || !file}
                    >
                        {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ImageUploader;