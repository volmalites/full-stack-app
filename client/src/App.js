import {withContext, Context} from './Context';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

// App components 
const { Header } = require('./components/Header');
const { Courses } = require('./components/Courses');
const { CourseDetail } = require('./components/CourseDetail');
const { CreateCourse } = require('./components/CreateCourse');
const { UpdateCourse } = require('./components/UpdateCourse');
const { UserSignIn } = require('./components/UserSignIn');
const { UserSignUp } = require('./components/UserSignUp');
const { UserSignOut } = require('./components/UserSignOut');
const { NotFound } = require('./components/NotFound');
const { Forbidden } = require('./components/Forbidden');
const { UnhandledError } = require('./components/UnhandledError');

// Global HOC context user sign in state
const UserSignInWithContext = withContext(UserSignIn);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignOutWithContext = withContext(UserSignOut);

const { PrivateRoute } = require('./PrivateRoute'); // Routes not accesible by unauthenticated users

function App() {
  return (
    <Router>
      <div className="App">
        <Header context={Context} />

        <Switch>
          <Route exact path="/" component={ Courses } />
          <PrivateRoute exact path="/courses/create" component={ CreateCourse } />
          <PrivateRoute exact path="/courses/:id/update" component={ UpdateCourse } />
          <Route exact path="/courses/:id" component={ CourseDetail } />
          <Route path="/signin" component={ UserSignInWithContext } />
          <Route path="/signup" component={ UserSignUpWithContext } />
          <Route path="/signout" component={ UserSignOutWithContext } />
          <Route path="/notfound" component={ NotFound } />
          <Route path="/forbidden" component={ Forbidden } />
          <Route path="/error" component={ UnhandledError } />
          <Route component={ NotFound } /> {/** Global catcher route for paths that do not exist **/}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
