import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import MyBooksProvider from './context/MyBooksProvider';

const API_KEY = 'nailsworth::stepzen.net+1000::cf1d70720c37628410cb7030d75510cd5b052f8b4865f3dd0046f45ed49003cc';
const client = new ApolloClient({
  uri:"https://nailsworth.stepzen.net/api/wise-lambkin/__graphql",
  headers : {
    Authorization: `Apikey ${API_KEY}`,
  },
  cache: new InMemoryCache()
})

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <MyBooksProvider>
          <Navigation colorScheme={colorScheme} />
          </MyBooksProvider>
          
        </ApolloProvider>
        
        <StatusBar/>
      </SafeAreaProvider>
    );
  }
}
