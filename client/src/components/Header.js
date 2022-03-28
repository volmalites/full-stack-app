import React, { useContext } from 'react';
import { Main as Context } from '../Context';
import { Link, useLocation } from 'react-router-dom';

/** 
* This is a stateless component that will render at the top of every page in the application
* Handles user logged in and logged out states
**/

const Header = () => { // Always rendered to top of application
  const that = useContext(Context.Context);
  const authUser = (that.authenticatedUser) ? JSON.parse(that.authenticatedUser)[0] : false; // Logged in or not
  const location = useLocation();

  return (
    <>
      <header>
        <div className="wrap header--flex">
          <h1 className="header--logo">
            <a href="/">Courses</a>
          </h1>
          <nav>
            {/** If a user is logged in or not **/}
            {authUser ? (
              <React.Fragment>
                <ul className="header--signedin">
                  <li>
                    Welcome, {authUser.firstName + ' ' + authUser.lastName}!
                  </li>
                  <li>
                    <Link to={{ pathname: "/signout", state: { from: location } }}>Sign Out</Link>
                  </li>
                </ul>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <ul className="header--signedout">
                  <li>
                    <Link className="signup" to={{ pathname: "/signup", state: { from: location } }}>Sign Up</Link>
                  </li>
                  <li>
                    <Link className="signin" to={{ pathname: "/signin", state: { from: location } }}>Sign In</Link>
                  </li>
                </ul>
              </React.Fragment>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

export { Header };
