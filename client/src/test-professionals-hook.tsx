import useProfessionals from '../hooks/useProfessionals';

export default function TestProfessionals() {
  const salonId = "de331471-f436-4d82-bbc7-7e70d6af7958";
  const { data, isLoading, error } = useProfessionals(salonId);

  console.log('Hook result:', { data, isLoading, error, featureFlag: import.meta.env.VITE_FEATURE_REAL_PROS });

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Test useProfessionals Hook</h1>
      <p>Feature Flag: {import.meta.env.VITE_FEATURE_REAL_PROS}</p>
      <p>Salon ID: {salonId}</p>
      <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
      <p>Error: {error ? error.message : 'None'}</p>
      <p>Data Count: {data?.length || 0}</p>
      
      {data && data.length > 0 && (
        <div>
          <h2>Professionals:</h2>
          {data.map((pro) => (
            <div key={pro.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <p><strong>Name:</strong> {pro.name}</p>
              <p><strong>Role:</strong> {pro.role}</p>
              <p><strong>Rating:</strong> {pro.rating}</p>
              <p><strong>Specialties:</strong> {pro.specialties?.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}