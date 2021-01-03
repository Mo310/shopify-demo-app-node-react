import {ApolloClient, ApolloLink, createHttpLink, InMemoryCache} from '@apollo/client';

const shopifyLink = createHttpLink({
  uri: '/graphql',
  credentials: 'include',
});

const appLink = createHttpLink({
  uri: '/app/graphql',
  credentials: 'include',
});

const client = new ApolloClient({
  link: ApolloLink.split((operation) => operation.getContext().clientName === 'app', appLink, shopifyLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default client;
