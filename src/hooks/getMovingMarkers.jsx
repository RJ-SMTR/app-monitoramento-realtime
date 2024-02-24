/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react"
import { GPSContext } from "./getGPS"
import * as turf from '@turf/turf';
import { wktRio } from '../components/polygon/holes.js'
import wellknown from 'wellknown';




export const MovingMarkerContext = createContext()


export function MovingMarkerProvider({ children }) {

    const { realtimeBrt, realtimeSPPO } = useContext(GPSContext)
    const [tracked, setTracked] = useState([])
    const [selectedLinhas, setSelectedLinhas] = useState(null)
    const [selectedBRT, setSelectedBRT] = useState(null)
    const [trackedSPPO, setTrackedSPPO] = useState([])
    const [showBRT, setShowBRT] = useState(true);
    const [showSPPO, setShowSPPO] = useState(true);

    const wktToGeoJson = (wkt) => {
        const geometry = wellknown.parse(wkt);
        return {
            type: 'Feature',
            geometry,
        }

    }

    useEffect(() => {
        if (realtimeBrt && realtimeSPPO) {
            const max_latitude = -22.59
            const min_latitude = -23.13
            const max_longitude = -43.0
            const min_longitude = -43.87


            const wktExample = wktRio
            const geoJsonFromWkt = wktToGeoJson(wktExample)

            const uniqueTrackedItems = realtimeBrt.reduce((uniqueItems, item) => {
                if (!uniqueItems.some(existingItem => existingItem.codigo === item.codigo)) {
                    uniqueItems.push(item);
                }
                return uniqueItems;
            }, []);



            const filteredBRT = uniqueTrackedItems.filter(item => {
                const point = turf.point([item.longitude, item.latitude]);

                return turf.booleanPointInPolygon(point, geoJsonFromWkt) && min_latitude <= item.latitude && item.latitude <= max_latitude && min_longitude <= item.longitude && item.longitude <= max_longitude && item.codigo.startsWith('90') || item.codigo.startsWith('E90') || item.codigo.startsWith('70') ;

            });
            const sortedBrt = filteredBRT.sort((a, b) => a.codigo - b.codigo)
            setTracked(sortedBrt);


            const uniqueItems = realtimeSPPO.reduce((uniqueItems, item) => {
                const existingItemIndex = uniqueItems.findIndex(existingItem => existingItem.ordem === item.ordem)

                if (existingItemIndex === -1) {
                    uniqueItems.push(item)
                } else {
                    const existingDatahora = uniqueItems[existingItemIndex].datahora
                    const newDatahora = item.datahora

                    if (newDatahora > existingDatahora) {
                        uniqueItems[existingItemIndex] = item;
                    }
                }

                return uniqueItems;
            }, []);
            const filteredSPPO = uniqueItems.filter(item => {
                const latitude = parseFloat(item.latitude.replace(',', '.'));
                const longitude = parseFloat(item.longitude.replace(',', '.'));
                const point = turf.point([longitude, latitude]);

                return turf.booleanPointInPolygon(point, geoJsonFromWkt) && min_latitude <= latitude && latitude <= max_latitude && min_longitude <= longitude && longitude <= max_longitude;
            });
            setTrackedSPPO(filteredSPPO);

        }
    }, [realtimeBrt, realtimeSPPO]);


















    return (
        <MovingMarkerContext.Provider value={{ tracked, setTracked, trackedSPPO, selectedLinhas, setSelectedLinhas, selectedBRT, setSelectedBRT, showBRT, setShowBRT, showSPPO, setShowSPPO }}>
            {children}
        </MovingMarkerContext.Provider>
    )
}