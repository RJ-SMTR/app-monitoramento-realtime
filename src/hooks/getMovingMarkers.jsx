/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react"
import { GPSContext } from "./getGPS"
import * as turf from '@turf/turf';
import { wktRio } from '../components/polygon/holes.js'
import wellknown from 'wellknown';




export const MovingMarkerContext = createContext()


export function MovingMarkerProvider({ children }) {
    const colors = {
        "Área A": "#8031A7",
        "Área B": "#FF7500",
        "Área C": "#9E652E",
        "Área D": "#71C5E8",
        "Área E": "#F04E98",
        "Área F": "#1FA824",
        "Área G": "#0047BB",
        "Área H": "#E4002B",
        "Área I": "#B1B3B3",
        "Demais": "#FFFFFF",
}

    const { realtimeBrt, realtimeSPPO, realtimeSistemaRio, paintColors } = useContext(GPSContext)
    const [tracked, setTracked] = useState([])
    const [selectedLinhas, setSelectedLinhas] = useState(null)
    const [selectedBRT, setSelectedBRT] = useState(null)
    const [selectedSistemaRio, setSelectedSistemaRio] = useState(null)
    const [trackedSPPO, setTrackedSPPO] = useState([])
    const [trackedSistemaRio, setTrackedSistemaRio] = useState([])
    const [showBRT, setShowBRT] = useState(true);
    const [showSPPO, setShowSPPO] = useState(true);
    const [showSistemaRio, setShowSistemaRio] = useState(true);
    const [enabledColors, setEnabledColors] = useState(Object.fromEntries( Object.values(colors).map(color => [color, true])));

    const wktToGeoJson = (wkt) => {
        const geometry = wellknown.parse(wkt);
        return {
            type: 'Feature',
            geometry,
        }

    }

    useEffect(() => {
        if (realtimeBrt && realtimeSPPO && realtimeSistemaRio) {
            const max_latitude = -22.59
            const min_latitude = -23.13
            const max_longitude = -43.0
            const min_longitude = -43.87

            const geoJsonFromWkt = wktToGeoJson(wktRio)

            const filterInRio = (item) => {
                const point = turf.point([item.longitude, item.latitude]);

                return turf.booleanPointInPolygon(point, geoJsonFromWkt) && min_latitude <= item.latitude && item.latitude <= max_latitude && min_longitude <= item.longitude && item.longitude <= max_longitude;
            };

            const sortedBrt = realtimeBrt.filter(filterInRio).sort((a, b) => a.id_veiculo.localeCompare(b.id_veiculo))
            setTracked(sortedBrt);

            setTrackedSPPO(realtimeSPPO.filter(filterInRio));
            setTrackedSistemaRio(realtimeSistemaRio.filter(filterInRio));
        }
    }, [realtimeBrt, realtimeSPPO, realtimeSistemaRio]);


















    return (
        <MovingMarkerContext.Provider value={{ tracked, setTracked, trackedSPPO, trackedSistemaRio, selectedLinhas, setSelectedLinhas, selectedBRT, setSelectedBRT, selectedSistemaRio, setSelectedSistemaRio, showBRT, setShowBRT, showSPPO, setShowSPPO, showSistemaRio, setShowSistemaRio, paintColors, enabledColors, setEnabledColors, colors }}>
            {children}
        </MovingMarkerContext.Provider>
    )
}