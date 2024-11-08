import { useEffect, useState } from 'react'
import { BsCameraVideo, BsFileMusic, BsFileText, BsFolder, BsCardImage, BsFileEarmarkPdf, BsFiletypeJson } from "react-icons/bs";
import { FaJs } from "react-icons/fa";
import { AiOutlineFileUnknown } from "react-icons/ai";
import { SiTypescript } from "react-icons/si";
import './App.css'
import { download } from './utils';
import { useLocation, useNavigate } from 'react-router-dom';

const API_URL = process.env.API_URL ?? 'http://localhost:3000'

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

  const { pathname } = useLocation()

  const navigate = useNavigate()


  const fetchData = async (filename?: string) => {

    try {
      const response = await fetch(API_URL + pathname + (filename ? "/" + filename : ""), { method: "POST" })

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
  }, [pathname])

  const onItemClick = (item: Item) => {
    const currentPath = pathname !== "/" ? pathname + "/" : ""
    item.type === "directory" && navigate(currentPath + item.name)  //setPath(prev => [...prev, item.name])
    downloadableFiles.includes(item.type) && fetchData(item.name)
  }

  const goToParent = () => {
    const path = pathname.split("/").slice(0, -1).join("/")
    navigate(path)
  }

  return (
    <div className="App">
      <div className='flex'>
        <h2 className="text-5xl font-italic underline text-grey-400">
          File explorer
        </h2>
        <div className='p-4 ml-10'>Current path: <span className='font-bold'>{pathname}</span></div>
      </div>

      <div className="p-3 m-1 text-sm w-full h-5/6 border border-gray-700 overflow-auto">
        {pathname.length > 1 && <div className="flex p-2 hover:bg-yellow-200" onClick={goToParent}>
          <BsFolder className='mr-2 text-lg' />
          <div>..</div>
        </div>}
        {data.map((i) => (
          <div key={i.name} className={`flex p-2 hover:bg-yellow-200 ${i.type === "directory" && "text-green-700"}`} onClick={() => onItemClick(i)}>
            <Icon type={i.type} />
            <div>{i.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App
