"use client"
import React, { useState, useRef, useEffect } from "react"

const ButtonList = ({ buttons, onButtonClick }) => {
  return (
    <div>
      {buttons.map((button, index) => (
        <button key={index} onClick={() => onButtonClick(button)}>
          {button}
        </button>
      ))}
    </div>
  )
}

const App = () => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const inputRef = useRef(null)

  const handleButtonClick = (button) => {
    // Handle button click logic
    console.log(`${button} clicked`)

    // Focus back on the input
    inputRef.current.focus()
  }

  const handleInputFocus = () => {
    // Set state to indicate input focus
    setIsInputFocused(true)
  }

  const handleInputBlur = () => {
    // Set state to indicate input blur
    setIsInputFocused(false)
  }

  useEffect(() => {
    // Focus on the input when isInputFocused state changes to true
    if (isInputFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isInputFocused])

  return (
    <div>
      <input
        ref={inputRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Click to focus"
      />
      {isInputFocused && (
        <ButtonList
          buttons={["Button 1", "Button 2", "Button 3"]}
          onButtonClick={handleButtonClick}
        />
      )}
    </div>
  )
}

export default App
