import React from 'react';
import styles from '../../styles/videoComponent.module.css';

export default function ConferenceGrid({ videos }) {
    return (
        <div className={styles.conferenceView}>
            {videos.map((video) => (
                <div key={video.socketId}>
                    <video
                        data-socket={video.socketId}
                        ref={ref => {
                            if (ref && video.stream) {
                                ref.srcObject = video.stream;
                            }
                        }}
                        autoPlay
                    >
                    </video>
                </div>
            ))}
        </div>
    );
}
