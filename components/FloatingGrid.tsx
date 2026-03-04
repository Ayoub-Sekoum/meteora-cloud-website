export function FloatingGrid() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
            {/* Dark gradient mask */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_70%)] z-10" />

            {/* Grid dots */}
            <div
                className="absolute w-[200vw] h-[200vh] -top-[50%] -left-[50%]"
                style={{
                    backgroundImage: `radial-gradient(var(--tw-colors-primary)/20 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                    transform: "perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
                    animation: "grid-move 15s linear infinite"
                }}
            />

            {/* Ambient glow patches */}
            <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animation-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-secondary/30 rounded-full blur-[120px] mix-blend-screen opacity-50 animation-pulse-slow object-delay-1000" />
        </div>
    );
}
