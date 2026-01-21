import React, { useRef, useState } from 'react';

const SpotlightCard = ({ children, className = "", onClick }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setOpacity(1);
    };

    const handleBlur = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleFocus}
            onMouseLeave={handleBlur}
            onClick={onClick}
            className={`relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl cursor-pointer group transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_40px_rgba(212,175,55,0.08)] ${className}`}
        >
            {/* Primary Spotlight Glow */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(212,175,55,0.12), transparent 40%)`,
                }}
            />

            {/* Secondary White Glow for edge shimmer */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 z-0"
                style={{
                    opacity: opacity * 0.5,
                    background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.08), transparent 40%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default SpotlightCard;
