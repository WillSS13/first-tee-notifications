import * as React from "react";

const DocumentItem = ({ title }) => (
  <>
    <div className="document-item">
      <div className="document-title">{title}</div>
    </div>
    <style jsx>{`
      .document-item {
        display: flex;
        margin-top: 10px;
        flex-direction: column;
        align-items: start;
      }
      .document-title {
        font-family: Inter, sans-serif;
      }
    `}</style>
  </>
);

const DocumentGroup = ({ title, items }) => (
  <>
    <div className="document-group">
      <div className="group-title">{title}</div>
      <div className="document-list">
        {items.map((item, index) => (
          <DocumentItem key={index} title={item} />
        ))}
      </div>
    </div>
    <style jsx>{`
      .document-group {
        display: flex;
        flex-direction: column;
      }
      .group-title {
        font-family: Inter, sans-serif;
      }
      .document-list {
        display: flex;
        margin-top: 14px;
        padding-left: 10px;
        flex-direction: column;
        align-items: start;
      }
    `}</style>
  </>
);

function Documentation() {
  const documentGroups = [
    {
      title: "Knock",
      items: ["document 1", "document 2"],
    },
    {
      title: "Salesforce",
      items: ["document 1", "document 2"],
    },
  ];

  return (
    <>
      <style jsx>{`
        .documentation-container {
          display: flex;
          max-width: 235px;
          flex-direction: column;
          font-weight: 400;
          justify-content: center;
        }
        .documentation-panel {
          border-radius: 15px;
          box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.15);
          background-color: #fff;
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: start;
          padding: 10px 0 80px;
        }
        .documentation-title {
          color: #808080;
          margin-left: 11px;
          font: 18px Inter, sans-serif;
        }
        .divider {
          border: 1px solid #808080;
          background-color: #808080;
          align-self: stretch;
          min-height: 1px;
          margin-top: 11px;
          width: 100%;
        }
        .documentation-content {
          display: flex;
          width: 88px;
          flex-direction: column;
          font-size: 14px;
          color: #000;
          margin: 14px 0 373px 10px;
        }
      `}</style>

      <div className="documentation-container">
        <div className="documentation-panel">
          <div className="documentation-title">Documentation</div>
          <div className="divider" />
          <div className="documentation-content">
            {documentGroups.map((group, index) => (
              <DocumentGroup
                key={index}
                title={group.title}
                items={group.items}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Documentation;