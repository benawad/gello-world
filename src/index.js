import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'react-apollo';

import 'antd/dist/antd.css';

import Routes from './routes';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000/graphql',
});
const client = new ApolloClient({
  networkInterface: networkInterface
});

const App = () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
