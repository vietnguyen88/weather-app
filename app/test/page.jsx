'use client'
import { db } from "../db"
import { useEffect, useState } from "react";
const Test = ()=>{
    const [currentHour, setCurrentHour] = useState(db.location.localtime.split(' ')[1].split(':')[0])
    const [fiveHourWeather, setFiveHourWeather] = useState()

    useEffect(() => {
        const getFiveHourWeather = () => {
          const FiveWeather = []
          db.forecast.forecastday[0].hour.forEach(weather => {
            const hour = Number(weather.time.split(' ')[1].split(':')[0])
            const convertedCurrentHour = Number(currentHour)

            if (hour>=0 && hour<23 && convertedCurrentHour - 2 <= hour && hour <= convertedCurrentHour + 2) {
              FiveWeather.push(weather)
        
            }
          })
          setFiveHourWeather(FiveWeather)
        }
        getFiveHourWeather()
      }, [])
console.log(fiveHourWeather?.map(w => w.temp_c))
      return (
        <div>test
<div>
    {
     
        fiveHourWeather?.map((weather,i) => <p key={i}>{weather.temp_c}</p>)
    }
    </div>

        </div>
      )
}

export default Test