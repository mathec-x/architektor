import { ExpressAdapter } from './adapters/controllers/ExpressAdapter';

const server = new ExpressAdapter();
server.start(3000);
