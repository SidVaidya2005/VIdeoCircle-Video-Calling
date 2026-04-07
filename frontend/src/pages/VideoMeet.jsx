import React from 'react';
import styles from '../styles/videoComponent.module.css';
import useVideoMeet from '../hooks/useVideoMeet';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicOffIcon from '@mui/icons-material/MicOff';
import LobbyScreen from '../components/meet/LobbyScreen';
import MeetControls from '../components/meet/MeetControls';
import ChatPanel from '../components/meet/ChatPanel';
import ConferenceGrid from '../components/meet/ConferenceGrid';

export default function VideoMeetComponent() {
    const {
        localVideoref,
        lobbyCanvasRef,
        videoAvailable,
        audioAvailable,
        video,
        setVideo,
        audio,
        setAudio,
        videoPending,
        audioPending,
        screen,
        showModal,
        setModal,
        screenAvailable,
        messages,
        message,
        setMessage,
        newMessages,
        askForUsername,
        username,
        setUsername,
        videos,
        handleVideo,
        handleAudio,
        handleScreen,
        handleEndCall,
        sendMessage,
        connect,
        navigate,
    } = useVideoMeet();

    return (
        <div>
            {askForUsername === true ?
                <LobbyScreen
                    lobbyCanvasRef={lobbyCanvasRef}
                    localVideoref={localVideoref}
                    username={username}
                    setUsername={setUsername}
                    video={video}
                    audio={audio}
                    videoAvailable={videoAvailable}
                    audioAvailable={audioAvailable}
                    setVideo={setVideo}
                    setAudio={setAudio}
                    videoPending={videoPending}
                    audioPending={audioPending}
                    connect={connect}
                    navigate={navigate}
                />
                :
                <div className={styles.meetVideoContainer}>
                    <div className={styles.meetMainArea}>
                        <ConferenceGrid videos={videos} />
                        <div className={styles.meetUserVideoWrapper}>
                            <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>
                            {!video && (
                                <div className={styles.videoOffOverlay}>
                                    <VideocamOffIcon />
                                </div>
                            )}
                            {!audio && (
                                <div className={styles.micOffBadge}>
                                    <MicOffIcon />
                                </div>
                            )}
                        </div>
                        <MeetControls
                            video={video}
                            audio={audio}
                            screen={screen}
                            screenAvailable={screenAvailable}
                            showModal={showModal}
                            newMessages={newMessages}
                            handleVideo={handleVideo}
                            handleAudio={handleAudio}
                            handleScreen={handleScreen}
                            handleEndCall={handleEndCall}
                            setModal={setModal}
                        />
                    </div>

                    <ChatPanel
                        showModal={showModal}
                        messages={messages}
                        message={message}
                        setMessage={setMessage}
                        sendMessage={sendMessage}
                        setModal={setModal}
                    />
                </div>
            }
        </div>
    );
}
