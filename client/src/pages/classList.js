import React from 'react'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import '../App.css';



function ClassList() {

  const navigate = useNavigate();

  const { state } = useLocation();
  const { name } = state;
  const [session, setSession] = useState([{}]);
  const [test, setTest] = useState('');


  useEffect(() => {
    const dataFetch = async (id) => {
      const data = await (await fetch(`/sessions?session=${encodeURIComponent(id)}`)).json();
      setSession(data);
    }

    const id = JSON.parse(localStorage.getItem('userId'));

    if (id) {
      dataFetch(id);
    }

  }, []);

  function handleSignOut(event) {
    navigate("../");
    localStorage.clear();
    sessionStorage.clear();
  }

  function getParticipants(sessionId, sessionName) {
    localStorage.setItem('sessionId', JSON.stringify(sessionId));
    localStorage.setItem('sessionName', JSON.stringify(sessionName));
    setTest("hi");
  }

  if (test !== "") {
    navigate("/message", { state: { name: name } });
  }

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div className="App">
      <div className="flex-wrapper">
        <body>
          <div className="top-bar">
            <div className="top-bar-content">
              <img src={require("../images/firstTeeLogo.png")} alt="FirstTeeLogo" />
              <button onClick={(e) => handleSignOut(e)}>
                <span className="poppins-regular">Sign Out&nbsp;&nbsp;<i className="fa fa-sign-out"></i></span>
              </button>
            </div>
          </div>
          {session &&
            <div className="main-margin">
              <div>
                <h1 className="name-header">Welcome {name}!</h1>
              </div>
              <div className="card-container margin-bottom-large">
                <h2 className="your-class-header">Your Classes</h2>
                <hr></hr>
                <div className="side-margins">
                  {JSON.stringify(session) === "[{}]" &&
                    <div id='coach-sessions' style={{ marginTop: '30px', width: '100%' }}>
                      <button className="view-button poppins-regular" onClick={(e) => refreshPage()}>Click to View Classes&nbsp;&nbsp;<i className="fa fa-plus"></i></button>
                    </div>
                  }
                  {JSON.stringify(session) !== "[{}]" &&
                    <div id='coach-sessions' style={{ marginTop: '30px', width: '100%' }}>
                      {
                        session.map((data, key) => {
                          return (
                            <Box color="black" bgcolor="lightgray" m={2} p={1} key={key}
                              sx={{
                                borderRadius: '16px',
                                width: '100%',
                              }}>
                              <div className="class-content">
                                <div className="class-text">
                                  <p className="class-title poppins-medium">{data.session_name}</p>
                                  <p className="student-num poppins-regular">Start: {data.start_date} <br />End: {data.end_date}</p>
                                </div>
                                <div className="class-button">
                                  <button onClick={(e) => getParticipants(data.id, data.session_name)} className="c-btn"></button>
                                </div>
                              </div>
                            </Box>
                          );
                        })
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </body>

        <div className="bottom-bar">
          <div className="bottom-bar-content">
            <img src={require("../images/FirstTeeMain.png")} alt="FirstTeeLogo" />
            <a href="https://firsttee.my.site.com/parentRegistration/s/privacy-policy?language=en_US&website=www.firstteepittsburgh.org">
              <span>Privacy Policy</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassList