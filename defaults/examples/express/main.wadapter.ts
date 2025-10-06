import { ExpressAdapter } from '@/adapters/http/ExpressAdapter';
// import { makeUserFactoryRoute } from '@/infrastructure/factories/routes/userFactoryRoute';

export async function bootStrapMyApp() {
	const port = Number(process.env.PORT) || 3001;
	const app = new ExpressAdapter();

	app.setPrefix('/api/v1');
	// app.usePagesRouter('./infrastructure/pages');
	// app.registerFactoryRouter(makeUserFactoryRoute);

	return app.start(port);
}

bootStrapMyApp()
