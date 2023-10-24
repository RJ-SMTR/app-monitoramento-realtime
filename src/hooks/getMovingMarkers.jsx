/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react"
import { GPSContext } from "./getGPS"




export const MovingMarkerContext = createContext()


export function MovingMarkerProvider({ children }) {

    const { realtimeBrt, realtimeSPPO } = useContext(GPSContext)
    const [tracked, setTracked] = useState([])
    const [selectedLinhas, setSelectedLinhas] = useState(null)
    const [selectedBRT, setSelectedBRT] = useState(null)
    const [trackedSPPO, setTrackedSPPO] = useState([])


    useEffect(() => {
        if (realtimeBrt && realtimeSPPO) {
            const uniqueTrackedItems = realtimeBrt.reduce((uniqueItems, item) => {
                if (!uniqueItems.some(existingItem => existingItem.codigo === item.codigo)) {
                    uniqueItems.push(item);
                }
                return uniqueItems;
            }, []);
            setTracked(uniqueTrackedItems);


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
            setTrackedSPPO(uniqueItems);
            
        }
    }, [realtimeBrt, realtimeSPPO]);



 




  
   








    return (
        <MovingMarkerContext.Provider value={{ tracked, setTracked, trackedSPPO, selectedLinhas, setSelectedLinhas, selectedBRT, setSelectedBRT }}>
            {children}
        </MovingMarkerContext.Provider>
    )
}