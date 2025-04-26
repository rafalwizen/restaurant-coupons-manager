export interface ImageSummary {
    id: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    description: string;
}

export interface ImageDetail extends ImageSummary {
    url: string;
}

export interface ImageUpload {
    file: File;
    description?: string;
}