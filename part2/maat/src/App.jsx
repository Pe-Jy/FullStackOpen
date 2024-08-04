import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({ filteredCountries, showCountry }) => {
  if (filteredCountries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }

  if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
    return (
      filteredCountries.map(country =>
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={() => showCountry(country)}>show</button>
        </div>
      )
    )
  }

  if (filteredCountries.length === 1) {
    return (
      <div>
        <h1>{filteredCountries[0].name.common}</h1>
        <div>capital {filteredCountries[0].capital}</div>
        <div>area {filteredCountries[0].area}</div>
        <br />
        <h3>languages:</h3>
        <ul>
          {Object.values(filteredCountries[0].languages).map(language =>
            <li key={language}>
              {language}
            </li>
          )}
        </ul>
        <img src={filteredCountries[0].flags['png']} />
        <Weather place={filteredCountries[0].capital} />
      </div>
    )
  }
}

const Weather = ({ place }) => {
  const [weather, setWeather] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${place}&APPID=${api_key}`)
      .then(response => {
        console.log(response.data)
        setWeather(response.data)
      })
  }, [])

  if (weather) {
    return (
      <div>
        <h2>Weather in {place}</h2>
        <div>temperature {(weather.main.temp - 273.15).toFixed(2)} Celcius</div>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0]['icon']}@2x.png`} />
        <div>wind {weather.wind['speed'].toFixed(1)} m/s</div>
      </div>
    )
  }
}

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (countries) {
      setFilteredCountries(countries.filter(country =>
        country.name.common.toLowerCase().includes(value.toLowerCase())))
    }
  }, [value])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const showCountry = (country) => {
    setFilteredCountries([country])
  }

  return (
    <div>
      <form>
        find countries <input value={value} onChange={handleChange} />
      </form>
      <Countries
        filteredCountries={filteredCountries}
        showCountry={showCountry}
      />
    </div>
  )
}

export default App
