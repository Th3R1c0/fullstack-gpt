
import Link from "next/link";
import { useState, ref } from "react";

import { api } from "~/utils/api";


import { useAutoAnimate } from '@formkit/auto-animate/react'

interface IchatEntry {
  prompt: string, 
  AIanswer: string
  source: string,
  script: string,
}

export default function YoutubeScriptGPT() {
    const [prompt, setPrompt] = useState<string>('')
    const [history, setHistory] = useState<IchatEntry[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [parent] = useAutoAnimate(/* optional config */)
    const askChatgpt = api.langchain.youtubeScriptWriterGPT.useMutation({
      onMutate: () => {
        setLoading(true)
      },
      onSuccess: (data) => {
        setLoading(false)
        const title = data.title.titleRes.text as string
        const script = data.script.scriptRes.text as string
        const source = data.source 
        const chatEntry: IchatEntry = {
          prompt: prompt,
          AIanswer: title,
          source: source,
          script: script,
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
            <h1 className="text-4xl">Youtube script gpt</h1>
            generates a Youtube title, script and source of infomation
            <h3 className="text-2xl"> {loading ? 'generating title, script and source...':'enter video idea:'}</h3>
        <div className="flex space-x-2">
            <input className="input input-bordered input-secondary w-full max-w-xs" value={prompt} onChange={e => setPrompt(e.target.value)} />
            <button className="btn" disabled={loading} onClick={submit}>{loading ? 'loading' : 'enter'}</button>
        </div>
        <div>
          <h1 className="font-bold">History: </h1>
          <div ref={parent} className="flex flex-col space-y-8">
            {history.length > 0 ?  history.map((entry, index) => {
              return (
                <div key={index}>
                <b>Topic:</b> {entry.prompt} <br />
                <b>Title:</b> {entry.AIanswer} <b>Source:</b> <Link href={`${entry.source}`}>Wikipedia source</Link> <br/>
                <b>Script:</b> {entry.script.trim().substring(0, 1000)}...
              </div>
              
              )
            }): 'no history yet'}
          </div>
          </div>
        </div>
    )
}