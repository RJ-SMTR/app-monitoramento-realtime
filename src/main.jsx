import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'leaflet/dist/leaflet.css'
import { GPSProvider } from './hooks/getGPS.jsx'
import { MovingMarkerProvider } from './hooks/getMovingMarkers.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GPSProvider>
      <MovingMarkerProvider>
        <App />
      </MovingMarkerProvider>
    </GPSProvider>
  </React.StrictMode>,
)
