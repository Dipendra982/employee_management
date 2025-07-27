
import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: '👥',
      title: 'Staff Management',
      description: 'Comprehensive employee database with profile management and role-based access control'
    },
    {
      icon: '📊',
      title: 'Attendance Tracking',
      description: 'Real-time attendance monitoring with automated reporting and analytics'
    },
    {
      icon: '📋',
      title: 'Task Management',
      description: 'Assign, track, and manage tasks with progress monitoring and deadline alerts'
    },
    {
      icon: '📅',
      title: 'Leave Management',
      description: 'Streamlined leave application process with approval workflows and balance tracking'
    },
    {
      icon: '📢',
      title: 'Notice Board',
      description: 'Internal communication platform for announcements and company updates'
    },
    {
      icon: '📈',
      title: 'Reports & Analytics',
      description: 'Detailed insights and performance metrics with customizable reporting'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navigation Header */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            WorkNest
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link 
              to="/login"
              style={{
                padding: '10px 20px',
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '500',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              Login
            </Link>
            <Link 
              to="/signup"
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '8rem 2rem 6rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: '700',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            Modern Employee Management
          </h1>
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '3rem',
            opacity: '0.9',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Empower your organization with comprehensive workforce management tools. 
            Streamline operations, boost productivity, and keep your team connected.
          </p>
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/signup"
              style={{
                padding: '18px 36px',
                fontSize: '1.1rem',
                background: 'white',
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
              }}
            >
              Get Started Free
            </Link>
            <Link 
              to="/login"
              style={{
                padding: '18px 36px',
                fontSize: '1.1rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '6rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Everything You Need
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Comprehensive tools to manage your workforce efficiently and effectively
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                style={{
                  padding: '3rem',
                  borderRadius: '16px',
                  background: '#f8fafc',
                  border: '1px solid #0f5fc7ff',
                  transition: 'all 0.6s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#64748b',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section style={{ padding: '6rem 2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Built for Everyone
            </h2>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem'
          }}>
            <div style={{
              padding: '3rem',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '2rem'
              }}>
                👨‍💼
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1rem'
              }}>
                For Administrators
              </h3>
              <p style={{
                color: '#64748b',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                Complete control over staff management, task assignment, attendance monitoring, 
                and comprehensive reporting with real-time analytics and insights.
              </p>
              <ul style={{
                textAlign: 'left',
                color: '#64748b',
                listStyle: 'none',
                padding: 0
              }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ Staff profile management</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Task assignment & tracking</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Attendance reports</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Leave approval workflow</li>
              </ul>
            </div>
            
            <div style={{
              padding: '3rem',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '2rem'
              }}>
                👩‍💻
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1rem'
              }}>
                For Staff Members
              </h3>
              <p style={{
                color: '#64748b',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                Easy-to-use interface for daily tasks, attendance tracking, leave applications, 
                and staying updated with company notices and personal performance metrics.
              </p>
              <ul style={{
                textAlign: 'left',
                color: '#64748b',
                listStyle: 'none',
                padding: 0
              }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ Mark daily attendance</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ View assigned tasks</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Apply for leave</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Company updates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        padding: '6rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            Ready to Transform Your Workplace?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '3rem',
            opacity: '0.9'
          }}>
            Join thousands of organizations already using WorkNest to streamline their operations
          </p>
          <Link 
            to="/signup"
            style={{
              padding: '18px 36px',
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              borderRadius: '12px',
              display: 'inline-block',
              boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.3)';
            }}
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1e293b',
        color: 'white',
        padding: '3rem 2rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            WorkNest
          </div>
          <p style={{
            opacity: '0.7',
            marginBottom: '2rem'
          }}>
            Empowering organizations with modern workforce management solutions
          </p>
          <div style={{
            borderTop: '1px solid #334155',
            paddingTop: '2rem',
            opacity: '0.6'
          }}>
            © 2025 WorkNest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
