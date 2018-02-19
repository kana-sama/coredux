import {
  createAction,
  createQuery,
  createNode,
  combineNodes,
  mergeNodes,
} from "../../src";

import { createTable } from "../coredux-table";

export const getIsFetching = createQuery();
export const getCommentsEntities = createQuery();

export const fetchCommentsRequest = createAction();
export const fetchCommentsSuccess = createAction();

const isFetching = createNode(false)
  .setter(fetchCommentsRequest, true)
  .setter(fetchCommentsSuccess, false)
  .getter(getIsFetching);

const commentsExtra = combineNodes({
  isFetching,
});

const commentsTable = createTable({
  setters: { addItems: fetchCommentsSuccess },
  getters: { getEntities: getCommentsEntities },
});

export const comments = mergeNodes(commentsTable, commentsExtra);
