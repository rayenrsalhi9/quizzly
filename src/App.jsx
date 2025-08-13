import { useState } from "react"
import Home from "./pages/Home"
import Questions from "./pages/Questions"

export default function App() {

    const [isHome, setIsHome] = useState(true)

    return (
      <div className="container">
          {
              isHome ? <Home setIsHome={setIsHome} /> : <Questions />
          }
      </div>
    )
}
