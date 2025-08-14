import { useEffect, useState } from 'react';
import axios from 'axios';
import { Mic, Play, CheckCircle, ChevronDown } from 'lucide-react';
import { BRAND_COLORS, UI_COLORS } from '../utils/colors';
import { Button, GradientIcon } from './common';

import { saveBase64File } from '../utils'


export const ServiceModel = () => {
    const [voices, setVoices] = useState<any[]>([]);
    const [text, setText] = useState<string>("");
    const [voiceId, setVoiceId] = useState<string>("");
    const [resAudio, setResAudio] = useState<string>();

    const fetchVoices = async () => {
        try {
            const { data } = await axios.get("https://api.elevenlabs.io/v1/voices");
            setVoices(data.voices || []);
        } catch (err: any) {
            console.error('Error fetching voices:', err);
        }
    };

    useEffect(() => {
        fetchVoices();
    }, []);

    const sendVoice = async () => {
        try {
            const requestData = { text, modelId: 'eleven_multilingual_v2', voiceId };
            // const response = await axios.post('http://localhost:8080/BREETH-CORE/pp/prompt-to-voice', requestData)
            const savedPath = saveBase64File(
                // response.data.data, 'generated_audio', 'audio'
            );
            // alert(savedPath)
            // setResAudio(response.data.data)
        } catch (err: any) {
            console.error('Error sending voice:', err);
        }
    };

    return (
        <div className="my-4">
            <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                    Message
                </label>
                <textarea 
                    id="message" 
                    value={text}
                    onChange={(event) => setText(event.target.value)} 
                    className="w-full p-4 text-sm text-white bg-black/40 rounded-xl border border-white/20 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 backdrop-blur-sm placeholder:text-gray-500 transition-all duration-200 resize-none" 
                    placeholder="Enter your text to convert to speech..."
                    rows={3}
                />
            </div>
            
            <div className="my-4">
                <label htmlFor="voice-select" className="block text-sm font-semibold text-white mb-2">
                    Voice Model
                </label>
                <div className="relative">
					<select 
                        id="voice-select" 
                        value={voiceId}
                        onChange={(event) => setVoiceId(event.target.value)} 
						className="w-full appearance-none bg-black/40 border border-white/20 text-white text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 p-4 backdrop-blur-sm transition-all duration-200 cursor-pointer select-options"
                    >
						<option value="" className="bg-gray-900 text-gray-400" disabled>Choose a voice model...</option>
                        {voices.map((voice, index) => (
							<option key={index} value={voice.voice_id} className="bg-gray-900 text-white">
                                {voice.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <ChevronDown className="w-4 h-4" color={BRAND_COLORS.ACCENT} />
                    </div>
                </div>
            </div>
            
            <div className="mt-4">
                <Button 
                    type="button" 
                    onClick={sendVoice} 
                    disabled={!text || !voiceId}
                    variant="primary"
                    size="lg"
                    fullWidth
                >
                    <Mic className="w-4 h-4" color="white" />
                    <span>Generate Voice</span>
                    <Play className="w-4 h-4" color="white" />
                </Button>
            </div>
            
            {resAudio && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 mt-6">
                    <div className="flex items-center gap-3 mb-3">
                        <GradientIcon size="sm" fromColor="from-ui-success/20" toColor="to-ui-success/20" className="bg-ui-success/20">
                            <CheckCircle className="w-4 h-4" color={UI_COLORS.SUCCESS} />
                        </GradientIcon>
                        <span className="text-white font-medium text-sm">Generated Audio</span>
                    </div>
                    <audio controls className="w-full">
                        <source src={resAudio} type="audio/mp4" />
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            )}
        </div>
    )
}
