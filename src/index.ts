import "./shared/config/env.config"; // Valida variables de entorno primero
import { app, startDatabase } from "./shared/infrastructure/http/app";
import { env } from "./shared/config/env.config";

const startServer = async (): Promise<void> => {
  try {
    await startDatabase();

    app.listen(env.PORT, () => {
      console.log(`🚀 UsersService corriendo en http://localhost:${env.PORT}`);
      console.log(`📊 Entorno: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
