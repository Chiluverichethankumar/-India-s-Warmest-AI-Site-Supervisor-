// // frontend/project/src/App.tsx
// import { useState, useRef, useEffect } from 'react';
// import { Mic, MicOff, Send, Loader2 } from 'lucide-react';

// // -------------------- Environment variable for backend API --------------------
// // Make sure you have defined VITE_API_URL in your .env file, e.g.:
// // VITE_API_URL=http://localhost:8000
// const API_URL = import.meta.env.VITE_API_URL;

// interface Message {
//   type: 'user' | 'ai'; // Message type: user or AI
//   text: string;         // Message text
//   timestamp: Date;      // Timestamp for display
// }

// function App() {
//   // -------------------- State --------------------
//   const [messages, setMessages] = useState<Message[]>([]); // All chat messages
//   const [inputText, setInputText] = useState('');          // User input
//   const [isListening, setIsListening] = useState(false);   // Mic listening state
//   const [isProcessing, setIsProcessing] = useState(false); // Waiting for AI response
//   const [sessionId, setSessionId] = useState<string | null>(null); // Session ID

//   // -------------------- Refs --------------------
//   const recognitionRef = useRef<any>(null);      // Speech recognition ref
//   const messagesEndRef = useRef<HTMLDivElement>(null); // Scroll to bottom

//   // -------------------- Speech Recognition Setup --------------------
//   useEffect(() => {
//     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//       const SpeechRecognition =
//         (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.lang = 'en-IN';
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.maxAlternatives = 1;

//       recognitionRef.current.onresult = (event: any) => {
//         const text = event.results[0][0].transcript;
//         setInputText(text); // Fill textarea with recognized text
//       };

//       recognitionRef.current.onend = () => setIsListening(false);
//       recognitionRef.current.onerror = () => setIsListening(false);
//     }
//   }, []);

//   // -------------------- Auto-scroll to bottom when messages update --------------------
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // -------------------- Toggle Microphone --------------------
//   const toggleMicrophone = () => {
//     if (!recognitionRef.current) {
//       alert('Speech recognition not supported in your browser');
//       return;
//     }
//     if (isListening) recognitionRef.current.stop();
//     else {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   // -------------------- Send Message --------------------
//   const sendMessage = async () => {
//     const text = inputText.trim();
//     if (!text || isProcessing) return;

//     // Add user message to chat
//     setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
//     setInputText('');
//     setIsProcessing(true);

//     try {
//       const res = await fetch(`${API_URL}/api/message`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ session_id: sessionId, text })
//       });

//       const data = await res.json();
//       setSessionId(data.session_id); // Save session ID for future requests

//       // Add AI response to chat
//       setMessages(prev => [...prev, { type: 'ai', text: data.text, timestamp: new Date() }]);

//       // Play audio if available (prepend backend URL)
//       if (data.audio_path) {
//         const audio = new Audio(`${API_URL}${data.audio_path}`);
//         audio.play().catch(() =>
//           console.log("Audio play blocked - user interaction required")
//         );
//       }
//     } catch (err) {
//       console.error(err);
//       setMessages(prev => [
//         ...prev,
//         {
//           type: 'ai',
//           text: 'Sorry sir, network issue ho gaya. Ek baar phir try karein.',
//           timestamp: new Date()
//         }
//       ]);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // -------------------- Handle Enter Key --------------------
//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">

//           {/* -------------------- Header -------------------- */}
//           <div className="bg-gradient-to-r from-emerald-900 via-teal-600 to-cyan-700 p-6 relative overflow-hidden">
//             <div className="absolute inset-0 opacity-30">
//               <div
//                 className="absolute inset-0"
//                 style={{
//                   backgroundImage:
//                     'url("data:image/svg+xml,%3Csvg width=\'70\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
//                 }}
//               />
//             </div>

//             <div className="relative flex items-center gap-5">
//               <div className="w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-0 border-white/50">
//                 <img
//                   src="/logo.png"
//                   alt="Riverwood Logo"
//                   className="w-full h-full object-contain rounded-xl"
//                 />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white tracking-wide">
//                   Riverwood Voice Agent
//                 </h1>
//                 <p className="text-emerald-100 text-sm font-medium">
//                   Your AI Site Supervisor • Kharkhauda Estate
//                 </p>
//               </div>
//             </div>

//             <div className="absolute top-5 right-5 bg-white/25 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
//               <div className="flex items-center gap-2">
//                 <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-white text-xs font-semibold">LIVE from Site Office</span>
//               </div>
//             </div>
//           </div>

//           {/* -------------------- Chat Area -------------------- */}
//           <div className="h-[500px] overflow-y-auto p-6 bg-gradient-to-b from-slate-50 to-white">
//             {messages.length === 0 ? (
//               <div className="h-full flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="w-24 h-24 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
//                     <Mic className="w-12 h-12 text-white" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-emerald-800 mb-2">Namaste Sir!</h3>
//                   <p className="text-emerald-600 text-lg">
//                     Riverwood speaking from Riverwood Estate
//                   </p>
//                   <p className="text-slate-600 mt-3">Bolo sir, kaisa chal raha hai?</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-5">
//                 {messages.map((msg, idx) => (
//                   <div
//                     key={idx}
//                     className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`max-w-[82%] rounded-3xl px-6 py-4 shadow-lg ${
//                         msg.type === 'user'
//                           ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
//                           : 'bg-white border-2 border-emerald-200 text-slate-800'
//                       }`}
//                     >
//                       <p className="text-base leading-relaxed font-medium">{msg.text}</p>
//                       <p
//                         className={`text-xs mt-2 font-light ${
//                           msg.type === 'user' ? 'text-emerald-100' : 'text-emerald-500'
//                         }`}
//                       >
//                         {msg.timestamp.toLocaleTimeString('en-IN', {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                           hour12: true,
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                 ))}

//                 {isProcessing && (
//                   <div className="flex justify-start">
//                     <div className="bg-white border-2 border-emerald-200 rounded-3xl px-6 py-4 shadow-lg">
//                       <div className="flex items-center gap-3">
//                         <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
//                         <span className="text-emerald-700 font-medium">
//                           Riverwood soch raha hai...
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>
//             )}
//           </div>

//           {/* -------------------- Input Bar -------------------- */}
//           <div className="p-6 bg-white border-t-4 border-emerald-500">
//             <div className="flex gap-4 items-end">
//               <button
//                 onClick={toggleMicrophone}
//                 disabled={isProcessing}
//                 className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
//                   isListening
//                     ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
//                     : 'bg-emerald-600 hover:bg-emerald-700 text-white'
//                 } disabled:opacity-50`}
//               >
//                 {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
//               </button>

//               <div className="flex-1">
//                 <textarea
//                   value={inputText}
//                   onChange={e => setInputText(e.target.value)}
//                   onKeyDown={handleKeyDown} // Use onKeyDown instead of onKeyPress
//                   placeholder="Bolo sir... ya type kariye"
//                   rows={1}
//                   disabled={isProcessing}
//                   className="w-full px-5 py-4 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none resize-none text-slate-800 placeholder-emerald-400 font-medium transition-all"
//                 />
//               </div>

//               <button
//                 onClick={sendMessage}
//                 disabled={!inputText.trim() || isProcessing}
//                 className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl flex items-center justify-center shadow-xl transition-all disabled:opacity-50"
//               >
//                 {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
//               </button>
//             </div>

//             <div className="mt-4 text-center">
//               <p className="text-xs text-emerald-600 font-semibold">
//                 <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
//                 Riverwood is online • Kharkhauda Site Office
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="text-center mt-8">
//           <p className="text-sm text-emerald-700 font-bold">
//             Powered by <span className="text-emerald-900">Riverwood Technologies</span> • Building Dreams in Haryana
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, text })
      });
      const data = await res.json();
      setSessionId(data.session_id);

      setMessages(prev => [...prev, { type: 'ai', text: data.text, timestamp: new Date() }]);

    if (data.audio_path) {
      const audioUrl = `${import.meta.env.VITE_API_URL}${data.audio_path}`;
      console.log("Playing voice:", audioUrl); // Debug
    
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      audio.play().catch(err => {
        console.error("Voice blocked:", err);
        alert("Click anywhere to enable sound!");
      });
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
      <div className="max-w-4xl mx-auto w-full px-2 py-4 sm:px-4 sm:py-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">

          {/* PREMIUM HEADER WITH LOGO */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-600 to-cyan-700 px-3 py-4 sm:p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg width=\'70\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                }}
              />
            </div>

            <div className="relative flex items-center gap-3 sm:gap-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center border-0 border-white/50">
                <img
                  src="/logo.png"
                  alt="Riverwood Logo"
                  className="w-full h-full object-contain rounded-lg sm:rounded-xl"
                />
              </div>

              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                  Riverwood Voice Agent
                </h1>
                <p className="text-emerald-100 text-xs sm:text-sm font-medium">
                  Your AI Site Supervisor • Kharkhauda Estate
                </p>
              </div>
            </div>

            <div className="absolute top-2 right-2 sm:top-5 sm:right-5 bg-white/25 backdrop-blur-md px-2 py-1 sm:px-4 sm:py-2 rounded-full border border-white/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-semibold">LIVE from Site Office</span>
              </div>
            </div>
          </div>

          {/* CHAT AREA */}
          <div className="h-[55vh] sm:h-[500px] overflow-y-auto p-2 sm:p-6 bg-gradient-to-b from-slate-50 to-white">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Mic className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">Namaste Sir!</h3>
                  <p className="text-emerald-600 text-base sm:text-lg">Riverwood speaking from Riverwood Estate</p>
                  <p className="text-slate-600 mt-3 text-sm sm:text-base">Bolo sir, kaisa chal raha hai?</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90vw] sm:max-w-[82%] rounded-xl sm:rounded-3xl px-3 py-2 sm:px-6 sm:py-4 shadow-lg ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                          : 'bg-white border-2 border-emerald-200 text-slate-800'
                      }`}
                    >
                      <p className="text-base leading-relaxed font-medium break-words">{msg.text}</p>
                      <p
                        className={`text-xs mt-2 font-light ${
                          msg.type === 'user' ? 'text-emerald-100' : 'text-emerald-500'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white border-2 border-emerald-200 rounded-xl sm:rounded-3xl px-3 py-2 sm:px-6 sm:py-4 shadow-lg">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-emerald-600" />
                        <span className="text-emerald-700 font-medium text-sm sm:text-base">
                          Riverwood soch raha hai...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* INPUT BAR */}
          <div className="px-2 py-3 sm:p-6 bg-white border-t-4 border-emerald-500">
            <div className="flex gap-2 sm:gap-4 items-end">
              <button
                onClick={toggleMicrophone}
                disabled={isProcessing}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                } disabled:opacity-50`}
              >
                {isListening ? <MicOff className="w-6 h-6 sm:w-7 sm:h-7" /> : <Mic className="w-6 h-6 sm:w-7 sm:h-7" />}
              </button>

              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Bolo sir... ya type kariye"
                  rows={1}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none resize-none text-slate-800 placeholder-emerald-400 font-medium transition-all"
                  style={{ minHeight: '44px', maxHeight: '180px' }}
                />
              </div>

              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isProcessing}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Send className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>

            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-xs sm:text-sm text-emerald-600 font-semibold">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                Riverwood is online • Kharkhauda Site Office
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-emerald-700 font-bold">
            Powered by <span className="text-emerald-900">Riverwood Technologies</span> • Building Dreams in Haryana
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
