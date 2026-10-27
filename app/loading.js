// TOPIC: Error boundary, performance, lazy loading - Global loading state
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <LoadingSpinner message="Loading..." />
    </div>
  );
}
