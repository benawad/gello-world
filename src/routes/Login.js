import React from 'react';
import { Button, Input } from 'antd';
import { gql, graphql } from 'react-apollo';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onSubmit = async () => {
    const response = await this.props.mutate({
      variables: this.state,
    });
    const { token, refreshToken } = response.data.login;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  render() {
    return (
      <div>
        <Input
          name='email'
          placeholder='Email'
          onChange={e => this.onChange(e)}
          value={this.state.email} />
        <Input
          name='password'
          placeholder='Password'
          type='password'
          onChange={e => this.onChange(e)}
          value={this.state.password} />
        <br />
        <Button onClick={() => this.onSubmit()} type="primary">Login</Button>
      </div>
    );
  }
}

const mutation = gql`
mutation ($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    refreshToken
  }
}
`;

export default graphql(mutation)(Login);