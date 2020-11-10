import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultsCache, setResultsCache] = useState(new Map());
  const [charactersCache, setCharactersCache] = useState(new Map());

  // ------------helper/update functioons -----
  const baseURL = 'https://swapi.dev/api/';

  const updateCharactersCache = (key, value) => {
    setCharactersCache(charactersCache.set(key, value));
  };

  const updateResultsCache = (key, value) => {
    setResultsCache(resultsCache.set(key, value));
  };

  // --------------Handlers and async---------
  const inputHandler = _.debounce((event) => {
    setInput(event.target.value);
  }, 500);

  const fetchData = _.debounce(async () => {
    setLoading(true);
    const url = `${baseURL}people/?search=${input}`;
    try {
      const response = await axios.get(url);

      const charIDs = response.data.results.map((item) =>
        item.url
          .slice(0, item.url.length - 1)
          .split('/')
          .pop()
      );

      updateCharactersCache(charIDs, response.data.results);
      updateResultsCache(input, charIDs);

      setTimeout(() => {
        setRequests(requests + 1);
        setResults(response.data.results);
      }, 300);
    } catch (err) {
      return <p>Error, please reload page</p>;
    }
    setLoading(false);
  }, 500);

  useEffect(() => {
    if (resultsCache.has(input)) {
      let key = resultsCache.get(input);
      setResults(charactersCache.get(key));
    } else {
      fetchData();
    }
  }, [input]);

  console.log(resultsCache);

  return (
    <div>
      <header>
        <input autoFocus onChange={inputHandler} />
      </header>
      {loading ? <h2>Loading...</h2> : <></>}
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
