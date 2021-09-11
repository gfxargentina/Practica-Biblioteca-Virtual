import express from "express";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageDisabled } from "apollo-server-core";
import { BookResolver } from "./resolvers/book.resolver";

//esto convierte el codigo typescrypt a graphql
import { buildSchema } from "type-graphql";

//inicia el servidor
export async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [BookResolver] }),
  });

  await apolloServer.start();

  //le pasamos al servidor la ruta donde se ejecutara graphql
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  return app;
}
