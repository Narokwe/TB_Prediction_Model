import { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for better performance
const InputForm = lazy(() => import('./components/InputForm'));
const PredictionResult = lazy(() => import('./components/PredictionResult'));
const Charts = lazy(() => import('./components/Charts'));
const Login = lazy(() => import('./components/Auth/Login'));
const Signup = lazy(() => import('./components/Auth/Signup'));

function App() {
  const { user, isLoading } = useAuth();
  const [prediction, setPrediction] = useState(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8" role="main">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-3xl font-bold text-gray-800 mb-6">TB Risk Prediction</h1>
                  <InputForm onPrediction={setPrediction} />
                  {prediction && <PredictionResult result={prediction} />}
                </div>
              } />
              
              <Route path="/charts" element={
                user ? <Charts /> : <Navigate to="/login" replace />
              } />
              
              <Route path="/login" element={
                user ? <Navigate to="/" replace /> : <Login />
              } />
              
              <Route path="/signup" element={
                user ? <Navigate to="/" replace /> : <Signup />
              } />

              {/* Optional: 404 route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;