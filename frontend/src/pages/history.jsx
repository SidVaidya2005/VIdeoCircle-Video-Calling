import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import "../App.css";

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        }
        fetchHistory();
    }, [])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="historyPage">
            <div className="historyHeader">
                <IconButton onClick={() => routeTo("/home")}>
                    <HomeIcon />
                </IconButton>
                <h1>Meeting History</h1>
            </div>

            <div className="historyContent">
                {meetings.length !== 0 ? meetings.map((e, i) => (
                    <div key={i} className="historyCardItem">
                        <div className="historyCardLeft">
                            <span className="historyCardCode">{e.meetingCode}</span>
                            <span className="historyCardDate">{formatDate(e.date)}</span>
                        </div>
                    </div>
                )) : (
                    <div className="historyEmpty">
                        <h3>No meetings yet</h3>
                        <p>Your meeting history will appear here</p>
                    </div>
                )}
            </div>
        </div>
    )
}
