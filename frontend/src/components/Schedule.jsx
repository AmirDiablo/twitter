import { useState } from "react";
import { RxCross1 } from "react-icons/rx";

const Schedule = ({Data, closeSchedule}) => {
    const [date, setDate] = useState([
        {month: "January", numberOfDays: 31},
        {month: "February", numberOfDays: 28},
        {month: "March", numberOfDays: 31},
        {month: "April", numberOfDays: 30},
        {month: "May", numberOfDays: 31},
        {month: "June", numberOfDays: 30},
        {month: "July", numberOfDays: 31},
        {month: "August", numberOfDays: 31},
        {month: "September", numberOfDays: 30},
        {month: "October", numberOfDays: 31},
        {month: "November", numberOfDays: 30},
        {month: "December", numberOfDays: 31}
    ])
    const [hour, setHour] = useState()
    const [minute, setMinute] = useState()
    const [monthIndex, setMonthIndex] = useState(0)
    const [AMPM, setAMPM] = useState()
    const [day, setDay] = useState()

    const daysCount = date[monthIndex].numberOfDays
    const days = Array.from({ length: daysCount }, (_, i)=> i + 1)
    const Hours = [1, 2 , 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const minutes = Array.from({ length: 59 }, (_, i)=> i+1)
    
    const confirm = ()=> {
        const month = date[monthIndex].month
        Data(month, day, hour, minute, AMPM)
    }

    return ( 
        <div className="bg-white p-5 h-screen fixed top-0 right-0 left-0">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-5">
                    <div onClick={()=> closeSchedule(false)} className="text-2xl p-2 hover:bg-gray-200 rounded-full hover:cursor-pointer"><RxCross1 /></div>
                    <p className="font-[700]">Schedule</p>
                </div>
                <button onClick={confirm} className="bg-black text-white font-[600] py-1 px-3 rounded-2xl">Confirm</button>
            </div>

            <label htmlFor="" className="text-gray-500">Date</label>
            <div className="grid grid-cols-3 grid-rows-1 gap-2 mb-5">
                <div className="*:hover:cursor-pointer flex flex-col border-2 border-gray-400/80 hover:border-blue-400 p-2 rounded-xl row-start-1 col-start-1 col-end-3">
                    <label htmlFor="month" className="text-[13px] text-gray-500 pl-1">Month</label>
                    <select onChange={(e)=> setMonthIndex(Number(e.target.value))} name="month" id="month" defaultValue={"May"}>
                        {date.map((d, index)=> (
                            <option value={index}>{d.month}</option>
                        ))}
                    </select>
                </div>

                <div className="*:hover:cursor-pointer flex flex-col border-2 hover:border-blue-400 border-gray-400/80 px-5 py-2 rounded-xl  col-start-3 col-end-4 row-start-1">
                    <label htmlFor="Day" className="text-[13px] text-gray-500 pl-1">Day</label>
                    <select onClick={(e)=> setDay(e.target.value)} name="Day" id="Day">
                        {days.map((day)=> (
                            <option value={day}>{day}</option>
                        ))}
                    </select>
                </div>
            </div>

            <label htmlFor="" className="text-gray-500">Time</label>
            <div className="grid grid-cols-3 gap-2">
                <div className="*:hover:cursor-pointer col-start-1 col-end-2 border-2 border-gray-400 rounded-xl p-2 flex flex-col hover:border-blue-400">
                    <label htmlFor="Hour" className="text-gray-500 text-[13px]">Hour</label>
                    <select onClick={(e)=> setHour(e.target.value)} name="Hour" id="Hour">
                        {Hours.map((h)=> (
                            <option value={h}>{h}</option>
                        ))}
                    </select>
                </div>

                <div className="*:hover:cursor-pointer col-start-2 col-end-3 border-2 border-gray-400 rounded-xl p-2 flex flex-col hover:border-blue-400">
                    <label htmlFor="Minutes" className="text-gray-500 text-[13px]">Minutes</label>
                    <select onClick={(e)=> setMinute(e.target.value)} name="Minutes" id="Minutes">
                        <option value={0}>0</option>
                        {minutes.map((m)=> (
                            <option value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <div className="*:hover:cursor-pointer col-start-3 col-end-4 border-2 border-gray-400 rounded-xl p-2 flex flex-col hover:border-blue-400">
                    <label htmlFor="AM/PM" className="text-gray-500 text-[13px]">AM/PM</label>
                    <select onClick={(e)=> setAMPM(e.target.value)} name="AM/PM" id="AM/PM">
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>

            <div className="mt-5">
                <p className="text-gray-500">Time Zone</p>
                <p className="text-xl">Iran Standard Time</p>
            </div>

        </div>
    );
}
 
export default Schedule;