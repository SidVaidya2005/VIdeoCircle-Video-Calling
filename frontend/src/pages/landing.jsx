import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            <div className="landingOrb landingOrb1" />
            <div className="landingOrb landingOrb2" />

            <nav>
                <div className='navHeader'>
                    <h2><span>Apna</span> Video Call</h2>
                </div>
                <div className='navlist'>
                    <p onClick={() => router("/aljk23")}>Join as Guest</p>
                    <p onClick={() => router("/auth")}>Register</p>
                    <div onClick={() => router("/auth")} role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div>
                    <h1>
                        <span>Connect</span> with<br />your loved ones
                    </h1>
                    <p>Cover any distance with crystal-clear video calls — free, instant, reliable.</p>
                    <div role='button'>
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>
                <div>
                    <img src="/mobile.png" alt="Mobile app preview" />
                </div>
            </div>
        </div>
    )
}
