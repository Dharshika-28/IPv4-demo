import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);
    setErrorMsg('');
  
    try {
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const resData = await response.json();
  
        // Assuming your backend returns:
        // { token: string, username: string, role: 'admin' | 'user' }
  
        // Save user data to localStorage
        localStorage.setItem('token', resData.token);
        localStorage.setItem('username', resData.username);
        localStorage.setItem('role', resData.role);
  
        // Log for debug
        console.log("Login success:", resData);
  
        // Navigate based on role
        if (resData.role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/modules');
        }
        
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.message || 'Invalid credentials');
      }
  
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-wrapper">
      <div className="login-card">
      <button 
            style={{
              position: "absolute",
              top: "20px",
              right: "0",
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#fff",
              padding: "0 28px"
            }}
            onClick={() => navigate("/")}
          >
            ×
          </button>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please login to your account</p>

        {errorMsg && <div className="error-banner">{errorMsg}</div>}

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password', { required: 'Password is required' })}
                style={{ flex: 1, paddingRight: '60px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  marginLeft: '-50px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#555'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <div className="form-footer justify-end">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <span className="loader" /> : 'Login'}
          </button>

          <p className="redirect-txt">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
