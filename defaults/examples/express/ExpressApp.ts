import express from 'express';

// import routes from '../routes';

export class ExpressApp {
  public app = express();

  constructor() {
    this.app.use(express.json());
    // add your first route running: npx tsna add route login

    // this.app.use(routes);
  }
}
