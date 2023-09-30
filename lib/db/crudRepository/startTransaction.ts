// Start Transaction Method, this will take a callback mehtod that executes the repo methods.
export const makeStartTransaction = (callbackMethod: () => void) => {
  callbackMethod();
};
