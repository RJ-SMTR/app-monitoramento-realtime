import { LayerGroup, MapContainer, TileLayer } from "react-leaflet"
import { useContext, useState} from "react"
import './App.css'
import { useMap } from 'react-leaflet/hooks'
import { MovingMarkerContext } from "./hooks/getMovingMarkers"
import BusMarker from "./components/MovingMarkersBRT"
import BusMarkerSPPO from "./components/MovingMarkerSPPO"
import Tables from "./components/table"
import TablesBRT from "./components/tableBRT"
import Logos from "./components/logos"

function App() {
  const { tracked, trackedSPPO, selectedLinhas, selectedBRT, showSPPO, showBRT } = useContext(MovingMarkerContext)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const ComponentResize = () => {
    const map = useMap()
    setTimeout(() => {
      map.invalidateSize()
    }, 0)
    return null
  }


  return (
    <>
      
    <Logos/>
<div className="tables hidden sm:block">
      <Tables/>
      <TablesBRT/>
</div>
      <button
        type="button"
        className="absolute right-10 z-[100000] block sm:hidden top-5 rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        onClick={toggleDropdown}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.33301 5H16.6663M3.33301 8.33333H16.6663M3.33301 11.6667H16.6663M3.33301 15H16.6663" stroke="black" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

      </button>
      <div className="absolute right-10 top-[6rem] z-[100000] block sm:hidden">
       

        {isDropdownOpen && (
            <div className="text-black bg-white p-4"   role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-menu"
            id="dropdown-menu">
                <Tables />
            
                <TablesBRT/>
            </div>
        )}
      </div>

      <MapContainer center={[-22.935872, -43.455088]} zoom={12} >

        <TileLayer
          onLoad={(e) => { e.target._map.invalidateSize() }}
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        <div id="map"></div>
      <LayerGroup>
          {showBRT && tracked ? tracked.filter(e => !selectedBRT?.length || selectedBRT?.some(selected => selected.value === e.linha))
            .map(e => (
              <div key={e.code}>
                <BusMarker key={e.codigo} id={e.codigo} data={e} />
              </div>
            )) : <></>}
      </LayerGroup>
      <LayerGroup>
          {showSPPO && trackedSPPO
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
      
        <ComponentResize />
    </MapContainer>
     
    </>
  )
}

export default App
