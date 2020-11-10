import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState(0);
  const [cachedItems, setCachedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseURL = 'https://swapi.dev/api/';

  const inputHandler = (event) => {
    setInput(event.target.value);
  };

  // ----- helper functions---

  //check if a character is in the Cache already
  function checkInCache(character) {
    console.log(cachedItems.map((item) => item.name).includes(character));
    return cachedItems.map((item) => item.name).includes(character);
  }

  //check the cache, if char not in cache, add to cache
  function addToCache(characterData) {
    // setCachedItems(...cachedItems, characterData)
    const newCacheItems = cachedItems;
    if (!checkInCache(characterData.name)) {
      newCacheItems.push(characterData);
      setCachedItems(newCacheItems);
    }
  }

  useEffect(() => {
    // console.log(checkInCache(input));
    if (checkInCache(input)) {
      setTimeout(() => {
        for (let value in cachedItems) {
          if (cachedItems[value].name.includes(input)) {
            setResults([cachedItems[value]]);
          }
        }
      }, 0);
    } else {
      fetchData();
    }
  }, [input]);

  //not working right now, because not adding anything to the cache
  const fetchData = async () => {
    setLoading(true);
    const url = `${baseURL}people/?search=${input}`;
    try {
      const result = await axios.get(url);

      setTimeout(() => {
        setRequests(requests + 1);
        setResults(result.data.results);
        result.data.results.forEach((char) => addToCache(char));
      }, 300);
    } catch (err) {
      return <p>Error, please reload page</p>;
    }
    setLoading(false);
  };

  // console.log(cachedItems);

  return (
    <div>
      <header>
        <input onChange={inputHandler} />
      </header>
      {/* render loading below search bar if data loading */}
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
