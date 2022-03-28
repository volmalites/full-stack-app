import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

/** 
* Stateless component that signs the user out
**/

const UserSignOut = ({context}) => {
  useEffect(() => {
    context.actions.signOut();
  });

  return (
    <Redirect to="/signin" />
  );
}

export { UserSignOut };
