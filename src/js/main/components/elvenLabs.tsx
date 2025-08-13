import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { saveBase64File } from '../utils'


export const ElvenLabs = () => {

    const [voices, setVoices] = useState<any[]>([])
    const [text, setText] = useState<string>("")
    const [voiceId, setVoiceId] = useState<string>("")
    const [resAudio, setResAudio] = useState<string>()
    

    const fetchVoices = async () => {
        try {
            const { data } = await axios.get("https://api.elevenlabs.io/v1/voices")
            setVoices(data.voices || [])
        }
        catch (err: any) {
            alert(err.message);
        }
    }

    useEffect(() => {
        fetchVoices();
    }, []);

    const sendVoice = async () => {
        try {
            const data = { text: text, modelId: 'eleven_multilingual_v2', voiceId: voiceId }
            // const response = await axios.post('http://localhost:8080/BREETH-CORE/pp/prompt-to-voice', data)
            const savedPath = saveBase64File(
                // response.data.data, 'generated_audio', 'audio'
            );
            // alert(savedPath)
            // setResAudio(response.data.data)
        }
        catch (err: any) {
            alert(err.message);
        }
    }

    return (
        <>
            <div className='p-3'>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-white">Your message</label>
                <textarea id="message" onChange={(event) => setText(event.target.value)} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-white mt-3">Seelct Model</label>
                <select id="countries" onChange={(event) => setVoiceId(event.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    {
                        voices.map((voice) => (
                            <option value={voice.voice_id}>{voice.name}</option>
                        ))
                    }
                </select>
                <button type="button" onClick={sendVoice} className="mt-3 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">send ▶</button>
            </div>
            {resAudio &&
                <audio controls>
                    <source src={resAudio} type="audio/mp4" />
                    Your browser does not support the audio tag.
                </audio>
            }
        </>

    )
}
