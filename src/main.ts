import { startServer } from "./server";
import { connect } from "./config/typeorm";

async function main() {
  try {
    connect();
    const port: number = 4000;
    const app = await startServer();
    app.listen(port);
    console.log("El servidor esta corriendo en el puerto", port);
  } catch (error) {
    console.log(error);
  }
}

main();
