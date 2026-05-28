import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import AppRoute from "./routes"
import './App.css'
import {Toaster} from "react-hot-toast"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Toaster position='top-right' reverseOrder={false}/>
      <AppRoute/>
    </div>
  )
}

export default App
