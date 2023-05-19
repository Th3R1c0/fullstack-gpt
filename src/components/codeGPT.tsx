
import { useState } from "react";



interface IchatEntry {
  prompt: string, 
  AIanswer: string
}

export default function CodeGPT() {
    const [prompt, setPrompt] = useState<string>('')
    const [history] = useState<IchatEntry[]>([])


  

    return (
      <div className="flex flex-col space-y-4 border-t-2 p-4 border-white">
            <h1 className="text-4xl">CodeGPT (broken)</h1>
            generates unit tests in JEST, MOCHA from the code you paste in, 
            <h3 className="text-2xl">paste code here:</h3>
        <div className="flex space-x-2">
            <input className="input input-bordered input-secondary w-full max-w-xs" value={prompt} onChange={e => setPrompt(e.target.value)} />
            <button className="btn">enter</button>
        </div>
        <div>
          <h1 className="font-bold">History: </h1>
          <div>
            {history.length > 0 ?  history.map((entry, index) => {
              return (
                <p key={index}>{entry.prompt}:{entry.AIanswer}</p>
              )
            }): 'no history yet'}
          </div>
          </div>
        </div>
    )
}