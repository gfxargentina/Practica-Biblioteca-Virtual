import { ApolloClient, createHttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql'
});

//para pasar el token jwt al servidor
const authLink = setContext((_, { headers }) => {

    //leer el token del localstorage
    const token = localStorage.getItem('jwt');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
}

)

const client = new ApolloClient({    
    cache: new InMemoryCache(),
     link: authLink.concat( httpLink )
});

export default client;



