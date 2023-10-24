/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react"
import { GPSContext } from "./getGPS"
import { subMinutes, isAfter} from 'date-fns';




export const MovingMarkerContext = createContext()


export function MovingMarkerProvider({ children }) {

    const { realtimeBrt, realtimeSPPO } = useContext(GPSContext)
    const [tracked, setTracked] = useState([])
    const [trackedSPPO, setTrackedSPPO] = useState([])



    useEffect(() => {
        if (realtimeBrt && realtimeSPPO) {
            const currentTime = new Date();
            const filteredItems = realtimeBrt.filter(item => {
                const itemTime = new Date(item.dataHora); 
                return isAfter(itemTime, subMinutes(currentTime, 5));
            });
            const uniqueTrackedItems = filteredItems.reduce((uniqueItems, item) => {
                if (!uniqueItems.some(existingItem => existingItem.codigo === item.codigo)) {
                    uniqueItems.push(item);
                }
                return uniqueItems;
            }, []);
            setTracked(uniqueTrackedItems);
          
            const filteredSPPO = realtimeSPPO.filter(item => {
                const itemTime = new Date(parseFloat(item.datahoraenvio))
                const fiveMinutesAgo = subMinutes(currentTime, 5)
                return isAfter(fiveMinutesAgo, itemTime);
            });
            console.log(filteredSPPO)

            const uniqueItems = filteredSPPO.reduce((uniqueItems, item) => {
                if (!uniqueItems.some(existingItem => existingItem.ordem === item.ordem)) {
                    uniqueItems.push(item);
                }
                return uniqueItems;
            }, []);

            setTrackedSPPO(uniqueItems);
            
        }
    }, [realtimeBrt, realtimeSPPO]);



 




  
   








    return (
        <MovingMarkerContext.Provider value={{ tracked, setTracked, trackedSPPO }}>
            {children}
        </MovingMarkerContext.Provider>
    )
}