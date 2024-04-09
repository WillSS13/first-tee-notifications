import * as React from "react";

function ControlCenter() {
  return (
    <>
      <div className="control-center">
        <div className="control-center-content">
          <div className="control-center-title">Control Center</div>
          <div className="control-center-divider" />
          <div className="run-api-tests-container">
            <button className="run-api-tests-button">Run API Tests</button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .control-center {
          display: flex;
          max-width: 390px;
          flex-direction: column;
          justify-content: center;
        }
        
        .control-center-content {
          border-radius: 15px;
          box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.15);
          background-color: #fff;
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: start;
          padding: 10px 0 80px;
        }
        
        .control-center-title {
          color: #808080;
          margin-left: 11px;
          font: 400 18px Inter, sans-serif;
        }
        
        .control-center-divider {
          border-color: rgba(128, 128, 128, 1);
          border-style: solid;
          border-width: 1px;
          background-color: #808080;
          align-self: stretch;
          min-height: 1px;
          margin-top: 9px;
          width: 100%;
        }
        
        .run-api-tests-container {
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
        
        .run-api-tests-button {
          font-family: Roboto, sans-serif;
          justify-content: center;
          border-radius: 10px;
          background-color: #808080;
          padding: 11px 26px;
          border: none;
          color: #fff;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

export default ControlCenter;