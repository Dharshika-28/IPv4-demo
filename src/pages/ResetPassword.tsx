import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        localStorage.setItem("resetEmail", email); // Store email for ChangePassword
        setMessage("Verifying");
        setTimeout(() => navigate("/change-password"), 2000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to send reset link. Please try again later.");
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setMessage('');
      setEmail('');
    }, 3000);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <button style={styles.closeBtn} onClick={() => navigate("/login")}>×</button>

        <h2 style={styles.title}>Reset Your Password</h2>
        <p style={styles.subtitle}>Enter your registered email and we’ll send you reset instructions.</p>

        {message && <div style={styles.message}>{message}</div>}

        <form onSubmit={handleReset} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #0f0f0f, #1a1a1a)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    color: '#fff',
  },
  card: {
    background: '#111',
    borderRadius: '20px',
    padding: '40px 30px',
    maxWidth: '450px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '0.95rem',
    marginBottom: '25px',
    color: '#aaa',
  },
  message: {
    backgroundColor: '#222',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '20px',
    color: '#00ffcc',
    border: '1px solid #00ffcc',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    fontSize: '0.85rem',
    color: '#ccc',
    marginBottom: '6px',
    display: 'block',
  },
  input: {
    width: '93%',
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #333',
    backgroundColor: '#222',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    background: 'linear-gradient(135deg, #ff0080, #7928ca)',
    padding: '12px 20px',
    borderRadius: '12px',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s ease',
  },
};

export default ResetPassword;
