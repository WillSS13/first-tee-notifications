import * as React from "react";

const statusImages = [
  "https://cdn.builder.io/api/v1/image/assets/TEMP/b6f687c43385a95110a6057a52ffb140d1c8019b7579e544556f4baea374e1f6?apiKey=72d0f7fe66e74d399d50057814cab9d5&",
  "https://cdn.builder.io/api/v1/image/assets/TEMP/06d4d79223240dd0f070b4e994b50eff5e7e44a9c147323196aa914eb706206d?apiKey=72d0f7fe66e74d399d50057814cab9d5&",
  "https://cdn.builder.io/api/v1/image/assets/TEMP/75e6b3d28eaa5d287809cb0c8913919c8abf353d242f641fd2ad31f48f72f14a?apiKey=72d0f7fe66e74d399d50057814cab9d5&",
  "https://cdn.builder.io/api/v1/image/assets/TEMP/c0de99d94200273b88e0eac7dea7d5d1be210d087b88af822c433bed1c5f3c83?apiKey=72d0f7fe66e74d399d50057814cab9d5&"
];

const apiData = [
  {
    name: "salesforce",
    status: statusImages[0]
  },
  {
    name: "Knock",
    status: statusImages[1]
  },
  {
    name: "twilio", 
    status: statusImages[2]
  },
  {
    name: "mailersend",
    status: statusImages[3]
  }
];

const ApiItem = ({ name, status }) => (
  <div className="api-item">
    <div className="api-details">
      <div className={`api-name ${name.toLowerCase()}`}>{name}</div>
      <div className="more-details-link">More Details</div>
    </div>
    <div className="api-status">
      <div className="status-label">Status:</div>
      <img src={status} alt={`${name} API status`} className="status-icon" />
    </div>
  </div>
);

function ApiKeys() {
  return (
    <>
      <div className="api-list">
        {apiData.map((api, index) => (
          <ApiItem key={index} name={api.name} status={api.status} />
        ))}
      </div>

      <style jsx>{`
        .api-list {
          display: flex;
          width: 100%;
          flex-direction: column;
          text-align: center;
          align-items: center;
          wrap: wrap;
          margin-top: 5px;
          margin-bottom: 5px;
        }

        .api-item {
          display: flex;
          gap: 10px;
          width: 90%;
          flex-grow: 1;
          margin-top: 5px;
          margin-bottom: 5px;
          justify-content: space-between;
          align-items: center;
        }

        .api-status,
        .api-details {
          justify-content: space-between;
          border-radius: 10px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
          background-color: #fff;
          display: flex;
          gap: 10px;
          width: 100%;
          padding: 10px 20px;
          flex-grow: 1;
          height: auto;
        }

        .api-status {
          font-size: 12px;
          color: #000;
          font-weight: 700;
          white-space: nowrap;
          flex: 1;
          flex-grow: 1;
          padding: 10px;
        }

        .api-name {
          font: italic 400 16px Inter, -apple-system, Roboto, Helvetica, sans-serif;
        }

        .salesforce {
          color: #059dd9;
        }

        .knock {
          color: #e85744;
        }

        .twilio {
          color: #f4314a;
        }

        .mailersend {
          color: #4c48e0;
        }

        .more-details-link {
          color: #0083bb;
          text-decoration: underline;
          margin: auto 0;
          font: 700 12px Inter, sans-serif;
        }

        .status-label {
          font-family: Inter, sans-serif;
          margin: auto 0;
          flex-grow: 1;
        }

        .status-icon {
          flex-grow: 1;
          width: 18px;
          height: 18px;
          object-fit: contain;
        }
      `}</style>
    </>
  );
}

export default ApiKeys;