/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useRef, useState } from "react";

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

const STALE_AFTER_MS = 5 * 60 * 1000;

// Em vez de substituir a lista inteira a cada busca (o que faz o mapa "piscar" quase
// vazio sempre que uma busca chega incompleta, ex. na virada de minuto), mantemos um mapa
// persistente por id_veiculo: cada busca só atualiza quem voltou nela, o resto continua
// instanciado com a última posição conhecida. Um veículo só sai do mapa quando passa
// STALE_AFTER_MS sem aparecer em nenhuma busca -- não quando uma única busca falha em
// trazê-lo de volta.
function mergeAndPrune(map, items) {
    const now = Date.now();
    dedupById(items).forEach((item) => {
        map.set(item.id_veiculo, { position: item, lastSeen: now });
    });
    for (const [id, entry] of map) {
        if (now - entry.lastSeen > STALE_AFTER_MS) {
            map.delete(id);
        }
    }
    return Array.from(map.values(), (entry) => entry.position);
}

export function GPSProvider({ children }) {
    const [realtimeBrt, setRealtimeBrt] = useState([])
    const [realtimeSPPO, setRealtimeSPPO] = useState([])
    const [realtimeSistemaRio, setRealtimeSistemaRio] = useState([])
    const [paintColors, setPaintColors] = useState({})

    // Um mapa por categoria renderizada -- mesma fronteira de modo/sistema que o filtro
    // já aplicava antes de deduplicar, só que agora persistente entre buscas.
    const brtVehicles = useRef(new Map())
    const sppoVehicles = useRef(new Map())
    const sistemaRioVehicles = useRef(new Map())

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

        const sppoRaw = [];
        const sistemaRioRaw = [];
        onibusRaw.forEach((item) => {
            if (classify(item) === 'sistema-rio') {
                sistemaRioRaw.push(item);
            } else {
                sppoRaw.push(item);
            }
        });

        setRealtimeBrt(mergeAndPrune(brtVehicles.current, brtRaw));
        setRealtimeSPPO(mergeAndPrune(sppoVehicles.current, sppoRaw));
        setRealtimeSistemaRio(mergeAndPrune(sistemaRioVehicles.current, sistemaRioRaw));
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
