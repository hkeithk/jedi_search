import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState(0);
  // const [cachedItems, setCachedItems] = useState({});
  const [loading, setLoading] = useState(false);

  const baseURL = 'https://swapi.dev/api/';

  const resultsCache = new Map([]);
  const charactersCache = new Map([]);

  const fetchData = async () => {
    setLoading(true);
    const url = `${baseURL}people/?search=${input}`;
    try {
      const result = await axios.get(url);
      // console.log(result.data.results);

      const ids = result.data.results.map((item) =>
        item.url
          .slice(0, item.url.length - 1)
          .split('/')
          .pop()
      );

      resultsCache.set(ids, { result });
      console.log(resultsCache);
      // { ...cachedItems, [ids]: result.data.results };
      // setCachedItems(newCacheItem);
      // console.log(cachedItems);

      setTimeout(() => {
        setRequests(requests + 1);
        setResults(result.data.results);
        // result.data.results.forEach((char) => addToCache(char));
      }, 300);
    } catch (err) {
      return <p>Error, please reload page</p>;
    }
    setLoading(false);
  };

  //debounce
  const debounceHandler = useCallback(debounce(fetchData, 500), [input]);

  //----handlers----
  const onInputChange = (event) => {
    setInput(event.target.value);
    debounceHandler();
  };

  useEffect(() => {
    debounceHandler();
    return debounceHandler.cancel();
  }, [input, debounceHandler]);

  return (
    <div>
      <header>
        <input onChange={onInputChange} />
      </header>
      {loading ? <h2>Loading...</h2> : <></>}
      {/* render results from api */}
      <div>
        <h2>You have made {requests} requests so far</h2>
        <h3>Search Results</h3>
        <div>
          {results.map((character, index) => (
            <div key={index}>
              <h4>
                {character.name} was born in {character.birth_year}
              </h4>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
