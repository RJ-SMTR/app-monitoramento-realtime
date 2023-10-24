/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Popup } from "react-leaflet";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import L from 'leaflet';
import marker from '../assets/marker.svg'




export default function BusMarker({ id, data}) {
    const [prevPositions, setPrevPositions] = useState({});
    const trimmed = data.dataHora.match(/(\d{2}:\d{2}:\d{2})/)

    useEffect(() => {
        setPrevPositions((prevPositions) => ({
            ...prevPositions,
            [id]: [data.latitude, data.longitude],
        }));
    }, [id, data.latitude, data.longitude]);

    const prevPos = prevPositions[id] || [data.latitude, data.longitude];
    const customMarker = new L.Icon({
        iconUrl: marker,
        iconSize: [14, 14]
    });


    return (
        <>

            <LeafletTrackingMarker
            icon={customMarker}
                position={[data.latitude, data.longitude]}
                previousPosition={prevPos}
                duration={6000}
                rotationAngle={0}
                key={id}
            >
                <Popup>
                    {data.codigo ? <h4 className="mb-1"> Veículo: {data.codigo} </h4> : <></>}
                    <div className="flex items-center">
                        <h4 > Linha: <span className="font-bold">{data.trip_short_name}</span></h4>
                        <h4 > Sentido: <span className="font-bold">{data.direction_id}</span></h4>
                        <h4 > Última atualização: <span className="font-bold">{trimmed[1]}</span></h4>
                    </div>
                </Popup>
            </LeafletTrackingMarker>

        </>
    );
}
