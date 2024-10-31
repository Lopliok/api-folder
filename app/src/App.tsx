import React, { useEffect, useState } from 'react'
import './App.css'

type Item = {
  name: string
  parent: string
  type: string
}

function App() {
  const [data, setData] = useState<Item[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/Downloads')
        const result = await response.json()

        console.log(result)
        setData(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="App">
      <h2 className="text-5xl font-italic underline text-grey-400">
        File explorer
      </h2>
      <figure>
        <figcaption>Listen to the T-Rex:</figcaption>
        <audio controls src="Downloads/tedtady.mp3"></audio>
        <a href="tedtady.mp3"> Download audio </a>
      </figure>
      <div className="p-3 text-sm w-full overflow-auto">
        {data.map((i) => (
          <div className="flex">
            <div>{i.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App
