import { TimeSlot } from "@/app/page"
import React, { useEffect, useRef, useState } from "react"

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

interface TimePickerProps extends Partial<TimeSlot> {
  id: number
  value: string
  handleOnTimeChange: (id: number, value: string) => void
  handleOnTimeClick: (id: number, value: string) => void

  handleOnTimeBlur: (id: number, value: string) => void
  readOnly?: boolean
}

const TimePicker: React.FC<TimePickerProps> = ({
  id,
  value,
  isError,
  errorMessage,
  handleOnTimeChange,
  handleOnTimeClick,
  handleOnTimeBlur,
  readOnly = false,
}) => {
  const [isFocus, setIsFocus] = useState(false)
  const timeList12Hour = generateTimeList12Hour()
  const dropdownRef = useRef(null)
  const timePickerRef = useRef(null)
  //   className="border w-full p-2 read-only:opacity-50 read-only:border-gray-300 read-only:cursor-not-allowed"
  useEffect(() => {
    if (timePickerRef.current) {
      timePickerRef.current.focus()
    }
  }, [])

  return (
    <div className="relative max-w-[150px]">
      <div>
        <input
          type="text"
          list="timeOptions"
          placeholder="Choose a time"
          value={value}
          className={`${
            isError ? "border-red-500" : ""
          } border w-full p-2 read-only:opacity-50 read-only:border-gray-300 read-only:cursor-not-allowed`}
          onChange={(e) => handleOnTimeChange(id, e.target.value)}
          onFocus={() => !readOnly && setIsFocus(true)}
          onBlur={(e) => {
            !readOnly && setIsFocus(false)
            handleOnTimeBlur(id, e.target.value)
          }}
          readOnly={readOnly}
          ref={timePickerRef}
        />
        <p className="text-xs text-red-600 mt-1">{isError && errorMessage}</p>
      </div>

      {isFocus && (
        <div
          className="absolute border max-h-[150px] shadow-sm z-10  mt-2 overflow-y-auto bg-white"
          ref={dropdownRef}
        >
          {timeList12Hour.map((time, index) => (
            <button
              type="button"
              className="py-2 px-4 hover:bg-zinc-300 w-full"
              onClick={(e) => {
                e.preventDefault()
                handleOnTimeClick(id, time)
              }}
              key={index}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TimePicker
