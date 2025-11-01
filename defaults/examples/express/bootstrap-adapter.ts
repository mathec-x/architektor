import { ExpressAdapter } from '@/adapters/http/express/ExpressAdapter';
import { LoggerService } from '@/application/services/logger/LoggerService';
import { setupSwagger } from '@/adapters/http/openapi/setupSwagger';

class App {
	private readonly logger = new LoggerService(App.name);

	bootstrap() {
		const app = new ExpressAdapter();
		app.setPrefix('/api/v1');
		// => add your first factory
		// use: npx tsna add factory pokemonRoute
		// then uncomment the following line
		// app.registerFactory(makePokemonRouteFactory);

		return app.start(process.env.PORT || 3001, (application) => {
			setupSwagger(application);
			this.logger.info(`Server is running on port ${process.env.PORT || 3001}`);
		});
	}
}

export default new App();