import React from 'react';

interface TableProps {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <table className="min-w-full bg-white border rounded">
      {children}
    </table>
  );
};

export default Table; 