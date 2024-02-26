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





export default function BusMarker({ id, data}) {
    const [prevPositions, setPrevPositions] = useState({});
    const date = new Date(data.dataHora)
    date.setUTCHours(date.getUTCHours() - 3)
    const formattedDate = date.toISOString()
    const trimmed = formattedDate.match(/(\d{2}:\d{2}:\d{2})/)

    useEffect(() => {
        setPrevPositions((prevPositions) => ({
            ...prevPositions,
            [id]: [data.latitude, data.longitude],
        }));
    }, [id, data.latitude, data.longitude]);

    const prevPos = prevPositions[id] || [data.latitude, data.longitude];
    const customMarker = new L.Icon({
        iconUrl: '/imgs/marker.svg',
        iconSize: [12, 12]
    });



    return (
        <>

            <LeafletTrackingMarker
              icon={customMarker}
                position={[data.latitude, data.longitude]}
                previousPosition={prevPos}
                duration={1}
                rotationAngle={0}
                key={id}
            >
                <Popup>
                    {data.codigo ? <h4 className="mb-1"> Veículo: {data.codigo} </h4> : <></>}
                    <div className="flex items-center">
                        <h4 > Linha: <span className="font-bold">{data.linha}</span></h4>
                        <h4 > Sentido: <span className="font-bold">{data.sentido}</span></h4>
                        <h4 > Última atualização: <span className="font-bold">{trimmed[1]}</span></h4>s
                    </div>
                </Popup>
            </LeafletTrackingMarker>

        </>
    );
}
