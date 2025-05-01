import React, { useState } from 'react';
import Button from '../ui/Button';
import ImageList from './ImageList';
import {imageService} from "../../api/imageService.ts";

interface ImageSelectorProps {
    selectedImageId?: number;
    onImageSelect: (imageId: number | null) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ selectedImageId, onImageSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSelectImage = (imageId: number) => {
        onImageSelect(imageId);
    };

    const handleClearSelection = () => {
        onImageSelect(null);
    };

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? 'Hide Image Gallery' : 'Select an Image'}
                </Button>

                {selectedImageId && (
                    <Button
                        onClick={handleClearSelection}
                        className="bg-gray-600 hover:bg-gray-700"
                    >
                        Clear Selection
                    </Button>
                )}

                {isOpen && (
                    <Button
                        onClick={handleRefresh}
                    >
                        Refresh Images
                    </Button>
                )}
            </div>

            {selectedImageId && (
                <div className="mt-2 p-2 border rounded bg-gray-50">
                    <p className="text-sm mb-1">Selected Image:</p>
                    <div className="h-32 w-32 overflow-hidden border rounded flex items-center justify-center bg-white">
                        <img
                            src={imageService.getImageUrl(selectedImageId)}
                            alt="Selected"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="mt-4 border rounded p-4 bg-gray-50">
                    <ImageList
                        refreshTrigger={refreshTrigger}
                        onSelectImage={handleSelectImage}
                        selectedImageId={selectedImageId}
                        showSelectButton={true}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageSelector;