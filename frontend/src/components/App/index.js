import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import Dashboard from '../Dashboard';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

import ErrorBoundary from '../../ErrorBoundary';
import { RecoilRoot } from 'recoil';

const App = () => (
  <ErrorBoundary>
    <Router>
      <RecoilRoot>
        <div>
          <Container>
            <Navigation />
            <Route
              exact
              path={ROUTES.LANDING}
              component={LandingPage}
            />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route path={ROUTES.DASHBOARD} component={Dashboard} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
          </Container>
        </div>
      </RecoilRoot>
    </Router>
  </ErrorBoundary>
);

export default withAuthentication(App);
