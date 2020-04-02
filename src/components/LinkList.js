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
const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`
const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
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

    _subscribeToNewLinks = subscribeToMore => {
        subscribeToMore({
            document: NEW_LINKS_SUBSCRIPTION,
            updateQuery: (prev, {subscriptionData})=>{
                if(!subscriptionData) return prev;
                const newLink = subscriptionData.data.newLink;
                const exist = prev.feed.links.find(({id})=>id===newLink.id);
                if(exist) return prev;

                return Object.assign({}, prev, {
                    feed:{
                        links: [newLink, ...prev.feed.links],
                        count: prev.feed.links.length+1,
                        __typename: prev.feed.__typename
                    }
                })
            }
        })
    }

    _subscribeToNewVotes = subscribeToMore => {
        subscribeToMore({
          document: NEW_VOTES_SUBSCRIPTION
        })
    }      

  render() {

    return (
        <Query query={FEED_QUERY}>
            {({loading, error, data, subscribeToMore})=>{
                if(loading) return <div>Fetching</div>
                if(error) return <div>error</div>
                this._subscribeToNewLinks(subscribeToMore)
                this._subscribeToNewVotes(subscribeToMore)
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
