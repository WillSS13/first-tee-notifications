import * as React from "react";

function ErrorItem({ imgSrc, errorText }) {
  return (
    <div className="error-item">
      <img src={imgSrc} alt="" className="error-icon" />
      <div className="error-text">{errorText}</div>
    </div>
  );
}

function RecentErrors() {
  const errorData = [
    { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6ddbe79354c592be0e73ed4eaa5dd74d20bc6cb51edf8e77b87c80b9b478d744?apiKey=72d0f7fe66e74d399d50057814cab9d5&", errorText: "Error 1" },
    { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6ddbe79354c592be0e73ed4eaa5dd74d20bc6cb51edf8e77b87c80b9b478d744?apiKey=72d0f7fe66e74d399d50057814cab9d5&", errorText: "Error 1" },
    { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6ddbe79354c592be0e73ed4eaa5dd74d20bc6cb51edf8e77b87c80b9b478d744?apiKey=72d0f7fe66e74d399d50057814cab9d5&", errorText: "Error 1" },
  ];

  return (
    <>
      <div className="recent-errors-container">
        <div className="recent-errors-wrapper">
          <div className="recent-errors-title">Recent Errors</div>
          <div className="recent-errors-divider" />
          <div className="recent-errors-list">
            {errorData.map((error, index) => (
              <ErrorItem key={index} imgSrc={error.imgSrc} errorText={error.errorText} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .recent-errors-container {
          display: flex;
          max-width: 825px;
          flex-direction: column;
          font-size: 18px;
          font-weight: 400;
          justify-content: center;
        }

        .recent-errors-wrapper {
          border-radius: 15px;
          box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.15);
          background-color: #fff;
          display: flex;
          width: 100%;
          flex-direction: column;
          padding: 10px 0 80px;
        }

        @media (max-width: 991px) {
          .recent-errors-wrapper {
            max-width: 100%;
          }
        }

        .recent-errors-title {
          color: #808080;
          font-family: Inter, sans-serif;
          align-self: start;
          margin-left: 11px;
        }

        @media (max-width: 991px) {
          .recent-errors-title {
            margin-left: 10px;
          }
        }

        .recent-errors-divider {
          border: 1px solid #808080;
          background-color: #808080;
          min-height: 1px;
          margin-top: 9px;
          width: 100%;
        }

        @media (max-width: 991px) {
          .recent-errors-divider {
            max-width: 100%;
          }
        }

        .recent-errors-list {
          justify-content: center;
          align-self: center;
          display: flex;
          width: 100%;
          max-width: 704px;
          flex-direction: column;
          color: #000;
          margin: 38px 0 39px;
        }

        @media (max-width: 991px) {
          .recent-errors-list {
            max-width: 100%;
          }
        }

        .error-item {
          background-color: #bababa;
          display: flex;
          gap: 17px;
          padding: 0 20px;
          margin-top: 24px;
        }

        .error-item:first-child {
          margin-top: 0;
        }

        @media (max-width: 991px) {
          .error-item {
            flex-wrap: wrap;
          }
        }

        .error-icon {
          aspect-ratio: 0.59;
          object-fit: auto;
          object-position: center;
          width: 59px;
        }

        .error-text {
          font-family: Inter, sans-serif;
          align-self: start;
          margin-top: 14px;
          flex-grow: 1;
          flex-basis: auto;
        }

        @media (max-width: 991px) {
          .error-text {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}

export default RecentErrors;
