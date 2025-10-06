import { ExpressServer } from '@/infrastructure/http/ExpressServer';

const server = new ExpressServer();
const PORT = process.env.PORT || 3000;

server.app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
