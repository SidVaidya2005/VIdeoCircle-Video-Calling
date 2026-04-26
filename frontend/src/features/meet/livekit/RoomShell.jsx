import { useState, useCallback, useRef } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { VideoPresets } from 'livekit-client';
import { env } from '../../../shared/lib/env';
import ConferenceGrid from '../components/ConferenceGrid';
import LocalVideoPIP from '../components/LocalVideoPIP';
import MeetControls from '../components/MeetControls';
import ChatPanel from '../components/ChatPanel';
import styles from '../styles/videoComponent.module.css';

// In-room layout — must live inside <LiveKitRoom> so child hooks have context.
function RoomView({ onEndCall }) {
    const [showModal, setModal] = useState(false);
    const [newMessages, setNewMessages] = useState(0);
    const showModalRef = useRef(showModal);
    showModalRef.current = showModal;

    const handleSetModal = useCallback((v) => {
        setModal(v);
        if (v) setNewMessages(0);
    }, []);

    const handleNewMessage = useCallback(() => {
        if (!showModalRef.current) setNewMessages((n) => n + 1);
    }, []);

    return (
        <div className={styles.meetVideoContainer}>
            <RoomAudioRenderer />
            <div className={styles.meetMainArea}>
                <ConferenceGrid />
                <LocalVideoPIP />
                <MeetControls
                    showModal={showModal}
                    newMessages={newMessages}
                    setModal={handleSetModal}
                    handleEndCall={onEndCall}
                />
            </div>
            <ChatPanel
                showModal={showModal}
                setModal={handleSetModal}
                onNewMessage={handleNewMessage}
            />
        </div>
    );
}

export default function RoomShell({ token, mediaPrefs, onLeave }) {
    return (
        <LiveKitRoom
            token={token}
            serverUrl={env.livekitUrl}
            connect
            audio={mediaPrefs.audio}
            video={mediaPrefs.video}
            onDisconnected={onLeave}
            style={{ display: 'contents' }}
            options={{ adaptiveStream: true, dynacast: true }}
            videoCaptureDefaults={{ resolution: VideoPresets.h720.resolution }}
        >
            <RoomView onEndCall={onLeave} />
        </LiveKitRoom>
    );
}
