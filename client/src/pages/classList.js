import React from 'react'
import { useEffect,useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Button, Checkbox } from '@mui/material';
import jwt_decode from "jwt-decode";
import {useNavigate} from "react-router-dom";
import '../App.css';



function ClassList() {

  const navigate = useNavigate();

  const {state} = useLocation();
  const { userEmail, user, name } = state; // Read values passed on state
  // console.log(name);
  const [users, setUser] = useState(user);
  const [session, setSession] = useState([{}]);
  const [participant, setParticipant] = useState([{}]);
  const [test, setTest] = useState('');
  const [userId, setUserId] = useState("");
  const [sessionChange, setSessionChange] = useState(false);


  useEffect(() => {
    /* global google */
    // console.log("setting user Id");

    const dataFetch = async (id) => {
      const data = await (await fetch(`/sessions?session=${encodeURIComponent(id)}`)).json();
      setSession(data);
    }
    const id = JSON.parse(localStorage.getItem('userId'));
    if (id) {
      setUserId(id);
      console.log(id);
      dataFetch(id);
    }
    // const idFetch = async () => {
    //   const data = await JSON.parse(localStorage.getItem('userId'));
    //   setUserId(data);
    // }

    
    
    // const emailArray = userEmail.split("@");
    // const emailPrefix = emailArray[0];
    // console.log(emailPrefix);

    // // encode user email within the get request 
    // console.log(`http://localhost:3000/sessions?session=${encodeURIComponent(emailPrefix)}`);
    // fetch(`/sessions?session=${encodeURIComponent(emailPrefix)}`)
    //   .then((res) => res.json())
    //   .then((data) => setSession(data));
    // fetch(`/sessions?session=${encodeURIComponent(JSON.parse(localStorage.getItem('userId')))}`)
    //   .then((res) => res.json())
    //   .then((data) => setSession(data));
  }, []);

  // useEffect(() => {
  //   /* global google */
  //   console.log("userId changed");
  //   console.log(userId);
  //   if (userId) {
  //     fetch(`/sessions?session=${encodeURIComponent(userId)}`)
  //       .then((res) => res.json())
  //       .then((data) => setSession(data));
  //   }
    
  // }, [userId]);

  useEffect(() => {
    /* global google */
    
    if (session){
      setSessionChange(true);
    }
  }, [session]);

  useEffect(() => {
    /* global google */
    
    if (sessionChange){
      console.log("here");
    }
  }, [sessionChange]);
  
  
  function handleSignOut(event) {
    navigate("../");
  }

  function getParticipants(sessionId, sessionName) {
    // navigate("/message", {state:{userEmail: userEmail, sessionId: sessionId, sessionName: sessionName}});
    // navigate("/message", {state:{sessionId: sessionId, sessionName: sessionName}});
    localStorage.setItem('sessionId', JSON.stringify(sessionId));
    localStorage.setItem('sessionName', JSON.stringify(sessionName));
    setTest("hi");
  }

  if (test !== ""){
    navigate("/message");
  }

  function getParticipantsLength(sessionId, data) {
    fetch(`/participants?participant=${encodeURIComponent(sessionId)}`)
    .then((res) => res.json())
    .then((data) => setParticipant(data));
    return participant.length;    
  }

  function refreshPage() {
    window.location.reload(false);
  }


  return (
    <div className="App">
      <div className="top-bar">
        <div className="top-bar-content">
          <img src={require("../images/firstTeeLogo.png")} alt="FirstTeeLogo" />
          <button onClick={(e) => handleSignOut(e)}>
            <span className="poppins-regular">Sign Out&nbsp;&nbsp;<i className="fa fa-sign-out"></i></span>
          </button>
        </div>
      </div>
      { session && 
        <div className="main-margin">
          <div>
          {/* <img src={user.picture}></img> */}
          <h1 className="name-header">Welcome {name}!</h1>
          <button onClick={(e) => refreshPage()}>View Classes</button>
        </div>
        <div className="card-container margin-bottom-large">
          <h2 className="your-class-header">Your Classes</h2>
          <hr></hr>
          <div className="side-margins">

          <div id='coach-sessions' style={{marginTop:'30px',width:'100%'}}>
            {
              session.map((data,key)=>{
                console.log(data);
                return (
                  <Box color="black" bgcolor="lightgray" m={2} p={1} key={key} 
                    sx={{
                      borderRadius: '16px',
                      width: '100%',
                    }}>
                      <div className="class-content">
                        <div className = "class-text">
                          <p className="class-title poppins-medium">{data.session_name}</p>
                          <p className="student-num poppins-regular">Start: {data.start_date} <br/>End: {data.end_date}</p>
                        </div>
                        <div className= "class-button">
                          <button onClick={(e)=>getParticipants(data.id, data.session_name)} className="c-btn"></button>
                        </div>
                      </div>
                  </Box>
                );
              })
            }
          </div>
          </div>
        </div>
        </div>
      }
      <div className="top-bar">
        <div className="top-bar-content">
          <img src={require("../images/FirstTeeMain.png")} alt="FirstTeeLogo" />
          <a href="https://firsttee.my.site.com/parentRegistration/s/privacy-policy?language=en_US&website=www.firstteepittsburgh.org">
            <span>Privacy Policy</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ClassList