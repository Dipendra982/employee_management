
import React from 'react';
import { Link } from  'react-router-dom';

const Landing = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '700', 
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          WorkNest
        </h1>
        
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '300', 
          marginBottom: '2rem',
          opacity: '0.9'
        }}>
          Staff Management System
        </h2>
        
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '3rem', 
          lineHeight: '1.6',
          opacity: '0.8'
        }}>
          Streamline your workforce management with our comprehensive platform. 
          Track attendance, manage tasks, handle leave requests, and keep your team 
          connected with internal notices and updates.
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            to="/login" 
            className="btn btn-primary"
            style={{ 
              padding: '15px 30px',
              fontSize: '1.1rem',
              borderRadius: '25px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Login
          </Link>
          
          <Link 
            to="/signup" 
            className="btn"
            style={{ 
              padding: '15px 30px',
              fontSize: '1.1rem',
              borderRadius: '25px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            Sign Up
          </Link>
        </div>
        
        <div style={{ 
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          opacity: '0.8'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>For Admins</h3>
            <p style={{ fontSize: '0.9rem' }}>Manage staff, assign tasks, track attendance, and generate reports</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>For Staff</h3>
            <p style={{ fontSize: '0.9rem' }}>Mark attendance, apply for leave, view tasks, and stay updated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
