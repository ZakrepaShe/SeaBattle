import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

export default history => [
  thunk.withExtraArgument(history),
  createLogger({ collapsed: true })
];
