// frontend/project/src/App.tsx
import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, Loader2 } from 'lucide-react';

interface Message {
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-IN';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInputText(text);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in your browser');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isProcessing) return;

    setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
    setInputText('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, text })
      });
      const data = await res.json();
      setSessionId(data.session_id);

      setMessages(prev => [...prev, { type: 'ai', text: data.text, timestamp: new Date() }]);

      if (data.audio_path) {
        const audio = new Audio(data.audio_path);
        audio.play().catch(() => console.log("Audio play blocked - user interaction required"));
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        type: 'ai',
        text: 'Sorry sir, network issue ho gaya. Ek baar phir try karein.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">

          {/* PREMIUM HEADER WITH LOGO */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-600 to-cyan-700 p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div 
                className="absolute inset-0" 
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width="70" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                }}
              />
            </div>

            <div className="relative flex items-center gap-5">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-0 border-white/50">
                <img 
                  src="/logo.png" 
                  alt="Riverwood Logo" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">
                  Riverwood Voice Agent
                </h1>
                <p className="text-emerald-100 text-sm font-medium">
                  Your AI Site Supervisor • Kharkhauda Estate
                </p>
              </div>
            </div>

            <div className="absolute top-5 right-5 bg-white/25 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-semibold">LIVE from Site Office</span>
              </div>
            </div>
          </div>

          {/* CHAT AREA */}
          <div className="h-[500px] overflow-y-auto p-6 bg-gradient-to-b from-slate-50 to-white">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-2">Namaste Sir!</h3>
                  <p className="text-emerald-600 text-lg">Riverwood speaking from Riverwood Estate</p>
                  <p className="text-slate-600 mt-3">Bolo sir, kaisa chal raha hai?</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-3xl px-6 py-4 shadow-lg ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                          : 'bg-white border-2 border-emerald-200 text-slate-800'
                      }`}
                    >
                      <p className="text-base leading-relaxed font-medium">{msg.text}</p>
                      <p className={`text-xs mt-2 font-light ${
                        msg.type === 'user' ? 'text-emerald-100' : 'text-emerald-500'
                      }`}>
                        {msg.timestamp.toLocaleTimeString('en-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white border-2 border-emerald-200 rounded-3xl px-6 py-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                        <span className="text-emerald-700 font-medium">Riverwood soch raha hai...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* INPUT BAR */}
          <div className="p-6 bg-white border-t-4 border-emerald-500">
            <div className="flex gap-4 items-end">
              <button
                onClick={toggleMicrophone}
                disabled={isProcessing}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                } disabled:opacity-50`}
              >
                {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>

              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Bolo sir... ya type kariye"
                  rows={1}
                  disabled={isProcessing}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none resize-none text-slate-800 placeholder-emerald-400 font-medium transition-all"
                />
              </div>

              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isProcessing}
                className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl flex items-center justify-center shadow-xl transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-emerald-600 font-semibold">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                Riverwood is online • Kharkhauda Site Office
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-emerald-700 font-bold">
            Powered by <span className="text-emerald-900">Riverwood Technologies</span> • Building Dreams in Haryana
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;