// infrastructure layer in DDD
// only if not presentation layer in DDD

import app from '@/infrastructure/Server';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
