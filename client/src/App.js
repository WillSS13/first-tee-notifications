import logo from './logo.svg';
import { useEffect,useState } from 'react';
import { Box, Button, Checkbox } from '@mui/material';
import jwt_decode from "jwt-decode";
import './App.css';
import { FaArrowLeft,FaEnvelopeOpenText } from "react-icons/fa";
import {useNavigate} from "react-router-dom";

function App() {
  const navigate = useNavigate();

  /* want a more global stage or redox to manage the user object*/
  const [user, setUser] = useState({});
  const [userEmail, setUserEmail] = useState("");


  const [userId, setUserId] = useState("");


  function handleCallbackResponse(response) {

    console.log("Encoded JWT ID token: " + response.credential);

    // decode the user credential sent back from Google
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    localStorage.setItem('user',userObject);
    console.log(user);
    setUserEmail(userObject.email);

    console.log(userEmail);
    localStorage.setItem('userEmail',JSON.stringify(userObject.email));
    // navigate("/classList", {state:{userEmail: userEmail, user: user}});
  }


  if (userEmail !== ""){
    navigate("/classList", {state:{userEmail: userEmail, user: user}});
  }



  useEffect(() => {
    /* global google */
    // google.accounts.id.initialize({
    //   client_id: "657936674200-1a1l2fobo18kk619kt5qs2od9m76p64e.apps.googleusercontent.com",
    //   callback: handleCallbackResponse
    // });
    google.accounts.id.initialize({
      client_id: "577503408571-t7b1p7kh2rppnoeooagkti8t1hnqh3nc.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    console.log("hi");
    
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme:"outline", size:"large"}
    )
    // navigate("/classList", {state:{userEmail: userEmail, user: user}});
  }, []);

  useEffect(() => {
    if(userEmail){
      const emailArray = userEmail.split("@");
      const emailPrefix = emailArray[0];
      console.log(emailPrefix);
      console.log("setting user id");
      // encode user email within the get request 
      fetch(`/coachId?id=${encodeURIComponent(emailPrefix)}`)
        .then((res) => res.json())
        .then((data) => localStorage.setItem('userId', JSON.stringify(data)));
    }
  }, [userEmail]);

  // useEffect(() => {
  //   if(userId){
  //     console.log("this is user id");
  //     console.log(userId);
  //     localStorage.setItem('userId', JSON.stringify(userId));
  //   }
  // }, [userId]);

  // if (user !== {} && session !== [{}]) {
  //   console.log("stop redirecting")
  //   return <Navigate to="/classList" />;
  // }

  return (
    <div className="App gradient-bg">
      <div className="signInWrapper ">
        <div className ="main-login-content">
          <img src={require("./images/firstTeeLogo.png")} alt="FirstTeeLogo" />
          <h1 className ="name-header poppins-medium ">Coach Login</h1>
          <h1 className ="your-class-header poppins-light font-size-large padding-bottom-small">If you are registered as a coach for First Tee Pittsburgh, login below to view your classes and notify students with updates!</h1>
          <div id="signInDiv"></div>
        </div>
        <div className ="login-img">
        </div>
      </div>
    </div>
  );
}

export default App;
