type TripFormProps = {
  title: string
}

export default function TripForm({title}: TripFormProps) {
  return (
    <div>
      <h2>{title}</h2>

      <input
        type="text"
        placeholder="Destination"
      />

      <input
        type="number"
        placeholder="Days"
      />

      <input
        type="number"
        placeholder="Budget"
      />

      <button>Plan My Trip</button>
    </div>
  )
}