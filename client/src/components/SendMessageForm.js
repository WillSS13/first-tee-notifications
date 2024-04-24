import React, { useState, useEffect } from 'react';

function SendMessageForm({ sessionId }) {
  const className = JSON.parse(localStorage.getItem("sessionName"));
  const defaultWeatherMessage = "Due to inclement weather, today's class has been cancelled.";
  
  const [msgSubject, setMsgSubject] = useState(localStorage.getItem('msgSubject') || className);
  const [msgValue, setMsgValue] = useState(localStorage.getItem('msgValue') || defaultWeatherMessage);
  const [isMessageSent, setIsMessageSent] = useState(localStorage.getItem('isMessageSent') === 'true');
  const [dateSent, setDateSent] = useState(localStorage.getItem('dateSent') || '');

  useEffect(() => {
    localStorage.setItem('msgSubject', msgSubject);
    localStorage.setItem('msgValue', msgValue);
    localStorage.setItem('isMessageSent', isMessageSent);
    localStorage.setItem('dateSent', dateSent);
    return () => {
      localStorage.removeItem('isMessageSent');
      localStorage.removeItem('msgSubject');
      localStorage.removeItem('msgValue');
      localStorage.removeItem('dateSent');
    };
  }, [msgSubject, msgValue, isMessageSent, dateSent]);

  function ClearFields() {
    setMsgValue("");
    setMsgSubject("");
    setDateSent("");
    localStorage.removeItem('msgSubject');
    localStorage.removeItem('msgValue');
    localStorage.removeItem('dateSent');
  }

  function handleSubmit() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: msgSubject,
        message: msgValue,
        coach: localStorage.getItem('coachName'),
        sessionId: sessionId,
      }),
    };
    fetch('/sendmessage', requestOptions)
      .then(res => {
        setIsMessageSent(true);
        setDateSent(new Date().toLocaleString()); 
        return res.json();
      })
  }

  function handleNewMessage() {
    setIsMessageSent(false);
    setMsgSubject(className);
    setMsgValue(defaultWeatherMessage);
    localStorage.setItem('isMessageSent', 'false');
  }

  if (isMessageSent) {
    return (
      <div className="card-container margin-bottom-large" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="your-class-header-notification poppins-regular">Message Sent!</h1>
        <p><strong>Subject:</strong> {msgSubject}</p>
        <p><strong>Message:</strong> {msgValue}</p>
        <p><strong>Signed:</strong> Coach {localStorage.getItem('coachName')}</p>
        <p><strong>Date Sent: {dateSent} </strong></p>
        <br></br>
        <button onClick={handleNewMessage} className="send-button poppins-regular">
          New Message <i className="fa fa-paper-plane" aria-hidden="true"></i>
        </button>
      </div>
    );
  }

  return (
    <div className="card-container margin-bottom-large">
      <h2 className="your-class-header-notification poppins-regular">Send Notification</h2>
      <hr></hr>
      <div className="card message side-margins">
        <div id="message-form">
          <p className="your-class-header poppins-light" style={{ color: 'black' }}>Notify all members of the class on important announcements <br />Your message will be emailed and text messaged to all members of the class</p>

          <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit({ subject: msgSubject, message: msgValue });
            }}>
            <label className="your-class-header poppins-regular">
              Subject <br></br>
              <input id="subject-message" type='text' value={msgSubject} placeholder='Please enter a subject' className="poppins-light" style={{ width: '100%' }} onChange={(e) => setMsgSubject(e.target.value)} required/>
              <br></br><br></br>
            </label>

            <label className="your-class-header poppins-regular message-container">
              Message <br></br>
              <textarea id="text-message" rows="5" cols="33" value={msgValue} placeholder='Please enter a message' style={{ width: '100%' }} className="poppins-light" onChange={(e) => setMsgValue(e.target.value)} required></textarea><br></br>

              <label className='your-class-header poppins-regular'>
                <i>The message with be signed with Coach followed by your full name.</i><br></br><br></br>
              </label>
              <input id="clear-button" type="button"
                value="Clear Text"
                onClick={ClearFields} />
            </label>

            <button variant="contained" type="submit" className="send-button poppins-regular">Send Message <i className="fa fa-paper-plane" aria-hidden="true"></i></button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SendMessageForm;
