import React from 'react';

const UserDetailCard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">User Name</h2>
      <p>Email: user@example.com</p>
      <p>Role: Admin</p>
      {/* Add more user details as needed */}
    </div>
  );
};

export default UserDetailCard; 