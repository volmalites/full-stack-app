import React from 'react';
import { Link } from 'react-router-dom';

// Page renders when a logged in user is not the owner of the content requested

const Forbidden = () => {
  return (
    <>
      <h1 className="not-found">Access denied</h1>
      <h1 className="not-found">You are not authorized to view this content</h1>
      <h2 className="not-found"><Link to="/">Click here to be redirected to the main page</Link></h2>
    </>
  );
}

export { Forbidden };
