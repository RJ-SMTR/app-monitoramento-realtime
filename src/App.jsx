import { LayerGroup, MapContainer, TileLayer } from "react-leaflet"
import { useContext} from "react"
import './App.css'
import { useMap } from 'react-leaflet/hooks'
import { MovingMarkerContext } from "./hooks/getMovingMarkers"
import BusMarker from "./components/MovingMarkersBRT"
import BusMarkerSPPO from "./components/MovingMarkerSPPO"
import SearchBar from "./components/searchBar"
import Tables from "./components/table"

function App() {
  const { tracked, trackedSPPO, selectedLinhas } = useContext(MovingMarkerContext)
  const ComponentResize = () => {
    const map = useMap()
    setTimeout(() => {
      map.invalidateSize()
    }, 0)
    return null
  }


  return (
    <>
    <SearchBar/>
    <Tables/>
      <MapContainer center={[-22.935872, -43.455088]} zoom={11} >

        <TileLayer
          onLoad={(e) => { e.target._map.invalidateSize() }}
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        <div id="map"></div>
      <LayerGroup>
          {tracked ? tracked.map((e) => {
            return <div key={e.code}>
              <BusMarker key={e.code} id={e.code} data={e} />
            </div>
          }) : <></>}
      </LayerGroup>
      <LayerGroup>
          {trackedSPPO
            ? trackedSPPO
              .filter(e => !selectedLinhas?.length || selectedLinhas?.some(selected => selected.value === e.linha))
              .map(e => (
                <div key={e.ordem}>
                  <BusMarkerSPPO key={e.ordem} id={e.ordem} data={e} />
                </div>
              ))
            : <></>
          }
      </LayerGroup>
      <LayerGroup>
        
      </LayerGroup>
        <ComponentResize />
    </MapContainer>
     
    </>
  )
}

export default App
