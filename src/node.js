export class Node {
  constructor(
    defaultState,
    totalReducer = state => state,
    queries = new Map()
  ) {
    this.defaultState = defaultState;
    this.totalReducer = totalReducer;
    this.queries = queries;
  }

  reducer = (state = this.defaultState, action) => {
    return this.totalReducer(state, action);
  };

  select(query) {
    return this.queries.get(query);
  }

  setter(action, handler = (state, payload) => payload) {
    const reducer = (state, message) => {
      switch (message.type) {
        case action:
          return handler(this.totalReducer(state, message), message);
        case action.type:
          switch (typeof handler) {
            case "function":
              return handler(
                this.totalReducer(state, message),
                message.payload
              );
            default:
              return handler;
          }
        default:
          return this.totalReducer(state, message);
      }
    };

    return new Node(this.defaultState, reducer, this.queries);
  }

  getter(query, makeSelector = select => state => state) {
    const select = dependencySelectorId => this.select(dependencySelectorId);
    const selector = makeSelector(select);
    const queries = new Map(this.queries).set(query, selector);

    return new Node(this.defaultState, this.reducer, queries);
  }
}
