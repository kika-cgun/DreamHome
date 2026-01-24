import React from 'react';

interface ShimmerProps {
    className?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ className = '' }) => {
    return (
        <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
    );
};

export const LogoSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-8">
            <div className="relative text-4xl md:text-6xl font-bold tracking-tight mb-4">
                {/* Base Layer */}
                <div className="flex items-center gap-1 opacity-20">
                    <span className="text-[#1E3A5F]">Dream</span>
                    <span className="text-[#C9A227]">Home</span>
                </div>

                {/* Shine Layer */}
                <div className="absolute inset-0 flex items-center gap-1 overflow-hidden">
                    <div className="flex items-center gap-1 animate-pulse">
                        <span className="text-[#1E3A5F]">Dream</span>
                        <span className="text-[#C9A227]">Home</span>
                    </div>
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                </div>
            </div>
            <div className="h-1 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-full bg-[#C9A227] origin-left animate-[progress_1s_ease-in-out_infinite]" />
            </div>
        </div>
    );
};
