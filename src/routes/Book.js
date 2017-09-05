import React from "react";
import { graphql, gql } from "react-apollo";
import { Redirect } from "react-router-dom";

const Book = ({ data }) => {
  if (!data) {
    return <Redirect to={{ pathname: "/404" }} />;
  }

  const { loading, getBook } = data;

  if (loading) {
    return <h1>loading...</h1>;
  }

  if (!loading && !getBook) {
    return <Redirect to={{ pathname: "/404" }} />;
  }

  return <h1>{getBook.title}</h1>;
};

const bookQuery = gql`
  query($id: Int!) {
    getBook(id: $id) {
      id
      title
    }
  }
`;

export default graphql(bookQuery, {
  skip: props => !parseInt(props.match.params.id),
  options: props => ({
    variables: { id: props.match.params.id }
  })
})(Book);
