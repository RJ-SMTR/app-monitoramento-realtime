/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react"
import { GPSContext } from "./getGPS"
import * as turf from '@turf/turf';
import { garages } from "../components/garages/garages";




export const MovingMarkerContext = createContext()


export function MovingMarkerProvider({ children }) {

    const { realtimeBrt, realtimeSPPO } = useContext(GPSContext)
    const [tracked, setTracked] = useState([])
    const [selectedLinhas, setSelectedLinhas] = useState(null)
    const [selectedBRT, setSelectedBRT] = useState(null)
    const [trackedSPPO, setTrackedSPPO] = useState([])


    useEffect(() => {
        if (realtimeBrt && realtimeSPPO) {
            const max_latitude = -22.59
            const min_latitude = -23.13
           const max_longitude = -43.0
        const  min_longitude = -43.87
            const scale = 1.5
            const garagePolygons = garages.map((garage, index) => ({
                type: 'Feature',
                properties: {
                    id: index,
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [garage],
                },
            }))
            const scaledGaragePolygons = garagePolygons.map((garage) => {
                const scaledPolygon = turf.transformScale(garage, scale);
                return scaledPolygon;
            })
           

            const uniqueTrackedItems = realtimeBrt.reduce((uniqueItems, item) => {
                if (!uniqueItems.some(existingItem => existingItem.codigo === item.codigo)){
                    uniqueItems.push(item);
                }
                return uniqueItems;
            }, []);



            const filteredBRT = uniqueTrackedItems.filter(item => {
                const point = turf.point([item.longitude, item.latitude]);
                return !scaledGaragePolygons.some(garage => turf.booleanPointInPolygon(point, garage)) && min_latitude <= item.latitude && item.latitude <= max_latitude && min_longitude <= item.longitude && item.longitude <= max_longitude;
            });
            const sortedBrt =   filteredBRT.sort((a,b) => a.codigo - b.codigo)
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

                return !scaledGaragePolygons.some(garage => turf.booleanPointInPolygon(point, garage)) && min_latitude <= latitude && latitude <= max_latitude && min_longitude <= longitude && longitude <= max_longitude;
            });
            setTrackedSPPO(filteredSPPO);
            
        }
    }, [realtimeBrt, realtimeSPPO]);



 




  
   








    return (
        <MovingMarkerContext.Provider value={{ tracked, setTracked, trackedSPPO, selectedLinhas, setSelectedLinhas, selectedBRT, setSelectedBRT }}>
            {children}
        </MovingMarkerContext.Provider>
    )
}