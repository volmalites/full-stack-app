import { React, useState, useContext } from 'react';
import { Main as Context } from '../Context';
import { useHistory, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';

const UserSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const that = useContext(Context.Context);
  const history = useHistory();
  const location = useLocation();

  const submit = e => { // Use submitted information to create a new user
    e.preventDefault();
    that.actions.signUp(firstName, lastName, emailAddress, password).then(res => {
      if (res === 500) {
        history.push('/error', { state: { from: location } }); // Stop execution if internal server error occurs
      } else {
        if (res.ok) {
          that.actions.signIn(emailAddress, password)
            .then(user => {
              if (user === 500) {
                history.push('/error', { state: { from: location } });
              } else {
                if (user === null) {
                  setErrors((
                    <div className="validation--errors">
                      <h3>Authentication failed</h3>
                      <ul>
                        <li>We could not sign you in at the moment.</li>
                      </ul>
                    </div>
                  ));
                } else {
                  history.push('/', { state: { from: location } });
                }
              }
            }).catch(error => {
              setErrors((
                <div className="validation--errors">
                  <h3>Errors</h3>
                    <ul>
                      <li>{ error.message }</li>
                    </ul>
                </div>
              ));
            });
        } else {
          setErrors((
            <div className="validation--errors">
              <h3>Validation Errors</h3>
                <ul>
                  { res.map((err, index) => <li key={ index }>{ err }</li>) }
                </ul>
            </div>
          ));
        }
      }
    }).catch(error => {
      setErrors((
        <div className="validation--errors">
          <h3>Errors</h3>
            <ul>
              <li>{ error.message }</li>
            </ul>
        </div>
      ));
    });
  }

  const cancel = e => {
    e.preventDefault();
    history.push('/', { state: { from: location } });
  }

  return (
    <>
      <div className="form--centered">
        <h2>Sign Up</h2>
        { errors } {/** Validation errors **/}
        <form onSubmit={ submit }>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={ firstName }
            onChange={ e => setFirstName(e.target.value) }
          ></input>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={ lastName }
            onChange={ e => setLastName(e.target.value) }
          ></input>
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
          <button className="button" type="submit">Sign Up</button>
          <button className="button button-secondary" onClick={ cancel }>Cancel</button>
        </form>
        <p>Already have a user account? Click here to <Link  to={{ pathname: "/signin", state: { from: location } }}>sign in</Link>!</p>
      </div>
    </>
  );
}

export { UserSignUp };
