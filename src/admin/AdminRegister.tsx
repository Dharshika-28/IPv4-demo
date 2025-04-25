import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import MenuBar from '../styles/MenuBar.tsx';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AdminRegister: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setLoading(true);
    setErrorMsg('');

    if (data.password !== data.confirmPassword) {
      setErrorMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    const userPayload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'admin' 
    };

    try {
      const response = await fetch('http://localhost:8080/api/user/adminsignup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      navigate('/login');
    } catch (error: any) {
      setErrorMsg(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const blueColor = '#007BFF';

  return (
    <div>
      <MenuBar/>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '90vh',
          backgroundColor: '#f0f8ff',
          padding: '20px'
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '480px',
            padding: '30px',
            boxSizing: 'border-box',
          }}
        >
          <h2 style={{ color: 'black', marginBottom: '10px', textAlign: 'center' }}>
            Create Account
          </h2>
          <p style={{ color: 'black', textAlign: 'center', marginBottom: '20px' }}>
            Join us to explore more!
          </p>

          {errorMsg && (
            <div
              style={{
                backgroundColor: '#ffcccc',
                color: '#a00',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '15px',
                textAlign: 'center',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="name" style={{ display: 'block', color: 'black', marginBottom: '5px' }}>
                User Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Name is required' })}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: errors.name ? '2px solid #a00' : `1px solid ${blueColor}`,
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: 'black',
                }}
              />
              {errors.name && (
                <span style={{ color: '#a00', fontSize: '0.85rem' }}>{errors.name.message}</span>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="email" style={{ display: 'block', color: 'black', marginBottom: '5px' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { required: 'Email is required' })}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: errors.email ? '2px solid #a00' : `1px solid ${blueColor}`,
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: 'black',
                }}
              />
              {errors.email && (
                <span style={{ color: '#a00', fontSize: '0.85rem' }}>{errors.email.message}</span>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="password" style={{ display: 'block', color: 'black', marginBottom: '5px' }}>
                Password
              </label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password', { required: 'Password is required' })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '4px',
                    border: errors.password ? '2px solid #a00' : `1px solid ${blueColor}`,
                    outline: 'none',
                    boxSizing: 'border-box',
                    paddingRight: '60px',
                    color: 'black',
                  }}
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
                    color: blueColor,
                    userSelect: 'none',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <span style={{ color: '#a00', fontSize: '0.85rem' }}>{errors.password.message}</span>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', color: 'black', marginBottom: '5px' }}>
                Confirm Password
              </label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  {...register('confirmPassword', { required: 'Please confirm your password' })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '4px',
                    border: errors.confirmPassword ? '2px solid #a00' : `1px solid ${blueColor}`,
                    outline: 'none',
                    boxSizing: 'border-box',
                    paddingRight: '60px',
                    color: 'black',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  style={{
                    marginLeft: '-50px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: blueColor,
                    userSelect: 'none',
                  }}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <span style={{ color: '#a00', fontSize: '0.85rem' }}>{errors.confirmPassword.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: blueColor,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <span
                  style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    border: '3px solid white',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
              ) : (
                'Register'
              )}
            </button>
          </form>

          <p style={{ marginTop: '15px', color: 'black', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: blueColor, textDecoration: 'underline' }}>
              Login here
            </Link>
          </p>

          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
