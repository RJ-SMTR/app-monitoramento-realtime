/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Popup } from "react-leaflet";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import L from 'leaflet';
import marker from '../assets/markerSPPO.svg'
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
        iconUrl: marker,
        iconSize: [14, 14]
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
                        {data.ordem ? <h4 className="mb-3"> Veículo: {data.ordem} </h4> : <></>}
                        <div className="flex" >
                            <h4 > Linha: <p className="font-bold inline">{data.linha}</p></h4>

                        </div>
                        <div className="flex my-3" >
                            <h4 > Velocidade: <p className="font-bold inline">{data.velocidade}km/h</p></h4>
                        </div>
                        <div className="flex" >
                            <h4 > Última atualização: <p className="font-bold inline">{trimmed[1]}</p></h4>
                        </div>
                </Popup>
            </LeafletTrackingMarker>

        </>
    );
}
