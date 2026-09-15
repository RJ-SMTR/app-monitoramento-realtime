/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Popup } from "react-leaflet";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import L from 'leaflet';
import { format } from "date-fns";
import marker from '../assets/marker.svg'




export default function BusMarker({ id, data }) {
    const [prevPositions, setPrevPositions] = useState({});
    const time = new Date(data.datetime)
    const formattedHora = format(time, "yyyy-MM-dd HH:mm:ss")
    const trimmed = formattedHora.match(/(\d{2}:\d{2}:\d{2})/)

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
                duration={1}
                rotationAngle={0}
                key={id}
            >

                <Popup>

                    {data.id_veiculo ? <div className="flex mb-3" > <h4 > Veículo: {data.id_veiculo} </h4> </div> : <></>}

                    <div className="flex mb-3" >
                        <h4 > Modo: <span className="font-bold">BRT</span></h4>
                    </div>

                    <div className="flex" >
                        <h4 > Linha: <p className="font-bold inline">{data.servico}</p></h4>

                    </div>

                    <div className="flex my-3" >
                        <h4 > Sentido: <span className="font-bold">{data.sentido}</span></h4>
                    </div>
                    <div className="flex my-3" >

                        <h4 > Velocidade: <span className="font-bold">{data.velocidade}km/h</span></h4>
                    </div>
                    <div className="flex" >
                        <h4 > Última atualização: <span className="font-bold">{trimmed[1]}</span></h4>s
                    </div>
                </Popup>
            </LeafletTrackingMarker>

        </>
    );
}

