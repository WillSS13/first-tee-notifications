import React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import "../App.css";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCallback } from 'react';
import moment from "moment";

import Delivered from "../icons/delivered";
import LinkClicked from "../icons/link_clicked";
import Queued from "../icons/queued";
import Sent from "../icons/sent";
import Undelivered from "../icons/undelivered";
import SendMessageForm from "../components/SendMessageForm";

function Message() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState([]);
  const [sessionId, setSessionId] = useState([]);
  const [sessionName, setSessionName] = useState([]);
  const [participant, setParticipant] = useState([{}]);
  const [coach, setCoach] = useState([{}]);
  const [participantStatuses, setParticipantStatuses] = useState([{}]);
  const [coachStatuses, setCoachStatuses] = useState([{}]);

  function handleSignOut(event) {
    navigate("../");
    localStorage.clear();
    sessionStorage.clear();
  }

  useEffect(() => {
    const emails = JSON.parse(localStorage.getItem("userEmail"));
    const id = JSON.parse(localStorage.getItem("sessionId"));
    const name = JSON.parse(localStorage.getItem("sessionName"));

    if (emails) setUserEmail(emails);
    if (id) setSessionId(id);
    if (name) setSessionName(name);
  }, []);

  const getStatuses = useCallback(
    async (type, data) => {
      if (sessionId && data.length > 0) {
        let userIds = data.map((item) => `${sessionId}_${item.id}`);

        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: userIds }),
        };

        try {
          const res = await fetch("/getStatuses", requestOptions);
          const statusData = await res.json();
          if (type === "participant") {
            setParticipantStatuses(statusData);
          } else {
            setCoachStatuses(statusData);
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    [sessionId]
  );

  useEffect(() => {
    if (sessionId) {
      fetch(
        `/participants?participant=${encodeURIComponent(
          JSON.parse(localStorage.getItem("sessionId"))
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          setParticipant(data);
          getStatuses("participant", data);
        });
    }
  }, [sessionId, getStatuses]);

  useEffect(() => {
    if (participant) {
      fetch(`/coaches?session=${encodeURIComponent(sessionId)}`)
        .then((res) => res.json())
        .then((data) => {
          setCoach(data);
          getStatuses("coach", data);
        });
    }
  }, [participant, sessionId, getStatuses]);

  return (
    <div className="App">
      <div className="top-bar">
        <div className="top-bar-content">
          <img
            src={require("../images/firstTeeLogo.png")}
            alt="FirstTeeLogo"
          />
          <button onClick={(e) => handleSignOut(e)}>
            <span className="poppins-regular">
              Sign Out&nbsp;&nbsp;<i className="fa fa-sign-out"></i>
            </span>
          </button>
        </div>
      </div>

      <div className="main-margin">
        <div className="margin-top-large">
          <Link
            to="/classList"
            className="back-button poppins-light"
            state={{ userEmail: userEmail }}
          >
            <FaArrowLeft /> &nbsp;Back to Classes
          </Link>
          <h1 className="name-header poppins-medium">{sessionName}</h1>
        </div>

        <SendMessageForm sessionId={sessionId} />

        <div className="card-container margin-bottom-large">
          <h2 className="your-class-header poppins-regular">
            Message Statuses
          </h2>
          <hr></hr>
          <div className="card message side-margins">
            <div className="icon-row">
              <div className="icon-text-container">
                <Undelivered />
                <span>Undelivered</span>
              </div>
              <div className="icon-text-container">
                <Queued />
                <span>Queued</span>
              </div>
              <div className="icon-text-container">
                <Sent />
                <span>Sent</span>
              </div>
              <div className="icon-text-container">
                <Delivered />
                <span>Delivered</span>
              </div>
              <div className="icon-text-container">
                <LinkClicked />
                <span>Read</span>
              </div>
            </div>
            <p className="icon-description poppins-light">
              These are the icons you might see for notifications.
            </p>
          </div>
        </div>

        {/*  coach members */}
        <div className="card-container margin-bottom-large">
          <h2 className="your-class-header poppins-regular">Coaching Staff</h2>
          <hr></hr>
          <div className="card message side-margins">
            {coach && (
              <div
                id="session-participants"
                style={{ marginTop: "30px", width: "100%" }}
              >
                {coach.map((data, key) => {
                  return (
                    <Box
                      color="black"
                      bgcolor="lightgray"
                      m={2}
                      p={1}
                      key={key}
                      sx={{
                        borderRadius: "16px",
                      }}
                    >
                      <div className="class-content">
                        <div className="class-text">
                          <p className="class-title poppins-medium">
                            {data.name}
                          </p>
                          <p className="student-num poppins-regular">
                            {data.phone
                              ? data.phone
                              : "No phone number available"}
                          </p>
                          <p className="student-num poppins-regular">
                            {data.email ? data.email : "No email available"}
                          </p>
                        </div>
                        <div className="email-button">
                        {coachStatuses[key] && (
                          <>
                            <StatusIcon status={coachStatuses[key].link_clicked !== "null" ? "link_clicked" : coachStatuses[key].status} />
                            <p className="student-num poppins-regular">
                              {coachStatuses[key].link_clicked !== "null" ?
                                (coachStatuses[key].workflow === 'twilio' ? "Text read" :
                                coachStatuses[key].workflow === 'mailersend' ? "Email read" : "Read") :
                                (coachStatuses[key].workflow === 'twilio' ? `Text ${coachStatuses[key].status}` :
                                coachStatuses[key].workflow === 'mailersend' ? `Email ${coachStatuses[key].status}` :
                                coachStatuses[key].status)}
                            </p>
                            <p className="date-time poppins-regular">
                              {coachStatuses[key].link_clicked !== "null" ?
                                moment(coachStatuses[key].link_clicked).format('MM/DD, hh:mm A') :
                                moment(coachStatuses[key].created_at).format('MM/DD, hh:mm A')}
                            </p>
                          </>
                        )}
                        </div>
                      </div>
                    </Box>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/*  class members */}
        <div className="card-container margin-bottom-large">
          <h2 className="your-class-header poppins-regular">Class Members</h2>
          <hr></hr>
          <div className="card message side-margins">
            {participant && (
              <div
                id="session-participants"
                style={{ marginTop: "30px", width: "100%" }}
              >
                {participant.map((data, key) => {
                  return (
                    <Box
                      color="black"
                      bgcolor="lightgray"
                      m={2}
                      p={1}
                      key={key}
                      sx={{
                        borderRadius: "16px",
                      }}
                    >
                      <div className="class-content">
                        <div className="class-text">
                          <p className="class-title poppins-medium">
                            {data.contact_name}
                          </p>
                          <p className="student-num poppins-regular">
                            {data.primary_contact_phone
                              ? data.primary_contact_phone
                              : "No phone number available"}
                          </p>
                          <p className="student-num poppins-regular">
                            {data.primary_contact_email
                              ? data.primary_contact_email
                              : "No email available"}
                          </p>
                        </div>
                        <div className="email-button">
                          {participantStatuses[key] && (
                            <>
                              <StatusIcon status={participantStatuses[key].link_clicked !== "null" ? "link_clicked" : participantStatuses[key].status} />
                              <p className="student-num poppins-regular">
                                {participantStatuses[key].link_clicked !== "null" ?
                                  (participantStatuses[key].workflow === 'twilio' ? "Text read" :
                                  participantStatuses[key].workflow === 'mailersend' ? "Email read" : "Read") :
                                  (participantStatuses[key].workflow === 'twilio' ? `Text ${participantStatuses[key].status}` :
                                  participantStatuses[key].workflow === 'mailersend' ? `Email ${participantStatuses[key].status}` :
                                  participantStatuses[key].status)}
                              </p>
                              <p className="date-time poppins-regular">
                                {participantStatuses[key].link_clicked !== "null" ?
                                  moment(participantStatuses[key].link_clicked).format('MM/DD, hh:mm A') :
                                  moment(participantStatuses[key].created_at).format('MM/DD, hh:mm A')}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </Box>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="top-bar">
        <div className="top-bar-content">
          <img
            src={require("../images/FirstTeeMain.png")}
            alt="FirstTeeLogo"
          />
          <a href="https://firsttee.my.site.com/parentRegistration/s/privacy-policy?language=en_US&website=www.firstteepittsburgh.org">
            <span>Privacy Policy</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status }) {
  switch (status) {
    case "delivered":
      return <Delivered />;
    case "link_clicked":
      return <LinkClicked />;
    case "queued":
      return <Queued />;
    case "sent":
      return <Sent />;
    case "undelivered":
      return <Undelivered />;
    default:
      return null;
  }
}

export default Message;
