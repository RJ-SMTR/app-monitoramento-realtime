'use client'

import { LayerGroup, MapContainer, Marker, TileLayer } from "react-leaflet"
import { useContext, useEffect, useState } from "react"
import { useMap } from 'react-leaflet/hooks'
import { MovingMarkerContext } from "../hooks/getMovingMarkers"
import BusMarker from "../components/MovingMarkersBRT"
import BusMarkerSPPO from "../components/MovingMarkerSPPO"
import Tables from "./table"
import TablesBRT from "./tableBRT"
import Logos from "./logos"
import 'leaflet/dist/leaflet.css'


function MapHome() {
    const [location, setLocation] = useState([-22.935872, -43.455088])
    const { tracked,trackedSPPO, selectedLinhas, selectedBRT, showSPPO, showBRT } = useContext(MovingMarkerContext)
    const ComponentResize = () => {
        const map = useMap()
        setTimeout(() => {
            map.invalidateSize()
        }, 0)
        return null
    }
    

    return (
        <>

            <Logos />
            <div className="tables">
                <Tables />
                <TablesBRT />
            </div>
            <MapContainer style={{
                height: '100vh',
                width: '100vw'
            }} center={location} zoom={12} >

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

export default MapHome
