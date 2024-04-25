import React from 'react';
import '../App.css';
import { useNavigate } from "react-router-dom";

function Unauthorized() {
    const navigate = useNavigate();
    const redirectToTarget = () => {
        navigate('/');
      };
    return (
        <>
            <div className="App gradient-bg">
                <div className="signInWrapper ">
                    <div className="main-login-content">
                    <img src={require("../images/firstTeeLogo.png")} alt="FirstTeeLogo" />
                    <h1 className="name-header poppins-bold">Unauthorized User</h1>
                    <h2 className="your-class-header poppins-light font-size-large padding-bottom-small">Only coaches are allowed to access this application!</h2>
                        <div>
                        <button onClick={redirectToTarget}>Go back to Login Page</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Unauthorized;