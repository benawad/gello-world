import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { gql, graphql } from 'react-apollo';

class Upload extends React.Component {
  state = {
    name: '',
    file: null,
  };

  onDrop = async files => {
    this.setState({ file: files[0] });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submit = async () => {
    const { name, file } = this.state;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
      formData,
    );

    const graphqlResponse = await this.props.mutate({
      variables: {
        name,
        publicId: response.data.public_id,
      },
    });

    this.props.history.push(`/champion/${graphqlResponse.data.createChampion.id}`);
  };

  render() {
    return (
      <div>
        <input name="name" onChange={this.onChange} value={this.state.name} />
        <Dropzone onDrop={this.onDrop}>
          <p>Try dropping some files here, or click to select files to upload.</p>
        </Dropzone>
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }
}

const CreateChampionMutation = gql`
  mutation($name: String!, $publicId: String!) {
    createChampion(name: $name, publicId: $publicId) {
      id
    }
  }
`;

export default graphql(CreateChampionMutation)(Upload);
