import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);

  const baseURL = 'https://swapi.dev/api/';

  const inputHandler = (event) => {
    setInput(event.target.value);
    debounceHandler();
  };

  useEffect(() => {
    debounceHandler();
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
      }, 300);
    } catch (err) {
      return <p>Error, please reload page</p>;
    }
    setLoading(false);
  };

  const debounceHandler = _.debounce(fetchData, 1000);

  return (
    <div>
      <header>
        <input onChange={inputHandler} />
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
