import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
      <p>&copy; {new Date().getFullYear()} LocalConnect. All rights reserved.</p>
    </footer>
  );
}
