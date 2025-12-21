import { Server } from 'http';
import app from './app';
import { envVars } from './app/config/env';


let server: Server;

async function bootstrap() {
    try {
        
        server = app.listen(envVars.PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
}

(async () => {
  // await connectRedis()
  await bootstrap();;
//   await seedSuperAdmin();
})();

//unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

//uncaught rejection error
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

