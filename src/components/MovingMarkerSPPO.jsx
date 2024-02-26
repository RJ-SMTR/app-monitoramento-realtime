/* eslint-disable react/prop-types */
'use client'
import { useEffect, useState } from "react";
import { Popup } from "react-leaflet";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
})
import { format} from "date-fns";




export default function BusMarkerSPPO({ id, data }) {
    const [prevPositions, setPrevPositions] = useState({});
    const latitude = parseFloat(data.latitude.replace(',', '.'));
    const longitude = parseFloat(data.longitude.replace(',', '.'));
    const time =  new Date(parseFloat(data.datahora))
    const formattedHora = format(time, "yyyy-MM-dd HH:mm:ss")
    const trimmed = formattedHora.match(/(\d{2}:\d{2}:\d{2})/)

    useEffect(() => {
        setPrevPositions((prevPositions) => ({
            ...prevPositions,
            [id]: [latitude, longitude],
        }));
    }, [id, latitude, longitude]);

    const prevPos = prevPositions[id] || [latitude, longitude];
    const customMarker = new L.Icon({
        iconUrl: '/imgs/markerSPPO.svg',
        iconSize: [12, 12]
    });


    return (
        <>

            <LeafletTrackingMarker
                icon={customMarker}
                position={[latitude, longitude]}
                previousPosition={prevPos}
                duration={1}
                rotationAngle={0}
                key={id}
            >
                <Popup>
                    {data.ordem ? <h4 className="mb-1"> Veículo: {data.ordem} </h4> : <></>}
                    <div className="flex items-center">
                        <h4 > Linha: <span className="font-bold">{data.linha}</span></h4>
                        <h4 > Última atualização: <span className="font-bold">{trimmed[1]}</span></h4>
                    </div>
                </Popup>
            </LeafletTrackingMarker>

        </>
    );
}
