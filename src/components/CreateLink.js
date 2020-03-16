import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag';

const MUTATION_QUERY = gql`
    mutation PostMutation($description: String!, $url: String!){
        post(description: $description, url: $url){
            id
            createdAt
            url
            description
        }
    }
`

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    const { description, url } = this.state
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <Mutation mutation={MUTATION_QUERY} variables={{description, url}} onCompleted={()=>this.props.history.push('/')} >
            {(PostMutation)=>(
                <button onClick={PostMutation}>Submit</button>
            )}
        </Mutation>
      </div>
    )
  }
}

export default CreateLink
