import React, { useContext, useState } from 'react'
import withAuth from '../features/auth/components/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../features/auth/context/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    }

    return (
      <>
        <div className="navBar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2>VideoCircle</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <IconButton onClick={() => navigate("/history")}>
              <RestoreIcon />
            </IconButton>
            <span
              style={{
                color: "rgba(221,230,240,0.55)",
                fontSize: "0.88rem",
                fontFamily: "var(--font-body)",
              }}
            >
              History
            </span>
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/auth");
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="meetContainer">
          <div className="leftPanel">
            <div>
              <h2>
                Connect instantly.
                <br />
                Meet anyone, anywhere.
              </h2>
              <div className="meetInputGroup">
                <TextField
                  onChange={(e) => setMeetingCode(e.target.value)}
                  value={meetingCode}
                  label="Meeting Code"
                  variant="outlined"
                />
                <Button onClick={handleJoinVideoCall} variant="contained">
                  Join
                </Button>
              </div>
            </div>
          </div>
          <div className="rightPanel">
            <img srcSet="/logo3.png" alt="Video call illustration" />
          </div>
        </div>
      </>
    );
}

export default withAuth(HomeComponent)
