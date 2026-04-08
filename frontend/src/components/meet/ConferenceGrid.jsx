import { useTracks, VideoTrack } from '@livekit/components-react';
import { Track } from 'livekit-client';
import styles from '../../styles/videoComponent.module.css';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicOffIcon from '@mui/icons-material/MicOff';

function getGridDimensions(count) {
    if (count <= 1) return { cols: 1, rows: 1 };
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    return { cols, rows };
}

function ConferenceCell({ trackRef }) {
    const isVideoMuted = trackRef.publication?.isMuted ?? false;
    const isAudioMuted = !trackRef.participant?.isMicrophoneEnabled;

    return (
        <div className={styles.conferenceCell}>
            <VideoTrack trackRef={trackRef} />
            {isVideoMuted && (
                <div className={styles.videoOffOverlay}>
                    <VideocamOffIcon />
                </div>
            )}
            {isAudioMuted && (
                <div className={styles.micOffBadge}>
                    <MicOffIcon />
                </div>
            )}
        </div>
    );
}

export default function ConferenceGrid() {
    const tracks = useTracks(
        [Track.Source.Camera, Track.Source.ScreenShare],
        { onlySubscribed: false }
    );

    const remoteTracks = tracks.filter((t) => !t.participant.isLocal);
    const { cols, rows } = getGridDimensions(remoteTracks.length);

    return (
        <div
            className={styles.conferenceView}
            style={{
                '--grid-cols': cols,
                '--grid-rows': rows,
            }}
        >
            {remoteTracks.map((trackRef) => (
                <ConferenceCell
                    key={`${trackRef.participant.identity}-${trackRef.source}`}
                    trackRef={trackRef}
                />
            ))}
        </div>
    );
}
