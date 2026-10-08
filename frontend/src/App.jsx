import { useEffect, useState } from 'react';
import BidInput from './components/BidInput.jsx';
import ExchangeRateInput from './components/ExchangeRateInput.jsx';
import FixedCosts from './components/FixedCosts.jsx';
import Results from './components/Results.jsx';
import VehicleSelector from './components/VehicleSelector.jsx';
import { useCalculation } from './hooks/useCalculation.js';
import { useVehicles } from './hooks/useVehicles.js';
import { parseNumber } from './utils/format.js';
import { loadValue, saveValue } from './utils/storage.js';

const RATE_KEY = 'cic.exchangeRate';

export default function App() {
  const { vehicles, meta, loading, error } = useVehicles();

  const [vehicleId, setVehicleId] = useState('');
  const [bid, setBid] = useState('');
  const [rate, setRate] = useState(() => loadValue(RATE_KEY, ''));

  // Pick the first vehicle and default rate once the list arrives.
  useEffect(() => {
    if (!vehicleId && vehicles.length) setVehicleId(vehicles[0].id);
    if (!rate && meta?.defaultExchangeRate) setRate(String(meta.defaultExchangeRate));
  }, [vehicles, meta]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rate) saveValue(RATE_KEY, rate);
  }, [rate]);

  const calc = useCalculation({
    vehicleId,
    bidThousands: parseNumber(bid),
    exchangeRate: parseNumber(rate),
  });

  const vehicle = vehicles.find((v) => v.id === vehicleId);

  return (
    <main>
      <div className="card">
        <header>
          <span className="pill">🚗 Japan → Pakistan</span>
          <h1>Car Import Calculator</h1>
          <p>33% shipping payment and total landed cost for Mira and Raize.</p>
        </header>

        {loading && <p className="placeholder">Loading vehicles…</p>}
        {error && (
          <p className="alert" role="alert">
            Could not reach the API: {error.message}. Is the backend running?
          </p>
        )}

        {vehicles.length > 0 && (
          <>
            <VehicleSelector vehicles={vehicles} value={vehicleId} onChange={setVehicleId} />

            <section className="inputs">
              <BidInput value={bid} onChange={setBid} />
              <ExchangeRateInput value={rate} onChange={setRate} />
            </section>

            <FixedCosts vehicle={vehicle} />

            {calc.error && (
              <p className="alert" role="alert">
                {calc.error.message}
              </p>
            )}
            <Results result={calc.result} loading={calc.loading} />
          </>
        )}
      </div>
      <footer>Estimates only. Fixed costs are set on the server.</footer>
    </main>
  );
}
