import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useHistory } from 'react-router';

// export const POSTS_QUERY = gql`
//   query {
//     getAllPosts {
//       id
//       textBody
//       posterId
//       user {
//         username
//       }
//     }
//   }
// `;

const DELETE_POST_MUTATION = gql`
  mutation ($id: String!) {
    removePost(id: $id) {
      __typename
    }
  }
`;

const PostListItem = ({ post, POSTS_QUERY }) => {
  const history = useHistory();

  const loggedInUser = localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth')).user
    : '';
  const myPost = loggedInUser.username === post.user.username;

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    variables: {
      id: post.id,
    },
    update(cache, { data: { deletePost } }) {
      const { getAllPosts } = cache.readQuery({
        query: POSTS_QUERY,
      });
      const updatedPosts = getAllPosts.filter((feedPost) => {
        return feedPost.id !== post.id;
      });

      cache.writeQuery({
        query: POSTS_QUERY,
        data: {
          getAllPosts: updatedPosts,
        },
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onCompleted: () => history.push('/'),
  });

  return (
    <div className="flex space-x-2">
      <div>{post.textBody}</div>
      <div className="italic">- {post.user.username}</div>
      {myPost ? (
        <button onClick={deletePost} className="btn btn-warning">
          Delete
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

export default PostListItem;
