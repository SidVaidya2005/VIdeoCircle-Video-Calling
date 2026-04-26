import { useLocalParticipant, VideoTrack } from '@livekit/components-react';
import { Track } from 'livekit-client';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicOffIcon from '@mui/icons-material/MicOff';
import styles from '../styles/videoComponent.module.css';

// Must be rendered inside <LiveKitRoom> so useLocalParticipant is in context.
export default function LocalVideoPIP() {
    const { isCameraEnabled, isMicrophoneEnabled, localParticipant } = useLocalParticipant();

    return (
        <div className={styles.meetUserVideoWrapper}>
            <VideoTrack
                trackRef={{ participant: localParticipant, source: Track.Source.Camera }}
                className={styles.meetUserVideo}
            />
            {!isCameraEnabled && (
                <div className={styles.videoOffOverlay}>
                    <VideocamOffIcon />
                </div>
            )}
            {!isMicrophoneEnabled && (
                <div className={styles.micOffBadge}>
                    <MicOffIcon />
                </div>
            )}
        </div>
    );
}
