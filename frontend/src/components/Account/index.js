import React, { Component } from 'react';
import { compose } from 'recompose';

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

import { Grid, Card, Header } from 'semantic-ui-react';

const SIGN_IN_METHODS = [
  {
    id: 'password',
    provider: null,
  },
];

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div>
        <Header as="h2">Account: {authUser.email}</Header>
        <Grid columns={2}>
          <Grid.Column>
            <Card fluid={true}>
              <Card.Content>
                <Card.Header>Reset Password</Card.Header>
                <Card.Description>
                  <PasswordForgetForm />
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid={true}>
              <Card.Content>
                <Card.Header>New Password</Card.Header>
                <Card.Description>
                  <PasswordChangeForm />
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);
