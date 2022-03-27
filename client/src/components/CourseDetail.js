import React,{ useContext, useState, useEffect, useCallback } from 'react';
import { Main as Context } from '../Context';
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const CourseDetail = () => {
  const context = useContext(Context.Context)
  const history = useHistory();
  const authUser = context.authenticatedUser;
  const [errors, setErrors] = useState([]);
  const [course, loadCourse] = useState([]);
  const [courseFound, setCourseFound] = useState(false);
  const [currentCourseOwner, setCurrentCourseOwner] = useState(false);
  const [manageCourse, setManageCourse] = useState("");
  const { id } = useParams();
  const { NotFound } = require('../components/NotFound');
  const location = useLocation();

  const deleteCourse = useCallback(() => { // Use callback in order to prevent infinite loops
    context.data.api('/courses/' + id, 'DELETE', null, true, JSON.parse(authUser)[0].encodedCredentials).then(res => {
        if (res.status === 500) history.push('/error', { state: { from: location } });
        if (res.ok) {
          history.push('/', { state: { from: location } });
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
  }, [authUser, context.data, id, history, location]);

  const manageCourses = useCallback(() => { // Use callback in order to prevent infinite loops
    if ((JSON.parse(authUser)[0].id === currentCourseOwner) && courseFound) { // If currently logged in user owns the course add course management buttons
      setManageCourse(
        <>
          <Link className="button" to={ `/courses/${id}/update` }>Update Course</Link>
          <button className="button" onClick={ deleteCourse }>Delete Course</button>
        </>
      )
    }
  }, [authUser, id, deleteCourse, courseFound, currentCourseOwner]);

  useEffect(() => { // On page load get course
    (async () => {
      let result = await context.data.api('/courses/' + id, 'GET', null, false);
      if (result.status === 500) history.push('/error', { state: { from: location } });
      if (result.ok) {
        setCourseFound(true);
        let data = await result.json();
        setCurrentCourseOwner(data.userId);
        loadCourse(
          (
            <form>
              <div className="main--flex">
                <div>
                  <h3 className="course--detail--title">Course</h3>
                  <h4 className="course--name">{ data.title }</h4>
                  <p>By { data.User.firstName } { data.User.lastName }</p>
                  <ReactMarkdown>{ data.description }</ReactMarkdown>
                </div>
                <div>
                  <h3 className="course--detail--title">Estimated Time</h3>
                  <p>{ (data.estimatedTime || data.estimatedTime !== '') ? data.estimatedTime : 'None specified' }</p>

                  <h3 className="course--detail--title">Materials Needed</h3>
                  <ul className="course--detail--list">
                    <ReactMarkdown>{ (data.materialsNeeded || data.materialsNeeded !== '') ? data.materialsNeeded : 'None specified' }</ReactMarkdown>
                  </ul>
                </div>
              </div>
            </form>
          )
        );
      } else {
        history.push('/notfound');
      }
    })();
    manageCourses();
  }, [context.data, authUser, id, manageCourses, NotFound, history, location]);
  
  return (
    <>
      <div className="actions--bar">
        <div className="wrap">
          { manageCourse }
          <Link className="button button-secondary" to="/">Return to List</Link>
        </div>
      </div>
      <div className="wrap">
        <h2>Course Detail</h2>
        { errors }
        { course }
      </div>
    </>
  );
}

export { CourseDetail };
