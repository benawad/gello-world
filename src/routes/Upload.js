import React from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import moment from "moment";
import { compose, gql, graphql } from "react-apollo";

class Upload extends React.Component {
  state = {
    name: "",
    file: null
  };

  onDrop = async files => {
    this.setState({ file: files[0] });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  uploadToS3 = async (file, signedRequest) => {
    const options = {
      headers: {
        "Content-Type": file.type
      }
    };
    await axios.put(signedRequest, file, options);
  };

  formatFilename = filename => {
    const date = moment().format("YYYYMMDD");
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7);
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newFilename = `images/${date}-${randomString}-${cleanFileName}`;
    return newFilename.substring(0, 60);
  };

  submit = async () => {
    const { name, file } = this.state;
    const response = await this.props.s3Sign({
      variables: {
        filename: this.formatFilename(file.name),
        filetype: file.type
      }
    });

    const { signedRequest, url } = response.data.signS3;
    await this.uploadToS3(file, signedRequest);

    const graphqlResponse = await this.props.createChampion({
      variables: {
        name,
        pictureUrl: url
      }
    });

    this.props.history.push(
      `/champion/${graphqlResponse.data.createChampion.id}`
    );
  };

  render() {
    return (
      <div>
        <input name="name" onChange={this.onChange} value={this.state.name} />
        <Dropzone onDrop={this.onDrop}>
          <p>
            Try dropping some files here, or click to select files to upload.
          </p>
        </Dropzone>
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }
}

const CreateChampionMutation = gql`
  mutation($name: String!, $pictureUrl: String!) {
    createChampion(name: $name, pictureUrl: $pictureUrl) {
      id
    }
  }
`;

const s3SignMutation = gql`
  mutation($filename: String!, $filetype: String!) {
    signS3(filename: $filename, filetype: $filetype) {
      url
      signedRequest
    }
  }
`;

export default compose(
  graphql(CreateChampionMutation, { name: "createChampion" }),
  graphql(s3SignMutation, { name: "s3Sign" })
)(Upload);
