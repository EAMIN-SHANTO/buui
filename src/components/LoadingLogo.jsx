import React, { useEffect, useState } from 'react';

const LoadingLogo = ({ onFinish }) => {
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(false);
            onFinish();
        }, 900);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className={`fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-transparent ${!isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
            <div className="mix-blend-difference">
                <span className="text-5xl font-bold">
                    <span className="loading-text" style={{
                        background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        BRACUverse
                    </span>
                </span>
            </div>
        </div>
    );
};

export default LoadingLogo; 