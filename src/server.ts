import express from "express";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { BookResolver } from "./resolvers/book.resolver";
import { AuthorResolver } from "./resolvers/author.resolver";
import { AuthResolver } from "./resolvers/auth.resolver";

//esto convierte el codigo typescrypt a graphql
import { buildSchema } from "type-graphql";

//inicia el servidor
export async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [BookResolver, AuthorResolver, AuthResolver],
    }),
    plugins: [
      //habilitan el playground clasico de graphql
      ApolloServerPluginLandingPageDisabled(),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();

  //le pasamos al servidor la ruta donde se ejecutara graphql
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  return app;
}
