import { ActivityIndicator, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import {useState} from 'react'

//import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
//import { RootTabScreenProps } from '../types';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import BookItem from '../components/BookItem';
import { SafeAreaView } from 'react-native-safe-area-context';

const query = gql`
  query SearchBooks($q: String) {
    googleBooksSearch(q: $q, country: "US") {
      items {
        id
        volumeInfo {
          authors
          averageRating
          description
          imageLinks {
            thumbnail
          }
          title
          subtitle
          industryIdentifiers {
            identifier
            type
          }
        }
      }
    }
    openLibrarySearch(q: $q) {
      docs {
        author_name
        title
        cover_edition_key
        isbn
      }
    }
  }
`;

export default function TabOneScreen() {

  const [search, setSearch] = useState("")
  const [provider, setProvider] = useState<"googleBooksSearch" | "openLibrarySearch">("googleBooksSearch")

  const [runQuery, {data, loading, error}] = useLazyQuery(query);

  const parseBook = (item:any): Book => {
    if(provider==="googleBooksSearch"){
      return {image:item.volumeInfo.imageLinks?.thumbnail, authors:item.volumeInfo.authors, 
        title:item.volumeInfo.title, isbn:item.volumeInfo.industryIdentifiers?.[0]?.identifier}
    }return {
      image:`https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`,
      title: item.title,
      authors:item.author_name,
      isbn:item.isbn?.[0]
    }
  }

 

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TextInput value={search} style={styles.input}
        onChangeText={setSearch} placeholder='Search..'/>

        <Button title='Submit' onPress={()=>runQuery({variables :{q:search}})}/>
      </View>

      <View style={styles.tabs}>
        <Text style={provider==="googleBooksSearch"?{
          fontWeight:'bold', color:'pink'
        }:{}} onPress={()=>setProvider("googleBooksSearch")}>Google Books</Text>

        <Text style={provider==="openLibrarySearch"?{
          fontWeight:'bold', color:'pink'
        }:{}} onPress={()=>setProvider("openLibrarySearch")}>Open Library</Text>
      </View>

      {loading && <ActivityIndicator/>}
      {error && (
      <>
        <Text>Error fetching Books..</Text>
        <Text>{error.message}</Text>
      </>)}

      <FlatList showsVerticalScrollIndicator={false}
      data={provider === "googleBooksSearch"
      ? data?.googleBooksSearch?.items
      : data?.openLibrarySearch?.docs || []}
      renderItem = {({ item })=> <BookItem book={parseBook(item)}/>}
      />
      
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    //backgroundColor:'white'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  header:{
    
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    
  },
  input:{
    //flex:1,
    width:300,
    borderRadius:5,
    borderWidth:1,
    padding:10,
    marginVertical:5,
    backgroundColor:'pink',
    paddingRight:10
  },
  button:{

  },
  tabs:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    height:50
  }
});
