import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

export const Context = React.createContext(); 

export class Provider extends Component {
  state = {
    authenticatedUser: Cookies.get('authenticatedUser') || null, // Set cookie in global contect
  };

  constructor() {
    super();
    this.data = new Data(); // instantiate new object that manages user log in and sign out
  }

  render() {
    const { authenticatedUser } = this.state;
    const value = {
      authenticatedUser,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
        signUp: this.signUp,
      },
    };
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  } // Pass through global context data to children

  /**
   * Create new user to be stored in database
   * @param {firstName} Name for user
   * @param {lastName} Last name for user
   * @param {emailAddress} Email address for user
   * @param {password} Password for user
   * @returns {Object}
   */

  signUp = async (firstName, lastName, emailAddress, password) => {
    const result = await this.data.createUser(firstName, lastName, emailAddress, password);
    if (result.error === 500) return result.error; // Check for server errors and terminate code
    return result;
  }
  
  /**
   * Sign user in and set session data
   * @param {username} Username, an email address in this case
   * @param {password} Password to validate against username
   * @returns {Object}
   */
  
  signIn = async (username, password) => {
    const user = await this.data.getUser(username, password);
    if (user.error === 500) return user.error; // Check for server errors and terminate code
    if (user !== null) {
      this.setState(() => {
        return {
          authenticatedUser: JSON.stringify(user),
        };
      });
      const cookieOptions = {
        expires: 1 // 1 day
      };
      Cookies.set('authenticatedUser', JSON.stringify(user), cookieOptions);
    }
    return user;
  }

  signOut = () => {
    this.setState({ authenticatedUser: null });
    Cookies.remove('authenticatedUser');
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

 export function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

const Main = { withContext, Context };
export { Main };
