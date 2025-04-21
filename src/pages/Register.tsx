import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Register.css';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
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

    try {
      await new Promise(res => setTimeout(res, 1200)); // Simulate request
      navigate('/login');
    } catch (error) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join us to explore more!</p>

        {errorMsg && <div className="error-banner">{errorMsg}</div>}

        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label htmlFor="name">User Name</label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="field-error">{errors.name.message}</span>}
          </div>

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
            <input
              type="password"
              id="password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', { required: 'Please confirm your password' })}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="loader" /> : 'Register'}
          </button>

          <p className="redirect-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
