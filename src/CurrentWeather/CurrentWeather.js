import React, { useState, useEffect, useContext, createContext, Fragment } from "react";

const CurrentWeatherContext = createContext();

const styles = {
  outer: {
    padding: "5px",
    display: "flex",
    flexDirection: "column",
    width: "500px",
  },
  inputRow: {
    flexBasis: "30px",
    marginBottom: '10px',
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  keyInput: {
    flexBasis: "250px",
    marginRight: "10px",
    fontSize: 20,
  },
  lockButton: {
    flexBasis: "100px",
    fontSize: 20,
  },
  apiHeader: {
    margin: 0,
    marginBottom: "5px",
  },
};

const WeatherData = () => {
  const { state, setState } = useContext(CurrentWeatherContext);

  if (state.loadingWeather && state.location) {
    return <div>Loading...</div>
  }

  if (!Object.keys(state.weatherData).length) {
    return
  }
  const items = Object.keys(state.weatherData.main).map((key) => {
    const val = state.weatherData.main[key]
    return <div>{key + ' ' + val}</div>
  })
  return items
}

const ApiKey = () => {
  const { state, setState } = useContext(CurrentWeatherContext);

  return (
    <Fragment >
      <h2 style={styles.apiHeader}>Enter OWM API Key</h2>
      <div style={styles.inputRow}>
        <input disabled={state.keyDisabled} onChange={( {target} ) => {
          setState({
            ...state,
            apiKey: target.value,
          })
        }} type="password" style={styles.keyInput} value={state.apiKey} />
        <button onClick={() => {
          setState({
            ...state,
            keyDisabled: !state.keyDisabled,
          })
        }} style={styles.lockButton}>{state.keyDisabled ? 'Unlock': 'Lock'}</button>
      </div>
    </Fragment >
  )
}

const LocationSelect = () => {
  const { state, setState } = useContext(CurrentWeatherContext)
  useEffect(() => {
    if (!state.location || !state.locations.length) {
      return
    }
    const loc = state.locations.find((iter) => (iter.name + ', ' + iter.state) === state.location)
    const url = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lat=' + loc.lat + '&lon=' + loc.lon + '&appid=' + state.apiKey
    fetch(url).then((response) => response.json()).then((data) => {
      debugger
      setState({
        ...state,
        weatherData: data,
        loadingWeather: false,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.location])

  const options = state.locations.reduce((acc, iter) => {
    const identifier = iter.name + ', ' + iter.state
     acc.push(<option value={identifier}> {identifier} </option>)
     return acc
  }, state.location ? [] : [<option>Select Location</option>])
  return (
    <Fragment >
      <h2 style={styles.apiHeader}>Select Location</h2>
      <div style={styles.inputRow}>
      <select value={state.location} onChange={( {target} ) => {
        setState({
          ...state,
          weatherData: {},
          loadingWeather: true,
          location: target.value,
        })
      }} disabled={!state.locations.length || !state.keyDisabled} style={styles.keyInput}>

      {options}
      </select>
      </div>
    </Fragment >
  )
}

const SearchLocation = () => {
  const { state, setState } = useContext(CurrentWeatherContext)

  useEffect(() => {

    if (!state.searching) {
      return
    }

    const executeFetch = () => {
      const url = 'https://api.openweathermap.org/geo/1.0/direct?q=' + state.search +'&limit=5&appid=' + state.apiKey
      fetch(url).then((response) => response.json()).then((data) => {
        debugger
        setState({
          ...state,
          weatherData: {},

          locations: data,
          location: '',
          searching: false,
        })
      })
    }

    executeFetch()

     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.searching])

  return (
    <Fragment >
      <h2 style={styles.apiHeader}>Enter Location</h2>
      <div style={styles.inputRow}>
        <input disabled={!state.keyDisabled || state.searchDisabled} onChange={( {target} ) => {
          setState({
            ...state,
            search: target.value,
          })
        }} style={styles.keyInput} value={state.search} />
        <button disabled={!state.keyDisabled || state.searchDisabled} onClick={() => {
          setState({
            ...state,
            searching: true,
          })
        }} style={styles.lockButton}>{'Search'}</button>
      </div>
    </Fragment >
  )
}

const CurrentWeather = () => {
  const [ state, setState ] = useState({
    apiKey: '',
    weatherData: {},
    search: '',
    location: '',
    locations: [],
    keyDisabled: true,
    searchDisabled: false,
    searching: false,
    loadingWeather: false,
  })
  return (
    <CurrentWeatherContext.Provider value={{state, setState}}>
      <div style={styles.outer}>
        <h1>Weather</h1>
        <ApiKey />
        <SearchLocation />
        <LocationSelect />
        <WeatherData />
      </div>
    </CurrentWeatherContext.Provider>
  );
};

export default CurrentWeather;
