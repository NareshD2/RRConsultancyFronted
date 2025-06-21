import React from 'react';
import { useFormik } from 'formik';
import './LoginPage.css';
const apiUrl = process.env.REACT_APP_API_URL;

import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch(`${apiUrl}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          alert('Login successful!');
          navigate('/dashboard');
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="container-wrapper">
      {/* Promo Section */}
      <div className="container">
        <div className="container1">
          <img src="https://marketplace.canva.com/EAGTwK0wOTg/2/0/1600w/canva-black-and-white-minimalistic-real-estate-flat-illustrative-logo-afTi-1EmZtc.jpg" height="420" width="420" alt="Promo" />
        </div>
        <h1>Real Estate Consultancy</h1>
        <p>Welcome to Real Estate Consultancy! We will help you in:</p>
        <ul>
          <li>Selling and Buying residential, commercial plots</li>
          <li>Helping you find your dream home</li>
          <li>Providing rental properties in Amaravati and surrounding areas</li>
        </ul>
      </div>

      {/* Login Section */}
      <div className="container">
        <div className="container">
          <img src="https://i.imgur.com/hrUQKKx.png" alt="Ramul Real Estate Logo" />
        </div>
        <h1>Login</h1>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="Password"
            required
          />
          <button type="submit" disabled={formik.isSubmitting}>Login</button>
        </form>
        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
        
        <p><Link to="/">Home Page</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
