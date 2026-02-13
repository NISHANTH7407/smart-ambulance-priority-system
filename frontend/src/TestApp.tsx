import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red' }}>🚑 Test - If you see this, React is working!</h1>
      <p>Backend: Check console for errors</p>
      <button style={{ padding: '10px', background: 'blue', color: 'white' }}>
        Test Button
      </button>
    </div>
  );
};

export default TestApp;
