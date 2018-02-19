export function combineReducers(scheme) {
  const names = Object.keys(scheme);

  return (state, action) => {
    return names.reduce((result, name) => {
      const reducer = scheme[name];
      const value = state[name];

      return {
        ...result,
        [name]: reducer(value, action),
      };
    }, state || {});
  };
}
