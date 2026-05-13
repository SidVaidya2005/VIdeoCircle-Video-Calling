import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import withAuth from '../../auth/components/withAuth';
import { historyApi } from '../services/historyApi';

function HistoryPage() {
    const [meetings, setMeetings] = useState([]);
    const [errorOpen, setErrorOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await historyApi.getHistory();
                setMeetings(history);
            } catch {
                setErrorOpen(true);
            }
        };
        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="page">
            <div className="gridBackdrop gridBackdrop--fixed" />
            <div className="pageContent">
                <header className="topBar">
                    <div className="topBar__group">
                        <button className="btn nav" onClick={() => navigate('/home')}>HOME</button>
                        <div className="brand">
                            <span>video</span>
                            <span className="brand__dot" />
                            <span>circle</span>
                        </div>
                    </div>
                    <span className="overline">HISTORY</span>
                </header>

                <main
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '48px 24px 64px',
                        gap: 28,
                    }}
                >
                    <div style={{ width: '100%', maxWidth: 720 }}>
                        <div className="heroOverline" style={{ marginBottom: 14 }}>
                            <span className="heroOverline__dot" />
                            YOUR SESSIONS
                        </div>
                        <h1
                            className="heroTitle"
                            style={{
                                fontSize: 'clamp(34px, 5vw, 56px)',
                                margin: '0 0 6px',
                            }}
                        >
                            Meeting history
                        </h1>
                    </div>

                    <div
                        style={{
                            width: '100%',
                            maxWidth: 720,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                        }}
                    >
                        {meetings.length !== 0 ? (
                            meetings.map((e) => (
                                <div
                                    key={`${e.meetingCode}-${e.date}`}
                                    className="listCard"
                                    onClick={() => navigate(`/${e.meetingCode}`)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(ev) => {
                                        if (ev.key === 'Enter') navigate(`/${e.meetingCode}`);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="listCard__title">{e.meetingCode}</span>
                                    <span className="listCard__meta">{formatDate(e.date)}</span>
                                </div>
                            ))
                        ) : (
                            <div className="emptyState">
                                <span className="emptyState__glyph">[∅]</span>
                                <h3 className="emptyState__title">No meetings yet</h3>
                                <p className="emptyState__hint">
                                    Your meeting history will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Snackbar
                open={errorOpen}
                autoHideDuration={4000}
                message="Failed to load meeting history"
                onClose={() => setErrorOpen(false)}
            />
        </div>
    );
}

export default withAuth(HistoryPage);
