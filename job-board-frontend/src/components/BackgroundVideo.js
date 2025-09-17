import React from 'react'

export function BackgroundVideo() {
    return (
        <div>
            <video loop autoPlay muted style={{ width: "100vw", height: "100vh", objectFit: "cover", position: "fixed", top: 0, left: 0, zIndex: -1 }}>
                <source src="/assets/home-landing.mp4" type="video/mp4" />
            </video>
        </div>
    )
}

export default BackgroundVideo;
