import { combineReducers } from "./utils/combine-reducers";
import { Node } from "./node";

export function combineNodes(nodes) {
  const defaultState = {};
  const reducersScheme = {};
  const queries = new Map();

  for (const nodeName in nodes) {
    const node = nodes[nodeName];

    defaultState[nodeName] = node.defaultState;
    reducersScheme[nodeName] = node.totalReducer;

    for (const [query, selector] of node.queries) {
      const liftedSelector = (state, props) => {
        return selector(state[nodeName], props);
      };

      queries.set(query, liftedSelector);
    }
  }

  const reducer = combineReducers(reducersScheme);

  return new Node(defaultState, reducer, queries);
}
