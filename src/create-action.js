export function createAction(description) {
  const type = Symbol(description);
  const action = payload => ({ type, payload });
  return Object.assign(action, { type });
}
