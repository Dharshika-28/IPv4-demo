// frontend/components/footer.tsx

import React from "react";

const Footer = () => {
  const footerStyle: React.CSSProperties = {
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: "24px 0",
    marginTop: "40px",
    textAlign: "center",
  };

  const linkStyle: React.CSSProperties = {
    color: "#ffffff",
    textDecoration: "none",
    margin: "0 8px",
  };

  const linkHoverStyle: React.CSSProperties = {
    textDecoration: "underline",
  };

  return (
    <footer style={footerStyle}>
      <p style={{ fontSize: "14px", margin: "0" }}>
        &copy; {new Date().getFullYear()} Self-Paced Learning Portal. All rights reserved.
      </p>
      <div style={{ marginTop: "8px" }}>
        <a
          href="/terms"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Terms of Service
        </a>
        <span>|</span>
        <a
          href="/privacy"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
