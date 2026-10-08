export default function VehicleSelector({ vehicles, value, onChange }) {
  return (
    <div className="field">
      <span className="label" id="vehicle-label">
        Vehicle
      </span>
      <div className="seg" role="radiogroup" aria-labelledby="vehicle-label">
        {vehicles.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={v.id === value}
            onClick={() => onChange(v.id)}
          >
            {v.model} {v.year}
            <small>{v.make}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
