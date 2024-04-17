import React from 'react';
import '../App.css';

function Confirmed() {
    return (
        <>
            <div className="App gradient-bg">
                <div className="signInWrapper ">
                    <div className="main-login-content">
                    <img src={require("../images/firstTeeLogo.png")} alt="FirstTeeLogo" />
                    <h1 className="name-header poppins-bold">First Tee Pittsburgh Notification Confirmation</h1>
                    <h2 className="unauthorized poppins-light">Thank you for confirming you have read the notification! You may now exit this page.</h2>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Confirmed;