import React from "react";
import jwtDecode from "jwt-decode";

export default class Home extends React.Component {
  state = {
    userId: null
  };

  componentWillMount() {
    const { location: { search } } = this.props;
    const queryParams = new URLSearchParams(search);
    const token = queryParams.get("token");
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", queryParams.get("refreshToken"));
    const { user } = jwtDecode(token);
    this.setState({ userId: user.id });
  }

  render() {
    return <h1>userId: {this.state.userId}</h1>;
  }
}
