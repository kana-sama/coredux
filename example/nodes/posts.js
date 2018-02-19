import { createAction, createQuery } from "../coredux";
import { createTable } from "../coredux-table";

export const addPost = createAction();
export const getPosts = createQuery();

export const posts = createTable({
  setters: { addItem: addPost },
  getters: { getItems: getPosts },
});
