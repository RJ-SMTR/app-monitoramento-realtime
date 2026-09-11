/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const GPSContext = createContext()
const API_BASE_URL = import.meta.env.DEV ? '/proxy-api' : 'https://its.mobilidade.rio';
const LEGACY_API_BASE_URL = import.meta.env.DEV ? '/proxy-api-legado' : 'https://dados.mobilidade.rio';

// O endpoint só busca exatamente 1 minuto por chamada, nunca um intervalo
// arbitrário. O minuto corrente ainda está sendo populado pelos fornecedores
// no momento da chamada, por isso usamos o minuto anterior — já fechado, e
// com o snapshot completo (o backend consolida os quartos de minuto
// coletados enquanto ele estava aberto).
async function fetchAllVehiclePositions() {
    let minutoUtc = new Date(Date.now() - 60000).toISOString();
    let cursor;
    const allData = [];

    do {
        const params = { limit: 5000, minuto_utc: minutoUtc };
        if (cursor) params.cursor = cursor;

        const { data } = await axios.get(`${API_BASE_URL}/v1/geolocalizacao/veiculos`, { params });

        minutoUtc = data.minuto_utc;
        allData.push(...data.data);
        cursor = data.next_cursor;
    } while (cursor);

    return allData;
}

function classify(item) {
    if (item.sistema === 'rio') return 'sistema-rio';
    return 'sppo';
}

function dedupById(items) {
    const byId = new Map();
    for (const item of items) {
        const existing = byId.get(item.id_veiculo);
        if (!existing || new Date(item.datetime) > new Date(existing.datetime)) {
            byId.set(item.id_veiculo, item);
        }
    }
    return Array.from(byId.values());
}

export function GPSProvider({ children }) {
    const [realtimeBrt, setRealtimeBrt] = useState([])
    const [realtimeSPPO, setRealtimeSPPO] = useState([])
    const [realtimeSistemaRio, setRealtimeSistemaRio] = useState([])
    const [paintColors, setPaintColors] = useState({})

    async function getPaintColors() {
        const { data } = await axios.get(`${LEGACY_API_BASE_URL}/api/monitoramento-realtime/`);
        const allColors = {};
        data.forEach((item) => {
            allColors[item.ordem] = item;
        });
        setPaintColors(allColors);
    }

    async function getGPSAndSPPO() {
        const [, positionsResult] = await Promise.allSettled([
            getPaintColors(),
            fetchAllVehiclePositions(),
        ]);

        if (positionsResult.status !== 'fulfilled') {
            console.error('Erro ao buscar posições de veículos', positionsResult.reason);
            return;
        }

        const rawData = positionsResult.value;
        const brtRaw = rawData.filter((item) => item.modo === 'brt');
        const onibusRaw = rawData.filter((item) => item.modo === 'onibus');

        const brt = dedupById(brtRaw);
        const onibus = dedupById(onibusRaw);

        const sppo = [];
        const sistemaRio = [];
        onibus.forEach((item) => {
            if (classify(item) === 'sistema-rio') {
                sistemaRio.push(item);
            } else {
                sppo.push(item);
            }
        });

        setRealtimeBrt(brt);
        setRealtimeSPPO(sppo);
        setRealtimeSistemaRio(sistemaRio);
    }

    useEffect(() => {
        getGPSAndSPPO()

        const interval = setInterval(getGPSAndSPPO, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <GPSContext.Provider value={{ realtimeBrt, realtimeSPPO, realtimeSistemaRio, getGPS: getGPSAndSPPO, paintColors }}>
            {children}
        </GPSContext.Provider>
    )
}
