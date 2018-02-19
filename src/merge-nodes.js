import { Node } from "./node";

export function mergeNodes(...nodes) {
  const defaultState = {};
  let reducer = state => state;
  let queries = new Map();

  for (const node of nodes) {
    Object.assign(defaultState, node.defaultState);

    const currentReducer = reducer;
    reducer = (state, action) =>
      node.totalReducer(currentReducer(state, action), action);

    queries = new Map([...queries, ...node.queries]);
  }

  return new Node(defaultState, reducer, queries);
}
