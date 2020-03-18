import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Link from './Link'

export const FEED_QUERY=gql`
    {
        feed{
            links{
                id
                createdAt
                url
                description
                postedBy{
                    id
                    name
                }
                votes{
                    id
                    user{
                        id
                    }
                }
            }
        }
    }
`

class LinkList extends Component {

    _updateCacheAfterVote=(store, createdVote, linkId)=>{
        const data = store.readQuery({query: FEED_QUERY});
        const votedLink = data.feed.links.find(link=>link.id===linkId)
        votedLink.votes = createdVote.link.votes
        store.writeQuery({query: FEED_QUERY, data});
    }

  render() {

    return (
        <Query query={FEED_QUERY}>
            {({loading, error, data})=>{
                if(loading) return <div>Fetching</div>
                if(error) return <div>error</div>
                const linksToRender = data.feed.links
                return(
                    <div>
                        {linksToRender.map((link, index)=><Link updateStoreAfterVote={this._updateCacheAfterVote} key={link.id} link={link} index={index} />)}
                    </div>
                )
            }}
        </Query>
    )
  }
}

export default LinkList
