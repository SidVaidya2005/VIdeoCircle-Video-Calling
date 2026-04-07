import React, { useState, useEffect } from 'react';
import styles from '../../styles/videoComponent.module.css';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicOffIcon from '@mui/icons-material/MicOff';

function getGridDimensions(count) {
    if (count <= 1) return { cols: 1, rows: 1 };
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    return { cols, rows };
}

function ConferenceCell({ video }) {
    const [videoMuted, setVideoMuted] = useState(false);
    const [audioMuted, setAudioMuted] = useState(false);

    useEffect(() => {
        if (!video.stream) return;

        const vTrack = video.stream.getVideoTracks()[0];
        const aTrack = video.stream.getAudioTracks()[0];

        // Set initial mute state from current track status
        setVideoMuted(!vTrack || vTrack.muted);
        setAudioMuted(!aTrack || aTrack.muted);

        const onVMute = () => setVideoMuted(true);
        const onVUnmute = () => setVideoMuted(false);
        const onAMute = () => setAudioMuted(true);
        const onAUnmute = () => setAudioMuted(false);

        vTrack?.addEventListener('mute', onVMute);
        vTrack?.addEventListener('unmute', onVUnmute);
        aTrack?.addEventListener('mute', onAMute);
        aTrack?.addEventListener('unmute', onAUnmute);

        return () => {
            vTrack?.removeEventListener('mute', onVMute);
            vTrack?.removeEventListener('unmute', onVUnmute);
            aTrack?.removeEventListener('mute', onAMute);
            aTrack?.removeEventListener('unmute', onAUnmute);
        };
    }, [video.stream]);

    return (
        <div className={styles.conferenceCell}>
            <video
                data-socket={video.socketId}
                ref={ref => {
                    if (ref && video.stream) ref.srcObject = video.stream;
                }}
                autoPlay
            />
            {videoMuted && (
                <div className={styles.videoOffOverlay}>
                    <VideocamOffIcon />
                </div>
            )}
            {audioMuted && (
                <div className={styles.micOffBadge}>
                    <MicOffIcon />
                </div>
            )}
        </div>
    );
}

export default function ConferenceGrid({ videos }) {
    const { cols, rows } = getGridDimensions(videos.length);

    return (
        <div
            className={styles.conferenceView}
            style={{
                '--grid-cols': cols,
                '--grid-rows': rows,
            }}
        >
            {videos.map((video) => (
                <ConferenceCell key={video.socketId} video={video} />
            ))}
        </div>
    );
}
