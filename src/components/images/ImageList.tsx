import React, { useEffect, useState } from 'react';
import { ImageSummary } from '../../types/image.types';
import { imageService } from '../../api/imageService';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorDisplay from '../ui/ErrorDisplay';
import { useToast } from '../../contexts/ToastContext';
import ConfirmationDialog from '../ui/ConfirmationDialog';

interface ImageListProps {
    refreshTrigger?: number;
    onSelectImage?: (imageId: number) => void;
    selectedImageId?: number;
    showSelectButton?: boolean;
}

const ImageList: React.FC<ImageListProps> = ({
                                                 refreshTrigger,
                                                 onSelectImage,
                                                 selectedImageId,
                                                 showSelectButton = false
                                             }) => {
    const [images, setImages] = useState<ImageSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast } = useToast();

    const fetchImages = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await imageService.getAllImages();
            if (response.success) {
                setImages(response.data);
            } else {
                setError(response.message || 'Failed to fetch images');
            }
        } catch (error) {
            setError('Error loading images');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, [refreshTrigger]);

    const handleDeleteClick = (id: number) => {
        setImageToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (imageToDelete === null) return;

        try {
            setIsDeleting(true);
            const response = await imageService.deleteImage(imageToDelete);
            if (response.success) {
                setImages(images.filter(img => img.id !== imageToDelete));
                showToast('Image deleted successfully', 'success');
            } else {
                showToast(response.message || 'Failed to delete image', 'error');
            }
        } catch (error) {
            showToast('Error deleting image', 'error');
            console.error(error);
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setImageToDelete(null);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Available Images</h2>

            {images.length === 0 ? (
                <p className="text-gray-500">No images available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className={`border rounded-lg overflow-hidden bg-white shadow-sm
                                ${selectedImageId === image.id ? 'ring-2 ring-blue-500' : ''}`}
                        >
                            <div className="h-40 overflow-hidden bg-gray-100 flex items-center justify-center">
                                <img
                                    src={`/api/images/${image.id}/content`}
                                    alt={image.fileName}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-medium truncate" title={image.fileName}>
                                    {image.fileName}
                                </h3>
                                <p className="text-xs text-gray-500 mb-2">
                                    {(image.fileSize / 1024).toFixed(1)} KB • {image.fileType}
                                </p>
                                <p className="text-xs text-gray-700 truncate" title={image.description || ''}>
                                    {image.description || 'No description'}
                                </p>
                                <div className="mt-2 flex space-x-2">
                                    {showSelectButton && onSelectImage && (
                                        <Button
                                            onClick={() => onSelectImage(image.id)}
                                            className={`text-xs py-1 px-2 ${
                                                selectedImageId === image.id
                                                    ? 'bg-blue-700'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                        >
                                            {selectedImageId === image.id ? 'Selected' : 'Select'}
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => handleDeleteClick(image.id)}
                                        className="text-xs py-1 px-2 bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationDialog
                isOpen={deleteDialogOpen}
                title="Delete Image"
                message="Are you sure you want to delete this image? If this image is associated with any coupons, the association will be removed."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialogOpen(false)}
                isConfirmLoading={isDeleting}
            />
        </div>
    );
};

export default ImageList;