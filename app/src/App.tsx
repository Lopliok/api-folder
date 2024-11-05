import React, { ReactNode, useEffect, useState } from 'react'
import { BsCameraVideo, BsFileMusic, BsFileText, BsFolder, BsCardImage, BsFileEarmarkPdf, BsFiletypeJson } from "react-icons/bs";
import { FaJs } from "react-icons/fa";
import { AiOutlineFileUnknown } from "react-icons/ai";
import { SiTypescript } from "react-icons/si";
import './App.css'
import { download } from './utils';

const API_URL = 'http://localhost:3000/'

type Item = {
  name: string
  parent: string
  type: string
}


const iconTranslation = {
  mp3: BsFileMusic,
  mp4: BsCameraVideo,
  txt: BsFileText,
  directory: BsFolder,
  js: FaJs,
  ts: SiTypescript,
  jpg: BsCardImage,
  png: BsCardImage,
  svg: BsCardImage,
  webp: BsCardImage,
  pdf: BsFileEarmarkPdf,
  json: BsFiletypeJson
}

const downloadableFiles = ["mp3", "txt", "pdf", "deb", "jpg", "svg", "webp", "json"]

const Icon = ({ type }: { type: string }) => {
  const IconComponent = iconTranslation?.[type as keyof typeof iconTranslation] ?? AiOutlineFileUnknown
  return <IconComponent className='mr-2 text-lg' />
}

function App() {
  const [data, setData] = useState<Item[]>([])
  const [path, setPath] = useState<string[]>([])

  const buildFullPath = () => path.join("/")


  const fetchData = async (filename?: string) => {

    try {
      const response = await fetch(API_URL + buildFullPath() + (filename ? "/" + filename : ""), { method: "POST" })

      if (filename) {
        response.blob().then(blob => download(blob, filename))
      } else {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [path])

  const onItemClick = (item: Item) => {
    item.type === "directory" && setPath(prev => [...prev, item.name])
    downloadableFiles.includes(item.type) && fetchData(item.name)
  }

  return (
    <div className="App">
      <div className='flex'>
        <h2 className="text-5xl font-italic underline text-grey-400">
          File explorer
        </h2>
        <div className='p-4 ml-10'>Current path: <span className='font-bold'>{buildFullPath()}</span></div>
      </div>

      <div className="p-3 m-1 text-sm w-full h-5/6 border border-gray-700 overflow-auto">
        {path.length > 0 && <div className="flex p-2 hover:bg-yellow-200" onClick={() => setPath(p => p.slice(0, -1))}>
          <BsFolder className='mr-2 text-lg' />
          <div>..</div>
        </div>}
        {data.map((i) => (
          <div className={`flex p-2 hover:bg-yellow-200 ${i.type === "directory" && "text-green-700"}`} onClick={() => onItemClick(i)}>
            <Icon type={i.type} />
            <div>{i.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App
