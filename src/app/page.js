
import dynamic from 'next/dynamic'
import { format, subMinutes } from "date-fns";
import { MovingMarkerProvider } from "@/hooks/getMovingMarkers";


async function getBRT() {
  const res = await fetch('https://dados.mobilidade.rio/gps/brt/', { next: { revalidate: 60 }})

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
async function getSPPO() {
  const currentDate = new Date();

  const fiveMinutesAgo = subMinutes(currentDate, 5);

  const formattedDataInicial = format(fiveMinutesAgo, "yyyy-MM-dd HH:mm:ss");
  const formattedDataFinal = format(currentDate, "yyyy-MM-dd HH:mm:ss");

  const res = await fetch(`https://dados.mobilidade.rio/gps/sppo?dataInicial=${formattedDataInicial}&dataFinal=${formattedDataFinal}`, { next: { revalidate: 60 } })

return res.json()
}

const DynamicMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <p>Carregando...</p>
})

export default async function Home() {
  const dataBrt = await getBRT()
  const dataSPPO = await getSPPO()
  return (
    <MovingMarkerProvider brt={dataBrt} sppo={dataSPPO}>
    <DynamicMap />
    </MovingMarkerProvider>
  );
}
