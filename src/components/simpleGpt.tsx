
import { useState } from "react";

import { api } from "~/utils/api";
import { useAutoAnimate } from '@formkit/auto-animate/react'
    

interface IchatEntry {
  prompt: string, 
  AIanswer: string
}

export default function SimpleGptExample() {
    const [prompt, setPrompt] = useState<string>('')
    const [history, setHistory] = useState<IchatEntry[]>([])
    const [parent] = useAutoAnimate(/* optional config */)
    const [loading, setLoading] = useState(false)
    const askChatgpt = api.langchain.simpleGpt.useMutation({
      onMutate: () => {
        setLoading(true)
      },
      onSuccess: (data) => {
        setLoading(false)
        const chatEntry: IchatEntry = {
          prompt: prompt,
          AIanswer: data.response,
        }
        setHistory([...history, chatEntry])
        setPrompt('')
      }
    })
  
    const submit = () => {
      askChatgpt.mutate({
        text: prompt,
      })
    }
    return (
      <div className="flex flex-col space-y-4 border-t-2 p-4 border-white">
            <h1 className="text-4xl">Simple GPT</h1>
            simple CHATgpt
        <div className="flex space-x-2">
            <input className="input input-bordered input-secondary w-full max-w-xs" value={prompt} onChange={e => setPrompt(e.target.value)} />
            <button className="btn" onClick={submit} disabled={loading}>{loading ? 'loading' : 'enter'}</button>
        </div>
        <div>
          <h1 className="font-bold">History: </h1>
          <div ref={parent} className="max-w-[400px] flex flex-col">
            {history.length > 0 ?  [...history].reverse().map((entry, index) => {
              return (
                <div className='flex flex-col' key={index}>
                  <div className=''>{entry.prompt}</div>
                  <b className='self-end'>{entry.AIanswer}</b>
                  </div>
                
              )
            }): 'no history yet'}
          </div>
          </div>
        </div>
    )
}