import { Node } from "./node";
import { createAction } from "./create-action";

const initAction = createAction("init");

export function createNodeFromReducer(reducer) {
  const defaultState = reducer(initAction(), Symbol());
  return new Node(defaultState, reducer);
}
