import express from 'express';
import routes from './Routes';

export class ExpressServer {
  public app = express();

  constructor() {
    this.app.use(express.json());
    this.app.use(routes);
  }
}
