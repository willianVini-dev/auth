import app from './src/app.js';
import { config } from './src/config/dotenv.js';

app.listen(config.port, () => {
  console.log(`Servidor rodando em http://localhost:${config.port}`);
});