import React, { useState, useEffect, useContext, createContext } from "react";

const CurrentWeatherContext = createContext();
const rowHeight = "40px";
const styles = {
  outer: {
    fontFamily: "Arial",
    padding: "5px",
    display: "flex",
    flexDirection: "column",
    width: "500px",
    border: "5px solid black",
  },
  inputRow: {
    flexBasis: "200px",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    height: rowHeight,
  },
  keyInput: {
    flexBasis: "300px",
    marginRight: "10px",
    fontSize: 20,
  },
  lockButton: {
    flexBasis: "100px",
    fontSize: 20,
  },
  apiHeader: {
    margin: 0,
  },
  unitRow: {
    display: "flex",
    flexDirection: "row",
    height: rowHeight,
    fontSize: "26px",
  },
  units: {
    height: "30px",
    marginRight: "15px",
    cursor: "pointer",
  },
  wHeader: {
    margin: 0,
    color: 'Blue',
    height: rowHeight
  },
};

const WeatherData = () => {
  const { state } = useContext(CurrentWeatherContext);

  if (state.loadingWeather && state.location) {
    return <div>Loading...</div>;
  }

  if (!Object.keys(state.weatherData).length) {
    return;
  }
  const items = Object.keys(state.weatherData.main).map((key) => {
    const val = state.weatherData.main[key];
    return <div>{key + " " + val}</div>;
  });
  return <div>{items}</div>;
};

const ApiKey = () => {
  const { state, setState } = useContext(CurrentWeatherContext);

  return (
    <div>
      <h2 style={styles.apiHeader}>Enter OWM API Key</h2>
      <div style={styles.inputRow}>
        <input
          disabled={state.keyDisabled}
          onChange={({ target }) => {
            setState({
              ...state,
              apiKey: target.value,
            });
          }}
          type="password"
          style={styles.keyInput}
          value={state.apiKey}
        />
        <button
          onClick={() => {
            setState({
              ...state,
              keyDisabled: !state.keyDisabled,
            });
          }}
          style={styles.lockButton}
        >
          {state.keyDisabled ? "Unlock" : "Lock"}
        </button>
      </div>
    </div>
  );
};

const LocationSelect = () => {
  const { state, setState } = useContext(CurrentWeatherContext);
  useEffect(() => {
    if (!state.location || !state.locations.length) {
      return;
    }
    const loc = state.locations.find(
      (iter) =>
        iter.name + ", " + iter.state + ", " + iter.country === state.location
    );
    const url =
      "https://api.openweathermap.org/data/2.5/weather?units=" +
      state.units +
      "&lat=" +
      loc.lat +
      "&lon=" +
      loc.lon +
      "&appid=" +
      state.apiKey;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setState({
          ...state,
          weatherData: data,
          loadingWeather: false,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.location]);

  const options = state.locations.reduce(
    (acc, iter) => {
      if (!iter.name || !iter.state || !iter.country) { return acc; }
      const identifier = iter.name + ", " + iter.state + ", " + iter.country;
      acc.push(<option value={identifier}> {identifier} </option>);
      return acc;
    },
    state.location ? [] : [<option>Select Location</option>]
  );
  return (
    <div>
      <h2 style={styles.apiHeader}>Select Location</h2>
      <div style={styles.inputRow}>
        <select
          value={state.location}
          onChange={({ target }) => {
            setState({
              ...state,
              weatherData: {},
              loadingWeather: true,
              location: target.value,
            });
          }}
          disabled={!state.locations.length || !state.keyDisabled}
          style={styles.keyInput}
        >
          {options}
        </select>
      </div>
    </div>
  );
};

const SearchLocation = () => {
  const { state, setState } = useContext(CurrentWeatherContext);

  useEffect(() => {
    if (!state.searching) {
      return;
    }

    const executeFetch = () => {
      const url =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        state.search +
        "&limit=5&appid=" +
        state.apiKey;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setState({
            ...state,
            weatherData: {},
            locations: data,
            location: "",
            searching: false,
          });
        });
    };

    executeFetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.searching]);

  return (
    <div>
      <h2 style={styles.apiHeader}>Search Location</h2>
      <div style={styles.inputRow}>
        <input
          disabled={!state.keyDisabled || state.searchDisabled}
          onChange={({ target }) => {
            setState({
              ...state,
              search: target.value,
            });
          }}
          style={styles.keyInput}
          value={state.search}
        />
        <button
          disabled={!state.keyDisabled || state.searchDisabled}
          onClick={() => {
            setState({
              ...state,
              searching: true,
            });
          }}
          style={styles.lockButton}
        >
          {"Search"}
        </button>
      </div>
    </div>
  );
};

const UnitSelect = () => {
  const { state, setState } = useContext(CurrentWeatherContext);

  const unitClick = (units) => {
    setState({
      ...state,
      weatherData: {},
      locations: [],
      location: "",
      units,
    });
  };
  return (
    <div style={styles.unitRow}>
      <div
        onClick={() =>
          unitClick(state.units === "metric" ? "imperial" : "metric")
        }
        style={styles.units}
      >
        Select units:
      </div>
      <div
        onClick={() => unitClick("metric")}
        style={{
          ...styles.units,
          ...(state.units === "metric"
            ? { borderBottom: "3px solid red" }
            : {}),
        }}
      >
        C
      </div>
      <div
        onClick={() => unitClick("imperial")}
        style={{
          ...styles.units,
          ...(state.units === "imperial"
            ? { borderBottom: "3px solid red" }
            : {}),
        }}
      >
        F
      </div>
    </div>
  );
};

const CurrentWeather = () => {
  const [state, setState] = useState({
    apiKey: "",
    weatherData: {},
    units: "metric",
    search: "",
    location: "",
    locations: [],
    keyDisabled: true,
    searchDisabled: false,
    searching: false,
    loadingWeather: false,
  });
  return (
    <CurrentWeatherContext.Provider value={{ state, setState }}>
      <div style={styles.outer}>
        <h1 style={styles.wHeader}>Weather</h1>
        <ApiKey />
        <UnitSelect />
        <SearchLocation />
        <LocationSelect />
        <WeatherData />
      </div>
    </CurrentWeatherContext.Provider>
  );
};

export default CurrentWeather;
