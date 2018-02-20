# coredux
Dualism to Redux. Two-way combining of redux modules

Example: https://github.com/kana-sama/coredux-example

Reducer is just a composable first class setter. If some reducer changes a value on some action, it will change this value in a more complicated structure after combining multiple reducers into object reducer too. So, we can combine reducers as we please.

But with selectors everything is different , in the selectors we must know the full path to value in the state, so after reducers relocating we should fix some selectors. And it is a problem because all can be better.

Welcome new concept - Node. It is not just setter, like a reducer, and not just getter, like a selector, it is a COMPOSABLE combination of setters and getters. We can combine any nodes and all selectors will automatically know, how to get the path to value, like actions in reducers.

A simple example of the frequent case - table of posts - tuple of ids and normalized entities of posts.

Let's begin with defining initial state:
```javascript
const defaultState = {
  areFetching: false,
  ids: [],
  entities: new Map(),
};
```

After we will define actions - commands for updating (setting) data:
```javascript
export const fetchPostsRequest = createAction();
export const fetchPostsSuccess = createAction();
```

And queries for selecting (getting) data:
```javascript
export const getArePostsFetching = createQuery();
export const getPostsIds = createQuery();
export const getPostsEntities = createQuery();
export const getPosts = createQuery();
```

And the realization of these setters and getters as the node:
```javascript
export const posts = createNode(defaultState)
  .setter(fetchPostsRequest, state => ({ ...state, areFetching: true }))
  .setter(fetchPostsSuccess, (state, posts) => ({
    areFetching: false,
    ids: posts.map(post => post.id),
    entities: new Map(posts.map(post => [post.id, post])),
  }))
  .getter(getArePostsFetching, select => state => state.areFetching)
  .getter(getPostsIds, select => state => state.ids)
  .getter(getPostsEntities, select => state => state.entities)
  .getter(getPosts, select =>
    createSelector(
      select(getPostsEntities),
      select(getPostsIds),
      (entities, ids) => ids.map(id => entities.get(id))
    )
  );
```

`select` - converts queries to selectors.

Now we can use this node for setting and getting data:
```javascript
const posts = [
  { id: 1, text: "hello", commentsIds: [1] },
  { id: 2, text: "world", commentsIds: [2, 3] },
];

const state1 = defaultState;
const state2 = posts.reducer(state1, fetchPostsRequest());
posts.select(getArePostsFetching)(state2); // true
const state3 = posts.reducer(state2, fetchPostsSuccess(posts);
posts.select(getPostsIds)(state3); // [1, 2]
posts.select(getPosts)(state3); // posts
```

Let's create another node for comments in another style:
```
import { createAction, createQuery, createNode, combineNodes } from "coredux";

export const fetchCommentsRequest = createAction();
export const fetchCommentsSuccess = createAction();

export const getAreCommentsFetching = createQuery();
export const getCommentsIds = createQuery();
export const getCommentsEntities = createQuery();

const areFetching = createNode(false)
  .setter(fetchCommentsRequest, true)
  .setter(fetchCommentsSuccess, false)
  .getter(getAreCommentsFetching);

const ids = createNode([])
  .setter(fetchCommentsSuccess, (ids, comments) =>
    comments.map(comment => comment.id)
  )
  .getter(getCommentsIds);

const entities = createNode(new Map())
  .setter(
    fetchCommentsSuccess,
    (entities, comments) =>
      new Map(comments.map(comment => [comment.id, comment]))
  )
  .getter(getCommentsEntities);

export const comments = combineNodes({
  isFetching,
  ids,
  entities,
});
```

`combineNodes` creates a new node for an object with all actions and queries of the subnodes, just like a `combineReducers for actions`.

And now we can combine these two nodes into one root node and define a complex getter:
```javascript
export const getPostsWithComments = createQuery();

export const root = combineNodes({
  comments,
  posts,
}).getter(getPostsWithComments, select =>
  createSelector(
    select(getPosts),
    select(getCommentsEntities),
    (posts, commentsById) =>
      posts.map(post => ({
        ...post,
        comments: post.commentsIds.map(id => commentsById.get(id)),
      }))
  )
);
```

Test:
```javascript
expect(root.select(getAreCommentsFetching)(getState())).toBe(false);
dispatch(fetchCommentsRequest());
expect(root.select(getAreCommentsFetching)(getState())).toBe(true);
dispatch(fetchCommentsSuccess(comments));
expect(root.select(getAreCommentsFetching)(getState())).toBe(false);

expect(root.select(getCommentsIds)(getState())).toEqual([
  commentA.id,
  commentB.id,
  commentC.id,
]);

const commentsValues = root
  .select(getCommentsEntities)(getState())
  .values();

expect(commentsValues).toContain(commentA);

expect(root.select(getArePostsFetching)(getState())).toBe(false);
dispatch(fetchPostsRequest());
expect(root.select(getArePostsFetching)(getState())).toBe(true);
dispatch(fetchPostsSuccess(posts));
expect(root.select(getArePostsFetching)(getState())).toBe(false);

expect(root.select(getPosts)(getState())).toContain(postA);
expect(root.select(getPostsWithComments)(getState())).toContainEqual({
  ...postA,
  comments: [commentA, commentB],
});
```
