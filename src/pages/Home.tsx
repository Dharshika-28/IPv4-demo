import React from 'react';
import { Link } from 'react-router-dom';


const Home: React.FC = () => {
    return (
        <div>
            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>

            <Link to="/adminDashboard">Admin</Link>
        </div>
    );
  };
  
  export default Home;