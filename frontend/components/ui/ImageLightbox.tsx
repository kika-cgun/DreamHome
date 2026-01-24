import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
    images,
    currentIndex,
    onClose,
    onNext,
    onPrevious,
}) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
                aria-label="Zamknij"
            >
                <X size={32} />
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
                <button
                    onClick={onPrevious}
                    className="absolute left-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
                    aria-label="Poprzednie zdjęcie"
                >
                    <ChevronLeft size={40} />
                </button>
            )}

            {/* Image */}
            <div className="max-w-7xl max-h-[90vh] px-16">
                <img
                    src={images[currentIndex]}
                    alt={`Zdjęcie ${currentIndex + 1}`}
                    className="max-w-full max-h-[90vh] object-contain"
                />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
                <button
                    onClick={onNext}
                    className="absolute right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
                    aria-label="Następne zdjęcie"
                >
                    <ChevronRight size={40} />
                </button>
            )}

            {/* Counter */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
    );
};
