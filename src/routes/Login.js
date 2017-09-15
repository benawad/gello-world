import React from "react";
import { Button, Input } from "antd";
import { gql, graphql } from "react-apollo";
import jwtDecode from "jwt-decode";

class Login extends React.Component {
  state = {
    email: "",
    password: ""
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = async () => {
    try {
      const response = await this.props.mutate({
        variables: this.state
      });
      const { token, refreshToken } = response.data.login;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("login worked!");
      console.log(jwtDecode(token));
    } catch (e) {
      console.log("login failed!");
      console.log(e);
    }
  };

  facebookLogin = () => {
    window.location = "http://localhost:3000/flogin";
  };

  render() {
    return (
      <div>
        <Input
          name="email"
          placeholder="Email"
          onChange={e => this.onChange(e)}
          value={this.state.email}
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          onChange={e => this.onChange(e)}
          value={this.state.password}
        />
        <br />
        <Button onClick={this.onSubmit} type="primary">
          Login
        </Button>
        <Button onClick={this.facebookLogin} type="primary">
          Login with Facebook
        </Button>
      </div>
    );
  }
}

const mutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
    }
  }
`;

export default graphql(mutation)(Login);
