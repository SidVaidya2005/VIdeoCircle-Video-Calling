import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import useASCIICanvas from '../../../shared/hooks/useASCIICanvas';
import withAuth from '../../auth/components/withAuth';
import { historyApi } from '../services/historyApi';

function HistoryPage() {
    const [meetings, setMeetings] = useState([]);
    const [errorOpen, setErrorOpen] = useState(false);
    const routeTo = useNavigate();
    const canvasRef = useASCIICanvas();

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
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
        <div className="historyPage">
            <canvas ref={canvasRef} className="historyCanvas" />
            <div className="historyOverlay" />

            <div className="pageContent historyContent">
                <header className="landingTopBar">
                    <nav className="authTopLeft">
                        <span className="navLinkBracket" onClick={() => routeTo("/home")}>[HOME]</span>
                        <span className="bracketLabel">[V_C_26]</span>
                    </nav>
                    <span className="landingBrand">VideoCircle®</span>
                    <span className="bracketLabel">[HISTORY]</span>
                </header>

                <main className="historyMain">
                    <div className="historyHeading">
                        <p className="authScript">your sessions,</p>
                        <h1 className="historyTitle">MEETING<br />HISTORY</h1>
                    </div>

                    <div className="historyList">
                        {meetings.length !== 0 ? meetings.map((e) => (
                            <div key={`${e.meetingCode}-${e.date}`} className="historyCardItem">
                                <span className="historyCardCode">{e.meetingCode}</span>
                                <span className="historyCardDate">{formatDate(e.date)}</span>
                            </div>
                        )) : (
                            <div className="historyEmpty">
                                <span className="historyEmptySymbol">[∅]</span>
                                <h3>No meetings yet</h3>
                                <p>Your meeting history will appear here</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
            <Snackbar
                open={errorOpen}
                autoHideDuration={4000}
                message="Failed to load meeting history"
                onClose={() => setErrorOpen(false)}
            />
        </>
    );
}

export default withAuth(HistoryPage);
