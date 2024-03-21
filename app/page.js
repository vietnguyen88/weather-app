'use client'
import Image from "next/image";
import cloudy_day from '@/public/assets/cloudy-day-2.svg'
import rainy from '@/public/assets/rainy-2.svg'
import snowy from '@/public/assets/snowy-2.svg'
import rainy5 from '@/public/assets/rainy-5.svg'
import thunder from '@/public/assets/thunder.svg'
import { db, weather_icon } from "./db";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import AutoComplete from "./components/AutoComplete";
import LoadingSVG from "./components/LoadingSVG";


const ChartData = ({ dataWeather }) => {
  return (
    <div >
      <Line className="mx-auto"
        options={{
          plugins: { legend: { display: false } }, responsive: true, scales: {
            x: {
              display: false

            },
            y: {
              display: false
            },

          }
        }}
        data={{
          labels: dataWeather?.map(w => w.time),
          datasets: [
            {
              id: 1,
              tension: 0.4,
              data: dataWeather?.map(w => w.temp_c),
            },

          ],
        }}
      // {...props}
      />
    </div>

  )
}

const findIconSmall = (code) => {
  if (code) {
    const icon = weather_icon.find(item => item.code === code)
    //  console.log(icon);
   return icon.icon

  }
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedWeather, setSelectedWeather] = useState()
  // const [currentDateTime, setCurrentDateTime] = useState(getDate())
  const [currentDateTime, setCurrentDateTime] = useState()

  const [currentHour, setCurrentHour] = useState()
  const [fiveHourWeather, setFiveHourWeather] = useState()
  const [icon, setIcon] = useState()
  const Icons = [cloudy_day, snowy, rainy, rainy5, thunder]

  const fetchData = async () => {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?q=${selectedLocation}&days=5&key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`)
    const data = await res.json();
    // setResult(() => data.map(city => city.name))
    setSelectedWeather(data)
    setCurrentDateTime(data.location.localtime)
    setCurrentHour(data.location.localtime.split(' ')[1].split(':')[0])
  }

  useEffect(() => {
    if (selectedLocation !== '') {
      fetchData()
    }
  }, [selectedLocation])

  useEffect(() => {
    const getFiveHourWeather = (data) => {
      const FiveWeather = []
      data.forecast.forecastday[0].hour.forEach(weather => {
        const hour = weather.time.split(' ')[1].split(':')[0]

        if (hour >= Number(currentHour) - 2 && hour <= Number(currentHour) + 2) {
          FiveWeather.push(weather)
          // console.log(weather)
        }
      })
      setFiveHourWeather(FiveWeather)
    }

    const findIcon = (code) => {
      if (code) {
        const icon = weather_icon.find(item => item.code === code)
        //  console.log(icon);
        setIcon(icon)

      }
    }

    if (selectedWeather ?? currentHour) {
      findIcon(selectedWeather.current.condition.code)
      getFiveHourWeather(selectedWeather)
    }
  }, [selectedWeather])

  // console.log(fiveHourWeather);
  // console.log(selectedWeather)
  // console.log('location',selectedLocation)
  // console.log(icon?.icon)
  // console.log(cloudy_day)




  return (
    <main className="bg-black flex min-h-screen flex-col  items-center justify-between p-24">
      <div className="w-[375px] h-auto aspect-[9/16] rounded-[30px] bg-gradient-to-b from-blue-400 via-blue-100 to-white">
        <div className="flex gap-x-5 items-center flex-col ">

          <div className=" p-5">
            {
              currentDateTime ?
                <div className="flex w-full justify-around gap-x-5">

                  <div suppressHydrationWarning>{currentDateTime}</div>
                </div>

                :
                <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
                  <div className="flex items-center w-full">
                    < div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                    <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                  </div>
                </div>
            }
          </div>
          <AutoComplete setSelectedLocation={setSelectedLocation} />
          {selectedWeather ? <div>
            <div className="text-center">
              <div className="mt-2">{selectedLocation}</div>
              <Image src={findIconSmall(selectedWeather.current.condition.code)} height={200} width={200} className="mx-auto" alt="" />

              <div>{selectedWeather?.current.condition.text}</div>
              <div className="font-extrabold  text-5xl">{selectedWeather?.current.temp_c}°C</div>
            </div>
            <ChartData dataWeather={fiveHourWeather} />

            <div className="flex gap-x-2 justify-between">
              {fiveHourWeather ?
                fiveHourWeather?.map((weather, i) => {
                  const hour = weather.time.split(' ')[1]
                  const code = weather.condition.code
                  const degree = weather.temp_c

                  return (
                    <div key={i} className=" rounded-md p-2 text-center">
                      <p>{hour}</p>
                      <Image className="w-12" src={findIconSmall(code)} height={200} width={200} alt="" />
                      <p>{degree}°</p>
                    </div>
                  )
                }
                )
                :
                <svg className="fill-black animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                  <circle className="opacity-0" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>

                </svg>
              }
            </div>
          </div> : <div className="absolute top-1/2">No data</div>}

        </div>
      </div>
    </main>
  );
}
