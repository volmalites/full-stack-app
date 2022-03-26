import React from 'react';
import { Link } from 'react-router-dom';

// Global not found page, applies to non existent pages and content requested from the database by selected pages

const NotFound = () => {
  return (
    <>
      <h1 className="not-found">Error</h1>
      <h1 className="not-found">Page not found</h1>
      <h2 className="not-found"><Link to="/">Click here to be redirected to the main page</Link></h2>
    </>
  );
}

export { NotFound };
