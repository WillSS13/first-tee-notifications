import React, { useState, useEffect } from 'react';

function SendMessageForm({ sessionId }) {
  const [msgSubject, setMsgSubject] = useState("Class Cancelled");
  const [msgValue, setMsgValue] = useState("THIS IS A TEST!");

  useEffect(() => {
    setMsgValue("THIS IS A TEST!");
    setMsgSubject("Class Cancelled");
  }, []);

  function ClearFields() {
    document.getElementById("subject-message").value = "";
    document.getElementById("text-message").value = "";
    setMsgValue("");
    setMsgSubject("");
  }

  function handleSubmit() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: msgSubject, message: msgValue, coachId: sessionId })
    };
    fetch('/sendmessage', requestOptions)
      .then(res => {
        alert(`Message sent: \n\n Subject: ${msgSubject} \n\n Message: ${msgValue} \n\n See below for the status of each message.`);
        res.json();
      })
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
              <input id="subject-message" type='text' value={msgSubject} placeholder='Please enter a subject' className="poppins-light" style={{ width: '100%' }} onChange={(e) => setMsgSubject(e.target.value)} />
              <br></br><br></br>
            </label>

            <label className="your-class-header poppins-regular message-container">
              Message <br></br>
              <textarea id="text-message" rows="5" cols="33" value={msgValue} placeholder='Please enter a message' style={{ width: '100%' }} className="poppins-light" onChange={(e) => setMsgValue(e.target.value)}></textarea><br></br><br></br>
              <input id="clear-button" type="button"
                value="Clear Text"
                onClick={ClearFields} />
            </label>

            <button variant="contained" type="submit" className="send-button poppins-regular">Send <i className="fa fa-paper-plane" aria-hidden="true"></i></button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SendMessageForm;
