import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ImageUploader from '../components/images/ImageUploader';
import ImageList from '../components/images/ImageList';

const ImageManagerPage: React.FC = () => {
    const navigate = useNavigate();
    const [refreshCount, setRefreshCount] = useState(0);

    const handleImageUploaded = () => {
        // Trigger a refresh of the image list
        setRefreshCount(prev => prev + 1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Image Management</h1>
                <Button
                    onClick={() => navigate('/admin/coupons')}
                    className="bg-gray-600 hover:bg-gray-700"
                >
                    Back to Coupons
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ImageUploader onSuccess={handleImageUploaded} />
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md h-full">
                        <ImageList refreshTrigger={refreshCount} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageManagerPage;