import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import TimeCards from './TimeCard';

const Dashboard = () => {
  return (
    <div>
      <h1>Timezone Dashboard</h1>
      <p>Add timezones you would like to keep track of here.</p>
      <TimeCards />
    </div>
  );
};

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(Dashboard);
