import { createSelector } from "reselect";
import { combineNodes, createQuery } from "../coredux";

import { comments, getCommentsEntities } from "./comments";
import { posts, getPosts } from "./posts";

export const getPostsWithComments = createQuery();

export const root = combineNodes({
  comments,
  posts,
}).getter(getPostsWithComments, select =>
  createSelector(
    select(getPosts),
    select(getCommentsEntities),
    (posts, commentsEntities) =>
      posts.map(post => ({
        ...post,
        comments: post.commentsIds.map(commentId =>
          commentsEntities.get(commentId)
        ),
      }))
  )
);
