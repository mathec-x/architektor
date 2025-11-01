
import { Router } from 'express';
import supertest from 'supertest';
import { ExpressAdapter } from './ExpressAdapter';

export type ExpressTestModule = ReturnType<ExpressTestAdapter['createTestModule']>

export class ExpressTestAdapter extends ExpressAdapter {
  createTestModule(config: { factories: Array<() => { router: Router }> }) {
    for (const factory of config.factories) {
      this.registerFactory(factory);
    }

    return supertest(this.app);
  }
}

// any testing dev dependencies can go here
