import React from 'react';
import { Badge, IconButton } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import styles from '../../styles/videoComponent.module.css';

export default function MeetControls({
    video,
    audio,
    screen,
    screenAvailable,
    showModal,
    newMessages,
    handleVideo,
    handleAudio,
    handleScreen,
    handleEndCall,
    setModal,
}) {
    return (
        <div className={styles.buttonContainers}>
            <div className={styles.controlBar}>
                <IconButton onClick={handleVideo}>
                    {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                </IconButton>
                <div className={styles.endCallBtn}>
                    <IconButton onClick={handleEndCall}>
                        <CallEndIcon />
                    </IconButton>
                </div>
                <IconButton onClick={handleAudio}>
                    {audio === true ? <MicIcon /> : <MicOffIcon />}
                </IconButton>

                {screenAvailable === true ?
                    <IconButton onClick={handleScreen}>
                        {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                    </IconButton> : <></>}

                <Badge badgeContent={newMessages} max={999} color='primary'>
                    <IconButton onClick={() => setModal(!showModal)}>
                        <ChatIcon />
                    </IconButton>
                </Badge>
            </div>
        </div>
    );
}
