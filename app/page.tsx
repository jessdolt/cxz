"use client"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useState } from "react"
import TimePicker from "./_components/TimePicker"
const events = [{ title: "Meeting", start: new Date() }]

function addTwoHours(timeString: string) {
  const [inputHour, minute, period] = timeString.split(/:| /)

  let hour = parseInt(inputHour, 10)
  if (period === "PM" && hour !== 12) {
    hour += 12
  } else if (period === "AM" && hour === 12) {
    hour = 0
  }

  hour = (hour + 2) % 24

  const newHour = hour % 12 || 12
  const newPeriod = hour < 12 ? "AM" : "PM"

  const resultTime = `${newHour
    .toString()
    .padStart(2, "0")}:${minute} ${newPeriod}`
  return resultTime
}

function generateTimeList12Hour() {
  const times = []
  const totalMinutesInDay = 24 * 60 // Total minutes in a day

  for (let minutes = 0; minutes < totalMinutesInDay; minutes += 30) {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60

    let period = "AM"
    let formattedHour = hour

    if (hour >= 12) {
      period = "PM"
      formattedHour = hour === 12 ? 12 : hour - 12
    }

    if (formattedHour === 0) {
      formattedHour = 12
    }

    const formattedMinute = minute === 0 ? "00" : `${minute}`

    const formattedTime = `${formattedHour}:${formattedMinute} ${period}`
    times.push(formattedTime)
  }

  return times
}

function isLetter(c: string) {
  return c.toLowerCase() != c.toUpperCase()
}

export interface TimeSlot {
  id: number
  start: string
  end: string
  isError: boolean
  errorMessage: string
}

export default function Home() {
  const [date, setDate] = useState("")
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  const handleAddTime = () => {
    if (timeSlots.length === 0) {
      const data: TimeSlot = {
        id: Math.random(),
        start: "8:00 AM",
        end: "10:00 AM",
        isError: false,
        errorMessage: "",
      }

      setTimeSlots((prev) => [...prev, data])
      return
    }

    // We want to get the last time slot and add 2 hours to it and set it as the start time
    const lastTimeSlot = timeSlots[timeSlots.length - 1]
    const newStartTime = lastTimeSlot.end
    const newEndtime = addTwoHours(newStartTime)

    const data: TimeSlot = {
      id: Math.random(),
      start: newStartTime,
      end: newEndtime,
      isError: false,
      errorMessage: "",
    }

    setTimeSlots((prev) => [...prev, data])
  }

  const handleOnTimeChange = (id: number, value: string) => {
    const newTimeSlots = timeSlots.map((timeSlot) => {
      if (timeSlot.id === id) {
        return { ...timeSlot, start: value }
      }

      return timeSlot
    })

    setTimeSlots(newTimeSlots)
  }

  const handleOnTimeBlur = (id: number, value: string) => {
    const newTimeSlots = timeSlots.map((timeSlot) => {
      if (timeSlot.id === id) {
        console.log(isLetter(value))

        if (isLetter(value)) {
          return {
            ...timeSlot,
            start: "",
            isError: true,
            errorMessage: "Please enter a valid time",
          }
        }

        return { ...timeSlot, start: value, isError: false, errorMessage: "" }
      }

      return timeSlot
    })

    setTimeSlots(newTimeSlots)
  }

  const handleOnTimeClick = (id: number, value: string) => {
    console.log("clicjed")
    const newTimeSlots = timeSlots.map((timeSlot) => {
      if (timeSlot.id === id) {
        return { ...timeSlot, start: value }
      }

      return timeSlot
    })

    setTimeSlots(newTimeSlots)
  }

  return (
    <div>
      <h1>Demo App</h1>
      <div className={`grid grid-cols-3 max-w-7xl mx-auto gap-4 p-4 `}>
        <div className={`col-span-3 transition ${date && "!col-span-2"}`}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            weekends={false}
            events={events}
            eventContent={renderEventContent}
            viewClassNames={"h-auto"}
            selectable
            dateClick={(info) => {
              setDate(info.dateStr)
            }}
            aspectRatio={1.3}
            height={"auto"}
          />
        </div>
        <div
          className={`hidden col-span-1 border rounded-lg p-4 transition ${
            date && "!block"
          }`}
        >
          <h2>Choose Time for this date</h2>
          <div className="border-b-2 border-black/20 pt-2"></div>
          <button
            className="bg-blue-300  rounded-md p-2"
            onClick={handleAddTime}
          >
            Add time
          </button>
          <div className="mt-4 space-y-4">
            {timeSlots.map((timeSlot, index) => (
              <div className="flex items-center gap-1" key={index}>
                <TimePicker
                  id={timeSlot.id}
                  value={timeSlot.start}
                  isError={timeSlot.isError}
                  errorMessage={timeSlot.errorMessage}
                  handleOnTimeChange={handleOnTimeChange}
                  handleOnTimeClick={handleOnTimeClick}
                  handleOnTimeBlur={handleOnTimeBlur}
                />
                <span>-</span>
                <TimePicker
                  id={timeSlot.id}
                  value={timeSlot.end}
                  isError={timeSlot.isError}
                  errorMessage={timeSlot.errorMessage}
                  handleOnTimeChange={handleOnTimeChange}
                  handleOnTimeBlur={handleOnTimeBlur}
                  handleOnTimeClick={handleOnTimeClick}
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// a custom render function
function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}
