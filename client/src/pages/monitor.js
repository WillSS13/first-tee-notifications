import * as React from "react";
import { useNavigate } from "react-router-dom";
import ApiKeys from "../components/monitor/APIKeys";

const ControlCenterCard = () => {
  return (
    <div className="control-center-card">
      <div className="card-title">Control Center</div>
      <div className="card-divider" />
      <div className="card-content" />
    </div>
  );
};

const ApiKeysCard = () => {
  return (
    <div className="api-keys-card">
      <div className="card-title">API Keys</div>
      <div className="card-divider" />
      <ApiKeys />
    </div>
  );
};

const RecentErrorsCard = () => {
  return (
    <div className="recent-errors-card">
      <div className="card-title">Recent Errors</div>
      <div className="card-divider" />
    </div>
  );
};

const SystemHealthCard = () => {
  return (
    <div className="system-health-card">
      <div className="card-title">System Health</div>
      <div className="card-divider" />
    </div>
  );
};

const DocumentationCard = () => {
  return (
    <div className="documentation-card">
      <div className="card-title">Documentation</div>
      <div className="card-divider" />
    </div>
  );
};

function MonitoringSystem() {
  const navigate = useNavigate();

  function handleSignOut(event) {
    navigate("../");
    localStorage.clear();
    sessionStorage.clear();
  }

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

      <div className="page-title">Monitoring System</div>
      <div className="page-content">
        <div className="content-row">
          <div className="content-column main-column">
            <div className="card-row">
              <div className="card-column">
                <ControlCenterCard />
              </div>
              <div className="card-column">
                <ApiKeysCard />
              </div>
            </div>
            <RecentErrorsCard />
          </div>
          <div className="content-column side-column">
            <SystemHealthCard />
            <DocumentationCard />
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-title {
          color: #28a94c;
          align-self: start;
          background-color: #fff;
          align-items: center;
          margin-bottom: 20px;
          padding: 30px 60px 0;
          padding-left: 15%;
          font: 800 30px Inter, sans-serif;
        }

        .page-content {
          display: flex;
          flex-direction: column;
          position: relative;
          height: auto;
          padding-bottom: 30px;
          margin: 0 15%;
        }

        .content-row {
          gap: 20px;
          display: flex;
        }

        .content-column {
          display: flex;
          flex-direction: column;
          line-height: normal;
        }

        .main-column {
          width: 75%;
          margin-left: 0;
        }

        .side-column {
          width: 25%;
          margin-left: 20px;
        }

        .card-row {
          gap: 20px;
          display: flex;
        }

        .card-column {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 50%;
        }

        .control-center-card,
        .api-keys-card,
        .recent-errors-card,
        .system-health-card,
        .documentation-card {
          border-radius: 15px;
          box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.15);
          background-color: #fff;
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: start;
          padding: 10px 0 16px;
        }

        .control-center-card,
        .api-keys-card {
          height: 225px;
        }

        .recent-errors-card,
        .documentation-card {
          height: 600px;
          flex-grow: 1;
        }

        .recent-errors-card {
          margin-top: 30px;
        }

        .documentation-card {
          margin-top: 15px;
        }

        .system-health-card {
          height: 90px;
          flex-grow: 1;
          margin: 0px 0 25px;
        }

        .card-title {
          color: #808080;
          margin-left: 11px;
          font: 400 18px Inter, sans-serif;
        }

        .card-divider {
          border-color: rgba(128, 128, 128, 1);
          border-style: solid;
          border-width: 0.5px;
          background-color: #808080;
          align-self: stretch;
          min-height: 0.5px;
          margin-top: 5px;
          margin-bottom: 5px;
          width: 100%;
        }

        .card-content {
          display: flex;
          width: 140px;
          max-width: 100%;
          flex-direction: column;
          font-size: 14px;
          color: var(--black-white-100, #fff);
          font-weight: 700;
          line-height: 129%;
          justify-content: center;
          margin: 23px 0 43px 24px;
        }
      `}</style>
      <div className="top-bar">
        <div className="top-bar-content">
          <img
            src={require("../images/FirstTeeMain.png")}
            alt="FirstTeeLogo"
          />
          <a href="/monitor">
            <span>Monitoring System</span>
          </a>
          <a href="https://firsttee.my.site.com/parentRegistration/s/privacy-policy?language=en_US&website=www.firstteepittsburgh.org">
            <span>Privacy Policy</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MonitoringSystem;
