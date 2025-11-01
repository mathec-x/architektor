
import { ExpressTestAdapter, type ExpressTestModule } from '@/adapters/http/express/ExpressTestAdapter';
// import { makePokemonFactoryRoute } from '@/infrastructure/factories/pokemon/PokemonFactoryRoute';

describe('Pokemon E2E Tests', () => {
  let app: ExpressTestModule;

  beforeAll(() => {
    app = new ExpressTestAdapter()
      .setPrefix('/api/v1')
      .createTestModule({
        factories: [
          // makePokemonFactoryRoute
        ]
      });
  });

  it('should responds ok', async () => {
    await app
      .get('/api/v1')
      .expect(200);
  });
});