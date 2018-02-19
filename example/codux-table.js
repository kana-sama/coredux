import { createNode, createAction, createQuery } from "./coredux";
import { union } from "ramda";
import { createSelector } from "reselect";

const defaultTableState = {
  ids: [],
  entities: new Map(),
};

const actionHandlers = {
  addItem: (state, item) => ({
    ...state,
    ids: union([item.id], state.ids),
    entities: new Map(state.entities).set(item.id, item),
  }),
  addItems: (state, items) => ({
    ...state,
    ids: union(items.map(item => item.id), state.ids),
    entities: new Map([
      ...state.entities,
      ...items.map(item => [item.id, item]),
    ]),
  }),
};

export function createTable({
  defaultExtraState = {},
  setters = {},
  getters: {
    getIds = createQuery(),
    getEntities = createQuery(),
    getItems = createQuery(),
  } = {},
} = {}) {
  const defaultState = {
    ...defaultExtraState,
    ...defaultTableState,
  };

  let node = createNode(defaultState);

  for (const actionName in actionHandlers) {
    let currentActions = setters[actionName] || [];

    if (!Array.isArray(currentActions)) {
      currentActions = Array.of(currentActions);
    }

    for (const action of currentActions) {
      node = node.setter(action, actionHandlers[actionName]);
    }
  }

  return node
    .getter(getIds, select => state => state.ids)
    .getter(getEntities, select => state => state.entities)
    .getter(getItems, select => {
      return createSelector(
        select(getIds),
        select(getEntities),
        (ids, entities) => ids.map(id => entities.get(id))
      );
    });
}
