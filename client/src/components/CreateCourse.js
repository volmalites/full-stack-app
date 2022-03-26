import React,{ useContext, useState } from 'react';
import { Main as Context } from '../Context';
import { useHistory, useLocation } from "react-router-dom";

const CreateCourse = () => {
  const context = useContext(Context.Context)
  const authUser = JSON.parse(context.authenticatedUser)[0];
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState([]);
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const location = useLocation();

  const submit = e => { // When a new course is being created
    e.preventDefault();
    context.data.api('/courses', 'POST', { title, description, estimatedTime, materialsNeeded, userId: authUser.id }, true, authUser.encodedCredentials).then(res => {
        if (res.status === 500) history.push('/error', { state: { from: location } });
        if (res.ok) {
          history.push(res.headers.get('Location'), { state: { from: location } });
        } else {
          return res.json();
        }
      }).then(response => {
        if (response) {
          setErrors((
            <div className="validation--errors">
              <h3>Validation Errors</h3>
                <ul>
                  { response.errors.map((err, index) => <li key={ index }>{ err }</li>) }
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
    history.push('/', { state: { from: location } }); // Cancel goes back to viewing all courses
  }

  return (
    <>
      <div className="wrap">
      <h2>Create Course</h2>
      { errors }
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
          <button className="button" type="submit">Create Course</button>
          <button className="button button-secondary" onClick={ cancel }>Cancel</button>
        </form>
      </div>
    </>
  );
}

export { CreateCourse };
