/* eslint-disable react/prop-types */
import axios from "axios";
import { format, subMinutes } from "date-fns";
import { createContext, useEffect, useState } from "react";

export const GPSContext = createContext()

export function GPSProvider({ children }) {
    const [realtimeBrt, setRealtimeBrt] = useState([])
    const [realtimeSPPO, setRealtimeSPPO] = useState([])

    let allBuses = [];

    async function getGPS() {
        await axios.get('https://api.mobilidade.rio/predictor/').then(({ data }) => {
            data.results.forEach((item) => {
                allBuses.push(item);
            });
            setRealtimeBrt([...allBuses]);
            allBuses = [];
        });
    }
    let allSPPO = []
    async function getSPPO(){
        const currentDate = new Date();

        const fiveMinutesAgo = subMinutes(currentDate, 5);

        const formattedDataInicial = format(fiveMinutesAgo, "yyyy-MM-dd HH:mm:ss");
        const formattedDataFinal = format(currentDate, "yyyy-MM-dd HH:mm:ss");

       await axios.get(`https://dados.mobilidade.rio/gps/sppo?dataInicial=${formattedDataInicial}&dataFinal=${formattedDataFinal}`)
            .then((response) => {
                response.data.forEach((item) => {
                    allSPPO.push(item)
                })
                setRealtimeSPPO([...allSPPO])
                allSPPO = []
            })
    }
    function getGPSAndSPPO() {
        getGPS()
        getSPPO()
    }

   
    useEffect(() => {
       getGPSAndSPPO()

        const interval = setInterval(getGPSAndSPPO, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <GPSContext.Provider value={{ realtimeBrt, getGPS, realtimeSPPO }}>
            {children}
        </GPSContext.Provider>
    )
}
