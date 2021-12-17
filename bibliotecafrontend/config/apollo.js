import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

//para pasar el token jwt al servidor
const authLink = setContext((_, { headers }) => {
  //leer el token del localstorage, Verifica que window este definido y recien trae el localStorage
  const token = localStorage.getItem("jwt");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  connectToDevTools: true,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
