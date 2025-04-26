import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import "../css/Certificate.css";

interface CertificateProps {
  localUsername: string;
  finalQuizScore: number;
  markAsComplete: (section: string, label: string) => void;
}

const Certificate: React.FC<CertificateProps> = ({ localUsername, finalQuizScore, markAsComplete }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    const element = document.getElementById("certificate-content");
    if (element) {
      const options = {
        margin: [0.5, 0.5],
        filename: "IPv4_Mastery_Certificate.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          scrollY: 0,
          width: 794,
          height: 1123,
          windowWidth: 794,
        },
        jsPDF: {
          unit: "px",
          format: "a4",
          orientation: "portrait",
          hotfixes: ["px_scaling"],
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      html2pdf().set(options).from(element).save();
    } else {
      alert("Certificate content not found.");
    }
  };

  const handleComplete = () => {
    setLoading(true);
    setTimeout(() => {
      alert("🎉 Congratulations on completing the IPv4 Mastery Program!");
      markAsComplete("Certificate", "Certificate");
      window.location.replace("/");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="certificate-wrapper">
      <div className="certificate-box" id="certificate-content">
        <div className="certificate-border">
          <div className="certificate-header">
            <h1 className="cert-title">Certificate of Achievement</h1>
            <div className="medal-container">🏅</div>
            <p className="cert-subtitle">This Certificate is Proudly Presented To</p>
          </div>

          <div className="certificate-body">
            <h2 className="cert-name">{localUsername}</h2>

            <p className="cert-text">
              has successfully completed and demonstrated exceptional proficiency in the comprehensive course
            </p>

            <h3 className="cert-course">IPv4 Addressing Mastery Program</h3>

            <p className="cert-description">
              This intensive program covered all aspects of IPv4 addressing including subnetting, CIDR notation,
              address classes, private vs public addressing, NAT translation, and advanced network design principles.
              The participant has shown outstanding dedication and technical competence throughout the course duration.
            </p>

            <div className="performance-section">
              <div className="performance-item">
                <span>Final Assessment Score:</span>
                <span className="performance-value">{finalQuizScore}%</span>
              </div>

              <div className="performance-item">
                <span>Completion Date:</span>
                <span className="performance-value">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>    
    </div>
  );
};

export default Certificate;
