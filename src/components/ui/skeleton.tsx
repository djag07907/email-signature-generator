import React from "react";

const SkeletonEmailSignature: React.FC = () => {
  return (
    <div
      className="border rounded p-4"
      style={{ width: "100%", maxWidth: "600px" }}
    >
      <div className="flex mb-4">
        <div
          className="skeleton-avatar"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
            marginRight: "16px",
          }}
        />
        <div className="flex-1">
          <div
            className="skeleton-line"
            style={{
              height: "20px",
              width: "80%",
              backgroundColor: "#e0e0e0",
              marginBottom: "8px",
            }}
          />
          <div
            className="skeleton-line"
            style={{ height: "16px", width: "60%", backgroundColor: "#e0e0e0" }}
          />
        </div>
      </div>
      <div
        className="skeleton-line"
        style={{
          height: "16px",
          width: "100%",
          backgroundColor: "#e0e0e0",
          margin: "12px 0",
        }}
      />
      <div
        className="skeleton-line"
        style={{
          height: "16px",
          width: "100%",
          backgroundColor: "#e0e0e0",
          margin: "12px 0",
        }}
      />
      <div
        className="skeleton-line"
        style={{
          height: "16px",
          width: "100%",
          backgroundColor: "#e0e0e0",
          margin: "12px 0",
        }}
      />
      <div className="flex gap-2 mt-4">
        <div
          className="skeleton-social"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
          }}
        />
        <div
          className="skeleton-social"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
          }}
        />
        <div
          className="skeleton-social"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
          }}
        />
      </div>
    </div>
  );
};
export default SkeletonEmailSignature;
