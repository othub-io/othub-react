import React from "react";
import "../../css/navigation/footer.css";

const footer = () => {
  return (
    <div className="footer">
      <header className="footer-header">
        <p>
          Built by the Origintrail Community. Open Sourced on{" "}
          <a href="https://github.com/othub-io">Github</a>.{" "}
          <a href="https://github.com/othub-io/.github/blob/main/profile/DISCLAIMER.md">
            Disclaimer
          </a>
          .
        </p>
      </header>
    </div>
  );
};

export default footer;
