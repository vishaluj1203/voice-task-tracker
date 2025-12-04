import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

const VoiceInput = ({ onTranscript }) => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognitionInstance.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setIsListening(false);
            setIsProcessing(true);
            // Simulate processing delay for better UX
            setTimeout(() => {
                onTranscript(transcript);
                setIsProcessing(false);
            }, 500);
        };

        recognitionInstance.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
            setIsProcessing(false);
            if (event.error === 'not-allowed') {
                setError('Microphone access denied.');
            } else if (event.error === 'no-speech') {
                setError('No speech detected.');
            } else {
                setError('Error occurred. Try again.');
            }
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognitionInstance;
    }, [onTranscript]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        return (
            <button className="p-4 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed" title="Voice input not supported">
                <MicOff size={24} />
            </button>
        );
    }

    return (
        <div className="relative">
            {error && (
                <div className="absolute bottom-full mb-2 right-0 w-48 bg-red-500 text-white text-xs p-2 rounded shadow-lg animate-fade-in">
                    {error}
                </div>
            )}
            <button
                onClick={toggleListening}
                disabled={isProcessing}
                className={`p-4 rounded-full transition-all shadow-xl transform hover:scale-105 active:scale-95 ${isListening
                    ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                    : isProcessing
                        ? 'bg-indigo-400 text-white cursor-wait'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                title={isListening ? "Stop recording" : "Start voice input"}
            >
                {isProcessing ? (
                    <Loader2 size={24} className="animate-spin" />
                ) : isListening ? (
                    <MicOff size={24} />
                ) : (
                    <Mic size={24} />
                )}
            </button>
        </div>
    );
};

export default VoiceInput;
