import { useEffect, useState } from "react";

function BusService({ busArrivalData }) {
  return (
    <ul>
      {busArrivalData.services.map((service) => {
        const result = service.next_bus_mins < 0 ? "Arrived" : `${service.next_bus_mins} minutes`;

        return (
          <li key={service.bus_no}>
            Bus {service.bus_no}: {result}
          </li>
        );
      })}
    </ul>
  );
}

// Function to fetch bus arrival data using the provided API
async function fetchBusArrival(id) {
  const response = await fetch(`https://sg-bus-arrival.sigma-schoolsc1.repl.co/?id=${id}`);
  const data = await response.json();

  return data;
}

function App() {
  const [busStopId, setBusStopId] = useState("");
  const [busArrivalData, setBusArrivalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const options = [
    "18141",
    "18131",
  ];

  const onOptionChangeHandler = (event) => {
    setBusStopId(event.target.value);
  };

  // Fetch bus arrival data on-the-fly as the user types in the bus stop ID
  useEffect(() => {
    if (busStopId) {
      setLoading(true);
      fetchBusArrival(busStopId)
        .then((data) => setBusArrivalData(data))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false))
    }
  }, [busStopId]);

  /* 
    function handleInputChange(event) {
      setBusStopId(event.target.value);
    }
  */

  return (
    <div>
      <h1>Bus Arrival App</h1>
      {/*
        <input
          type="text"
          value={busStopId}
          onChange={handleInputChange}
          placeholder="Enter Bus Stop ID"
        />
      */}

      <select onChange={onOptionChangeHandler}>
        <option value="">Select a Bus Stop ID</option>
        {options.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
      {loading && <p>Loading...</p>}
      {busArrivalData && busArrivalData.services && (
        <>
          <h2>Bus Stop {busArrivalData.bus_stop_id}</h2>
          <BusService busArrivalData={busArrivalData} />
        </>
      )}
    </div>
  );
}

export default App
