'use client'

import { useEffect, useState } from "react";
import { autocomplete } from "../db";
const AutoComplete = ({ setSelectedLocation }) => {

    const [searchTerm, setSearchTerm] = useState('')
    const [result, setResult] = useState()
    const [isOpen, setIsOpen] = useState(false)

    // console.log(result)
    // const autoComplete = () => {

    //     const filteredSuggestions = autocomplete.filter(suggestion => suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()));
    //     // console.log('filter', filteredSuggestions);
    //     setResult(filteredSuggestions);
    //     setIsOpen(true)
    // }

    const fetchData = async () => {
        const res = await fetch(`https://api.weatherapi.com/v1/search.json?q=${searchTerm}&key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`)
        const data = await res.json();
        // setResult(() => data.map(city => city.name))
        setResult(data)
        setIsOpen(true)

    }
    useEffect(() => {
        let timeout
        if (searchTerm !== '') {
            timeout = setTimeout(() => {
              fetchData()
            }, 2000);
        }
        return (() => clearTimeout(timeout))
    }, [searchTerm])


    const handleChangeInput = (e)=>{
        if(!e.target.value.length){
            setIsOpen(false)
            setSearchTerm('')
        }
        else{
            console.log(e.target.value)
            setSearchTerm(e.target.value)
        }
    }
  
    return (
        <div>
            <div className="w-auto relative">
                <div>
                    <input type="search" className="p-2 rounded-md search" placeholder="City, Postcode, Zipcode" value={searchTerm} onChange={handleChangeInput}  />

                </div>
                <div className={`bg-white ${isOpen ? 'visible' : 'hidden'} overflow-y-auto w-full absolute z-10 rounded-md mt-[1px] divide-y-[1px] `}>
                    {
                        result?.map((item, i) => <p key={i} className="hover:bg-slate-400 cursor-pointer p-2" value='test' onClick={() => {
                            setSelectedLocation(item.name)
                            setIsOpen(false)
                            setSearchTerm('')
                        }}>
                            {item.name}, {item.country}
                        </p>)
                    }

                </div>
            </div>
        </div>
    )


}

export default AutoComplete