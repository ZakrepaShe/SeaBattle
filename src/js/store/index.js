import configStore from '../utils/config-store';
import constructMiddleware from '../middleware';
import reducers from '../reducers';

export default history => configStore(reducers, constructMiddleware(history));
