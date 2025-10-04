'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadProfileImage } from '@/lib/supabase/admin';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ currentImageUrl, onImageUploaded, label = 'Profile Image' }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an image (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const publicUrl = await uploadProfileImage(formData);
      onImageUploaded(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreviewUrl(currentImageUrl || null); // Revert to original
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        {label}
      </label>

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-background-primary border border-gray-700">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile preview"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full text-text-secondary text-sm">
              No image
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="px-4 py-2 bg-background-secondary border border-gray-700 rounded-lg text-text-primary hover:bg-background-primary hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Choose Image'}
          </button>
          <p className="text-xs text-text-secondary mt-2">
            JPEG, PNG, WebP, or GIF. Max 5MB.
          </p>
          {error && (
            <p className="text-xs text-red-400 mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
