import React,{ useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Main as Context } from '../Context';
import { useHistory, useParams, useLocation } from "react-router-dom";

/**
* Updates a specific course which is first loaded into the DOM from the id param provided
**/

const UpdateCourse = () => {
  const context = useContext(Context.Context)
  const authUser = JSON.parse(context.authenticatedUser)[0];
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState([]);
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [noneFound, setNoneFound] = useState(false);
  const [denied, setDenied] = useState(false);
  const { id } = useParams();
  const { NotFound } = require('../components/NotFound');
  const { Forbidden } = require('../components/Forbidden');
  const cancelApi = useRef(false);
  const location = useLocation();

  const getCourse = useCallback(() => { // Use callback to prevent infinite loops, gets course to be updated
    context.data.api('/courses/' + id, 'GET', null, true, authUser.encodedCredentials).then(res => {
      if (res.status === 500) history.push('/error', { state: { from: location } });
      return res.json();
    }).then(data => { 
      if (data.message) {
        setNoneFound(true);
      } else {
        setDenied(data.userId !== authUser.id);
        setTitle(() => data.title);
        setDescription(() => data.description);
        setEstimatedTime(() => data.estimatedTime);
        setMaterialsNeeded(() => data.materialsNeeded);
      }
    });
  }, [authUser.encodedCredentials, id, context.data, authUser.id, history, location]);

  useEffect(() => {
    if (!denied) getCourse();
    if (denied) history.push('/forbidden', { state: {from: location } });
    return () => { cancelApi.current = true };
  }, [getCourse, denied, history, location]);

  const submit = e => { // Attempt to update course
    e.preventDefault();
    context.data.api('/courses/' + id, 'PUT', { title, description, estimatedTime, materialsNeeded }, true, authUser.encodedCredentials).then(res => {
        if (res.ok) {
          history.push('/courses/' + id, { state: { from: location } });
        } else {
          return res.json();
        }
      }).then(response => {
        if (response) {
          setErrors((
            <div className="validation--errors">
              <h3>Validation Errors</h3>
                <ul>
                  { response.message.map((err, index) => <li key={ index }>{ err }</li>) }
                </ul>
            </div>
          ));
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
    history.push('/courses/' + id, { state: { from: location } });
  }

  if (noneFound) { // If current user is not the owner
    return (
      NotFound()
    )
  } else if (denied) {
    return (
      Forbidden()
    )
  } else {
    return (
      <>
        <div className="wrap">
        <h2>Update Course</h2>
        { errors } {/** Validation errors **/}
        <form onSubmit={ submit }>
        <div className="main--flex">
          <div>
            <label htmlFor="courseTitle">Course Title</label>
            <input id="courseTitle" name="courseTitle" type="text" value={ title } onChange={ e => setTitle(e.target.value) }></input>
              <p>By { authUser.firstName } { authUser.lastName }</p>
              <label htmlFor="courseDescription">Course Description</label>
              <textarea id="courseDescription" name="courseDescription" value={ description } onChange={ e => setDescription(e.target.value) }></textarea>
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input id="estimatedTime" name="estimatedTime" type="text" value={ estimatedTime } onChange={ e => setEstimatedTime(e.target.value) }></input>
                <label htmlFor="materialsNeeded">Materials Needed</label>
                <textarea id="materialsNeeded" name="materialsNeeded" value={ materialsNeeded } onChange={ e => setMaterialsNeeded(e.target.value) }></textarea>
              </div>
            </div>
            <button className="button" type="submit">Update Course</button>
            <button className="button button-secondary" onClick={ cancel }>Cancel</button>
          </form>
        </div>
      </>
    );
  }
}

export { UpdateCourse };
