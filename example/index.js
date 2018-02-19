import { createStore } from "redux";
import { createStructuredSelector } from "reselect";

import { root, getPostsWithComments } from "./nodes";
import { addPost } from "./nodes/posts";
import {
  fetchCommentsRequest,
  fetchCommentsSuccess,
  getIsFetching,
} from "./nodes/comments";

const store = createStore(root.reducer);

const mapStateToProps = createStructuredSelector({
  isFetching: root.select(getIsFetching),
  posts: root.select(getPostsWithComments),
});

function render() {
  console.log(mapStateToProps(store.getState()));
}

store.subscribe(render);
render();

store.dispatch(fetchCommentsRequest());
store.dispatch(addPost({ id: 1, text: "post 1", commentsIds: [1] }));
store.dispatch(addPost({ id: 2, text: "post 2", commentsIds: [2, 3] }));
store.dispatch(
  fetchCommentsSuccess([
    { id: 1, text: "comment 1" },
    { id: 2, text: "comment 2" },
    { id: 3, text: "comment 3" },
  ])
);
