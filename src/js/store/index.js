import constructMiddleware from '../middleware';
import reducers from '../reducers';
import configStore from '../utils/config-store';

export default (history) => configStore(reducers, constructMiddleware(history));
