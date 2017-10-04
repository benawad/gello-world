import React from "react";
import { gql, graphql } from "react-apollo";
import { Image } from "cloudinary-react";

const Champion = ({ data: { loading, getChampion } }) => {
  if (loading) {
    return <h1>loading...</h1>;
  }

  const { name, pictureUrl } = getChampion;

  return (
    <div>
      <h1>{name}</h1>
      <img src={pictureUrl} />
    </div>
  );
};

const getChampionQuery = gql`
  query($id: Int!) {
    getChampion(id: $id) {
      name
      pictureUrl
    }
  }
`;

export default graphql(getChampionQuery, {
  options: ({ match }) => ({
    variables: match.params
  })
})(Champion);
