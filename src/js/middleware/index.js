import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

export default (history) => [thunk.withExtraArgument(history), createLogger({ collapsed: true })];
