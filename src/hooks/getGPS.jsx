/* eslint-disable react/prop-types */
import axios from "axios";
import { subMinutes } from "date-fns";
import { createContext, useEffect, useState } from "react";

export const GPSContext = createContext()
const API_BASE_URL = import.meta.env.DEV ? '/proxy-api' : 'https://dados.mobilidade.rio';

function formatUTC(date) {
    return date.toISOString().slice(0, 19).replace('T', '+');
}

export function GPSProvider({ children }) {
    const [realtimeBrt, setRealtimeBrt] = useState([])
    const [realtimeSPPO, setRealtimeSPPO] = useState([])
    const [paintColors, setPaintColors] = useState({})

    let allBuses = [];

    async function getGPS() {
        await axios.get(`${API_BASE_URL}/gps/brt`).then(({ data }) => {
            data.veiculos.forEach((item) => {
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

        const formattedDataInicial = formatUTC(fiveMinutesAgo);
        const formattedDataFinal = formatUTC(currentDate);

        await axios.get(`${API_BASE_URL}/gps/sppo?&dataInicial=${formattedDataInicial}&dataFinal=${formattedDataFinal}`)
            .then((response) => {
                response.data.forEach((item) => {
                    const new_item = item;
                    new_item.latitude = new_item.latitude.toString();
                    new_item.longitude = new_item.longitude.toString();
                    allSPPO.push(new_item)
                })
                setRealtimeSPPO([...allSPPO])
                allSPPO = []
            })
    }
    async function getPaintColors() {
        const { data } = await axios.get(`${API_BASE_URL}/api/monitoramento-realtime/`);
        const allColors = {};
        data.forEach((item) => {
            allColors[item.ordem] = item;
        });
        setPaintColors(allColors);
    }

    function getGPSAndSPPO() {
        getPaintColors()
        getGPS()
        getSPPO()
    }

   
    useEffect(() => {
       getGPSAndSPPO()

        const interval = setInterval(getGPSAndSPPO, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <GPSContext.Provider value={{ realtimeBrt, getGPS, realtimeSPPO, paintColors }}>
            {children}
        </GPSContext.Provider>
    )
}
