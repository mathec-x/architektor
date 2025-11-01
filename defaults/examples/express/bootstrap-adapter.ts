import { ExpressAdapter } from '@/adapters/http/express/ExpressAdapter';
import { LoggerService } from '@/application/services/logger/LoggerService';
// import { setupSwagger } from '@/adapters/http/openapi/setupSwagger';

class App {
	private readonly logger = new LoggerService(App.name);

	bootstrap() {
		const server = new ExpressAdapter();
		server.setPrefix('/api/v1');
		// => add your first factory
		// use: npx tsna add factory pokemonRoute
		// then uncomment the following line
		// server.registerFactory(makePokemonRouteFactory);

		return server.start(process.env.PORT || 3001, (app) => {
			// setupSwagger(app);
			this.logger.info(`Server is running on port ${process.env.PORT || 3001}`);
		});
	}
}

export default new App();