import React from 'react';
import { Link } from 'react-router-dom';

// Internal server errors will render this page

const UnhandledError = () => {
  return (
    <>
      <h1 className="not-found">Server Error</h1>
      <h1 className="not-found">An internal server error has occurred</h1>
      <h2 className="not-found"><Link to="/">Click here to be redirected to the main page</Link></h2>
    </>
  );
}

export { UnhandledError };
