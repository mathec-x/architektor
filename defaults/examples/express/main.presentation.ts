import { ExpressApp } from "@/presentation/http/ExpressApp";

const server = new ExpressApp();
const PORT = process.env.PORT || 3000;

server.app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
