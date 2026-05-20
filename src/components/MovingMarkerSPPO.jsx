/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Popup } from "react-leaflet";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import L from 'leaflet';
import marker from '../assets/markerSPPO.svg'
import { format} from "date-fns";




export default function BusMarkerSPPO({ id, data, color }) {
    const [prevPositions, setPrevPositions] = useState({});
    const latitude = parseFloat(data.latitude.replace(',', '.'));
    const longitude = parseFloat(data.longitude.replace(',', '.'));
    const time =  new Date(parseFloat(data.datahora))
    const formattedHora = format(time, "yyyy-MM-dd HH:mm:ss")
    const trimmed = formattedHora.match(/(\d{2}:\d{2}:\d{2})/)

    function createMarker(color) {
        return new L.Icon({
            iconUrl:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                        <circle
                            cx="7"
                            cy="7"
                            r="6"
                            fill="${color}"
                            stroke="black"
                            stroke-width="1"
                        />
                    </svg>
                `),
            iconSize: [14, 14],
        });
    }

    useEffect(() => {
        setPrevPositions((prevPositions) => ({
            ...prevPositions,
            [id]: [latitude, longitude],
        }));
    }, [id, latitude, longitude]);

    const prevPos = prevPositions[id] || [latitude, longitude];

    let customMarker
    if (color && Object.keys(color).length > 0) {
        customMarker = createMarker(color.cor_hex);
    } else {
        customMarker = createMarker("#FFFFFF");
        // customMarker = new L.Icon({
        //     iconUrl: marker,
        //     iconSize: [14, 14]
        // });
    }
    


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
                    {data.ordem ? <h4 className="mb-3 "> Veículo:<p className="font-bold inline"> {data.ordem}</p> </h4> : <></>}
                        <div className="flex" >
                            <h4 > Linha: <p className="font-bold inline">{data.linha}</p></h4>

                        </div>
                        <div className="flex my-3" >
                            <h4 > Velocidade: <p className="font-bold inline">{data.velocidade}km/h</p></h4>
                        </div>
                    <div className="flex  my-3" >
                            <h4 > Última atualização: <p className="font-bold inline">{trimmed[1]}</p></h4>
                        </div>

                        <div className="flex my-3" >
                            <h4 > Chassi: <p className="font-bold inline">{data.nome_chassi}</p></h4>
                        </div>
                    <div className="flex" >
                            <h4 > Ano Fabricação: <p className="font-bold inline">{data.ano_fabricacao}</p></h4>
                        </div>
                        <div className="flex mt-3 mb-2" >
                            <h4 > Carroceria: <p className="font-bold inline">{data.carroceria}</p></h4>
                        </div>
                        <div className="flex" >
                            <h4 className="leading-4"> Tipo de Veículo: <p className="font-bold inline">{data.tipo_veiculo}</p></h4>
                        </div>

                </Popup>
            </LeafletTrackingMarker>

        </>
    );
}
