import express from 'express';
import routes from '../routes';

export class ExpressApp {
  public app = express();

  constructor() {
    this.app.use(express.json());
    this.app.use(routes);
  }
}
