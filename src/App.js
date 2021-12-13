import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './styles.css'
require('dotenv').config()

const filterBySearch = (country, search) => {
  if(search === ""){
    return country
  }else if(country.name.toLowerCase().includes(search.toLowerCase())){
    return country
  }else{
    return null
  }
}

const Search = ({search, onSearchChange}) => {
  return (
    <input value={search} onChange={onSearchChange}/>
  );
}

const ShowTemp = ({weather}) => {
  return(
    <div>
        Temperature {weather.current.temp_c} C<br/>
        Wind {weather.current.wind_kph} km/h <br/>
        Humidity {weather.current.humidity}% <br/>
        UV {weather.current.uv}
    </div>
  )
}

const SingleCountry = ({filteredCountries, weather}) => {
  return(
    filteredCountries.map(country => 
    <div key={country.name}>
      <h2>{country.name}</h2>
      {`Capital ${country.capital}`}
      <br/>
      {`Population ${country.population}`}
      <br/>
      <h3>Languages</h3>
      {country.languages.map(language =>{
        return(
          <div key={language.iso639_1}>
          {language.name}
          </div>
        )
      })}
      <br/>
      <img src={country.flag} alt={"no flag:("} width={200}/>
      <h3>Weather</h3>
        <ShowTemp weather={weather}/>
    </div>
    )
  )
}

const RenderCountries = ({countries, search, setSearch, setThecountry, weather}) => {
  const filteredCountries = countries.filter(country =>
    filterBySearch(country, search))
  const len = filteredCountries.length
      
  useEffect(() =>
    filteredCountries.map(country => setThecountry(country.name))
  )

  if(len > 1 && len < 11){
    return(
      filteredCountries.map(country => 
      <div key={country.name}>
        {country.name} <button onClick={() => setSearch(country.name)}>show</button>
      </div>)
    )
  } else if (len < 2){
    return(
      <SingleCountry filteredCountries={filteredCountries} weather={weather}/>
    )
  }else{
    return(
      <div>
        What country are you looking for?
      </div>
    )
  }
}

const App = () => {

  const api_key = process.env.REACT_APP_API_KEY
  
  const [ countries, setCountries ] = useState([])
  const [ search, setSearch ] = useState('')
  const [ thecountry, setThecountry ] = useState('finland')
  const [ weather, setWeather ] = useState({})

  useEffect(() => {
    axios
      .get("https://restcountries.com/v2/all")
      .then(response =>{
        setCountries(response.data)
      })
  }, [])

  useEffect(()=>{
    axios.get(`https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${thecountry}&aqi=no`)
    .then(response => {
      setWeather(response.data)
    })
  }, [thecountry, api_key])

  const onSearchChange = (event) => {
    setSearch(event.target.value)
  }
  return (
    <div>
      <h3>Search: <Search search={search} setSearch={setSearch} onSearchChange={onSearchChange}/></h3>
      <RenderCountries countries={countries} search={search} setSearch={setSearch} setThecountry={setThecountry} weather={weather}/>
    </div>
  )
}

export default App
