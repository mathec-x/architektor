import express from 'express';
import routes from './routes';

export class ExpressAdapter {
  public app = express();

  constructor() {
    this.app.use(express.json());
    this.app.use(routes);
  }

  start(port: number) {
    this.app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  }
}
