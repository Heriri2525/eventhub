// TOPIC: Props and rendering patterns - Simple loading spinner component
export function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '60px',
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      gap: '1rem',
    }}>
      <div 
        className="spinner"
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
        }}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p style={{ 
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-sm)',
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
