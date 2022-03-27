import { React, useState, useContext } from 'react';
import { Main as Context } from '../Context';
import { useHistory, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';

const UserSignIn = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const that = useContext(Context.Context);
  const history = useHistory();
  const [errors, setErrors] = useState([]);
  const location = useLocation();

  const referer = location.state || {from: { pathname: '/' }}; // Once signed in the user will be sent to this route, route user came from

  const submit = e => { // Attempt to log user in
    e.preventDefault();
    that.actions.signIn(emailAddress, password)
      .then(user => {
        if (user === 500) {
          history.push('/error');
        } else if (user.status === 401) {
            setErrors((
              <div className="validation--errors">
                <h3>Authentication failed</h3>
                  <ul>
                    <li>{ user.message }</li>
                  </ul>
              </div>
            ));
        } else {
          if (user === null) {
            setErrors((
              <div className="validation--errors">
                <h3>Authentication failed</h3>
                  <ul>
                    <li>We could not sign you in, please reevaluate your log in credentials and try again.</li>
                  </ul>
              </div>
            ));
          } else {
            history.push(referer.from.pathname);
          }
        }
      }).catch(error => {
        if (error) {
          setErrors((
            <div className="validation--errors">
              <h3>Errors</h3>
                <ul>
                  <li>{ error.message }</li>
                </ul>
            </div>
          ));
        }
      });
  }

  const cancel = e => {
    e.preventDefault();
    history.push('/');
  }
  
  return (
    <>
      <div className="form--centered">
        <h2>Sign In</h2>
        { errors } {/** Validation errors **/}
        <form onSubmit={ submit }>
          <label htmlFor="emailAddress">Email Address</label>
          <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            value={ emailAddress }
            onChange={ e => setEmailAddress(e.target.value) }
          ></input>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={ password }
            onChange={ e => setPassword(e.target.value) }
          ></input>
          <button className="button" type="submit">Sign In</button>
          <button className="button button-secondary" onClick={ cancel }>Cancel</button>
        </form>
        <p>Don't have a user account? Click here to <Link to={{ pathname: "/signup", state: { from: location } }}>sign up</Link>!</p>
      </div>
    </>
  );
}

export { UserSignIn };
