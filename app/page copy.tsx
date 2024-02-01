"use client"

import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { useCallback, useState } from "react"
const localizer = momentLocalizer(moment)

export default function Home() {
  const [view, setView] = useState("month")
  const [date, setDate] = useState(new Date())
  const onView = useCallback((newView) => setView(newView), [setView])

  return (
    <main>
      <div className="max-w-4xl mx-auto pt-20 h-[450px]">
        <Calendar
          localizer={localizer}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          startAccessor="start"
          endAccessor="end"
          className="h-auto"
          onSelectSlot={(slotInfo) => {
            console.log(slotInfo)
          }}
          onView={onView}
          views={["month", "agenda"]}
          selectable
        />
      </div>
    </main>
  )
}
