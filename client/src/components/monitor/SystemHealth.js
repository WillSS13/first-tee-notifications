import * as React from "react";

function SystemHealth() {
  return (
    <>
      <div className="system-health-container">
        <div className="system-health-card">
          <div className="system-health-title">System Health</div>
          <div className="system-health-divider" />
          <div className="system-health-status">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/800fbc8d40ad04e39f750acd89e83c6394922095caa632f20cc473b8dbe84e75?apiKey=72d0f7fe66e74d399d50057814cab9d5&"
              className="status-icon"
              alt="System health status icon"
            />
            <div className="status-text">
              All Systems <br /> Operational
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .system-health-container {
          display: flex;
          max-width: 235px;
          flex-direction: column;
          color: #808080;
          font-weight: 400;
          justify-content: center;
        }
        
        .system-health-card {
          border-radius: 15px;
          box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.15);
          background-color: #fff;
          display: flex;
          width: 100%;
          flex-direction: column;
          padding: 10px 0;
        }
        
        .system-health-title {
          align-self: start;
          margin-left: 11px;
          font: 18px Inter, sans-serif;
        }
        
        .system-health-divider {
          border: 1px solid #808080;
          background-color: #808080;
          min-height: 1px;
          margin-top: 5px;
          width: 100%;
        }
        
        .system-health-status {
          justify-content: center;
          align-self: center;
          display: flex;
          margin-top: 8px;
          padding-right: 20px;
          gap: 20px;
          font-size: 12px;
        }
        
        .status-icon {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 40px;
        }
        
        .status-text {
          font-family: Inter, sans-serif;
          margin: auto 0;
        }
      `}</style>
    </>
  );
}

export default SystemHealth;
