import React from "react";
import { message, Button, Input, Checkbox } from "antd";
import { gql, graphql } from "react-apollo";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    isAdmin: false,
    errors: {}
  };

  onChange = e => {
    if (e.target.name === "isAdmin") {
      this.setState({
        [e.target.name]: e.target.checked
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  };

  onSubmit = async () => {
    const response = await this.props.mutate({
      variables: this.state
    });
    console.log(response);
    const { register } = response.data;
    if (register.ok) {
      // register was successful
      // redirect to different page or something
    } else {
      // message.error(register.errors[0].message);
      // [{path, message}]
      // {username: 'needs to be between 5 and 10'},
      // pv = {}, cv = {path, message}
      this.setState({
        errors: register.errors.reduce((pv, cv) => {
          pv[cv.path] = cv.message;
          return pv;
        }, {})
      });
    }
  };

  render() {
    return (
      <div>
        <Input
          name="username"
          placeholder="Username"
          onChange={e => this.onChange(e)}
          value={this.state.username}
        />
        {this.state.errors["username"]}
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
        <Checkbox
          name="isAdmin"
          checked={this.state.isAdmin}
          onChange={e => this.onChange(e)}
        >
          Admin?
        </Checkbox>
        <br />
        <Button onClick={() => this.onSubmit()} type="primary">
          Register
        </Button>
      </div>
    );
  }
}

const mutation = gql`
  mutation(
    $username: String!
    $email: String!
    $password: String!
    $isAdmin: Boolean
  ) {
    register(
      username: $username
      email: $email
      password: $password
      isAdmin: $isAdmin
    ) {
      ok
      errors {
        path
        message
      }
      user {
        id
      }
    }
  }
`;

export default graphql(mutation)(Register);
