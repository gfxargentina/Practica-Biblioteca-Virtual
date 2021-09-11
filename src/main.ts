import { startServer } from "./server";

async function main() {
  const port: number = 4000;
  const app = await startServer();
  app.listen(port);
  console.log("El servidor esta corriendo en el puerto", port);
}

main();
