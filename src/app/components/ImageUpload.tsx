/**
 * GRADE A REALTY - Image Upload Component
 * Drag-and-drop image upload with preview
 * Phase 1 Implementation
 */

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Star, GripVertical, Loader2, AlertCircle } from 'lucide-react';

export interface UploadedImage {
    id: string;
    file?: File;
    url: string;
    name: string;
    size: number;
    isPrimary: boolean;
    order: number;
    uploading?: boolean;
    error?: string;
}

interface ImageUploadProps {
    images: UploadedImage[];
    onChange: (images: UploadedImage[]) => void;
    maxImages?: number;
    maxSizeMB?: number;
    acceptedTypes?: string[];
    disabled?: boolean;
}

const DEFAULT_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const DEFAULT_MAX_SIZE_MB = 10;
const DEFAULT_MAX_IMAGES = 20;

export default function ImageUpload({
    images,
    onChange,
    maxImages = DEFAULT_MAX_IMAGES,
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
    disabled = false,
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateId = () => `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const validateFile = (file: File): string | null => {
        if (!acceptedTypes.includes(file.type)) {
            return `Invalid file type. Accepted: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            return `File too large. Maximum size: ${maxSizeMB}MB`;
        }
        return null;
    };

    const handleFiles = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const remainingSlots = maxImages - images.length;

        if (remainingSlots <= 0) {
            return;
        }

        const filesToAdd = fileArray.slice(0, remainingSlots);

        const newImages: UploadedImage[] = filesToAdd.map((file, index) => {
            const error = validateFile(file);
            return {
                id: generateId(),
                file,
                url: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
                isPrimary: images.length === 0 && index === 0,
                order: images.length + index,
                uploading: !error,
                error: error || undefined,
            };
        });

        onChange([...images, ...newImages]);

        // Simulate upload completion (in real app, would call API)
        newImages.forEach((img) => {
            if (!img.error) {
                setTimeout(() => {
                    onChange((prev) =>
                        prev.map((i) =>
                            i.id === img.id ? { ...i, uploading: false } : i
                        )
                    );
                }, 1500 + Math.random() * 1000);
            }
        });
    }, [images, maxImages, onChange]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        handleFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
        // Reset input
        e.target.value = '';
    };

    const removeImage = (id: string) => {
        const newImages = images.filter((img) => img.id !== id);

        // If we removed the primary, set first image as primary
        if (newImages.length > 0 && !newImages.some((img) => img.isPrimary)) {
            newImages[0].isPrimary = true;
        }

        // Revoke object URL to free memory
        const removed = images.find((img) => img.id === id);
        if (removed?.file) {
            URL.revokeObjectURL(removed.url);
        }

        onChange(newImages);
    };

    const setPrimary = (id: string) => {
        onChange(
            images.map((img) => ({
                ...img,
                isPrimary: img.id === id,
            }))
        );
    };

    // Drag and drop reordering
    const handleImageDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleImageDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const draggedImage = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);

        // Update order
        newImages.forEach((img, i) => {
            img.order = i;
        });

        setDraggedIndex(index);
        onChange(newImages);
    };

    const handleImageDragEnd = () => {
        setDraggedIndex(null);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && fileInputRef.current?.click()}
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragging
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-white/20 hover:border-amber-500/50 hover:bg-white/5'
                    }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes.join(',')}
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={disabled}
                />

                <div className="flex flex-col items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDragging ? 'bg-amber-500/20' : 'bg-white/10'
                        }`}>
                        <Upload className={`w-7 h-7 ${isDragging ? 'text-amber-400' : 'text-gray-400'}`} />
                    </div>

                    <div>
                        <p className="text-white font-medium">
                            {isDragging ? 'Drop images here' : 'Drag & drop images here'}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            or click to browse
                        </p>
                    </div>

                    <p className="text-gray-500 text-xs">
                        {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} • Max {maxSizeMB}MB each • {images.length}/{maxImages} uploaded
                    </p>
                </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            draggable={!disabled && !image.uploading}
                            onDragStart={() => handleImageDragStart(index)}
                            onDragOver={(e) => handleImageDragOver(e, index)}
                            onDragEnd={handleImageDragEnd}
                            className={`
                relative group aspect-square rounded-xl overflow-hidden border-2 transition-all
                ${image.isPrimary ? 'border-amber-500' : 'border-white/10'}
                ${image.error ? 'border-red-500' : ''}
                ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
              `}
                        >
                            {/* Image */}
                            <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay */}
                            <div className={`
                absolute inset-0 bg-black/50 transition-opacity
                ${image.uploading || image.error ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
              `}>
                                {/* Loading */}
                                {image.uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                                    </div>
                                )}

                                {/* Error */}
                                {image.error && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                        <AlertCircle className="w-6 h-6 text-red-400 mb-1" />
                                        <p className="text-red-400 text-xs text-center">{image.error}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                {!image.uploading && !image.error && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2">
                                        {/* Drag Handle */}
                                        <div className="absolute top-2 left-2 p-1 bg-white/20 rounded cursor-grab active:cursor-grabbing">
                                            <GripVertical className="w-4 h-4 text-white" />
                                        </div>

                                        {/* Set Primary */}
                                        {!image.isPrimary && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPrimary(image.id);
                                                }}
                                                className="px-3 py-1.5 bg-white/20 hover:bg-amber-500/80 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1"
                                            >
                                                <Star className="w-3 h-3" />
                                                Set as Primary
                                            </button>
                                        )}

                                        {/* Remove */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(image.id);
                                            }}
                                            className="px-3 py-1.5 bg-red-500/80 hover:bg-red-600 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1"
                                        >
                                            <X className="w-3 h-3" />
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Primary Badge */}
                            {image.isPrimary && !image.error && (
                                <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500 rounded-md text-xs font-medium text-white flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    Primary
                                </div>
                            )}

                            {/* File Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-xs truncate">{image.name}</p>
                                <p className="text-gray-400 text-xs">{formatFileSize(image.size)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {images.length === 0 && (
                <div className="text-center py-8">
                    <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No images uploaded yet</p>
                    <p className="text-gray-500 text-xs mt-1">Add photos to showcase your property</p>
                </div>
            )}
        </div>
    );
}
