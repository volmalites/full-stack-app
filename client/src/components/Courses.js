import React,{ useContext, useState, useEffect } from 'react';
import { Main as Context } from '../Context';
import { Link, useHistory, useLocation } from 'react-router-dom';

const Courses = () => {
  const context = useContext(Context.Context)
  const authUser = context.authenticatedUser;
  const [courses, loadCourses] = useState([]);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => { // Get all courses on page load
    (async () => {
      let result = await context.data.api('/courses', 'GET', null, false);
      if (result.status === 500) history.push('/error', { state: { from: location } });
      let data = await result.json();
      loadCourses(
        data.map(item => (
          <Link key={item.id} to={'/courses/' + item.id} className="course--module course--link">
            <h2 className="course--label">{ item.title }</h2>
            <h3 className="course--title">{ (item.description.length > 100) ? item.description.substring(0, 100) + '...' : item.description }</h3>
          </Link>
        ))
      );
    })();
  }, [context.data, authUser, history, location]);

  return (
    <>
      <div className="wrap main--grid">
        {
          courses
        }
        <Link to="/courses/create" className="course--module course--add--module">
          <span className="course--add--title">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add"> {/** Svg image plus symbol **/}
              <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
            </svg>
            New Course
          </span>
        </Link>
      </div>
    </>
  );
}

export { Courses };
