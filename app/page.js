'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [nearestStudio, setNearestStudio] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const studioLocations = [
    { name: 'Ljubljana BTC City', address: 'Ulica gledališča BTC 12, Hala 8, 1000 Ljubljana', lat: 46.0680, lng: 14.5420, link: 'https://fitinn.si/studii/ljubljana-btc-city/' },
    { name: 'Ljubljana Šiška', address: 'Celovška cesta 280, 1000 Ljubljana', lat: 46.0769, lng: 14.4811, link: 'https://fitinn.si/studii/ljubljana-siska/' },
    { name: 'Maribor Maribox', address: 'Loška ulica 13, 2000 Maribor', lat: 46.5547, lng: 15.6466, link: 'https://fitinn.si/studii/maribor-maribox/' },
    { name: 'Maribor Tabor', address: 'Maribor', lat: 46.5625, lng: 15.6259, link: 'https://fitinn.si/studii/maribor-tabor/' },
    { name: 'Celje', address: 'Mariborska cesta 162, 3000 Celje', lat: 46.2498, lng: 15.2785, link: 'https://fitinn.si/studii/celje/' }
  ];

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const findNearestStudio = (userLat, userLng) => {
    let nearest = null;
    let minDistance = Infinity;
    studioLocations.forEach(studio => {
      const distance = calculateDistance(userLat, userLng, studio.lat, studio.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...studio, distance: distance.toFixed(1) };
      }
    });
    return nearest;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nearest = findNearestStudio(position.coords.latitude, position.coords.longitude);
          setNearestStudio(nearest);
        },
        () => {}
      );
    }
    setTimeout(() => setIsLoadingData(false), 1500);
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const renderMessageContent = (content) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let keyIndex = 0;
    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) parts.push(<span key={`text-${keyIndex++}`}>{content.substring(lastIndex, match.index)}</span>);
      parts.push(<a key={`link-${keyIndex++}`} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2">{match[1]}</a>);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) parts.push(<span key={`text-${keyIndex++}`}>{content.substring(lastIndex)}</span>);
    return parts.length > 0 ? parts : content;
  };

  const sendMessage = async (messageText) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: messageText }],
          nearestStudio: nearestStudio
        })
      });
      const data = await response.json();
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content[0].text }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oprostite, prišlo je do napake. Kontaktirajte nas na servicecenter@fitinn.si' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setShowWelcome(false);
    const msg = input;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    await sendMessage(msg);
  };

  const handleQuickQuestion = (q) => {
    setShowWelcome(false);
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    sendMessage(q);
  };

  const quickQuestions = [
    { text: 'Odpiralni čas', icon: '⏰' },
    { text: 'Članarine', icon: '💰' },
    { text: 'Lokacije', icon: '📍' },
    { text: 'Spletna prijava', icon: '💻' },
    { text: 'Najbližji studio', icon: '🗺️' },
    { text: 'Oprema', icon: '🏋️' }
  ];

  const locations = [
    { name: 'Ljubljana BTC', address: 'Hala 8, Šmartinska 152' },
    { name: 'Ljubljana Šiška', address: 'Celovška cesta 280' },
    { name: 'Maribor Maribox', address: 'Loška ulica 13' },
    { name: 'Maribor Tabor', address: 'Maribor' },
    { name: 'Celje', address: 'Mariborska cesta 162' }
  ];

  const logoBase64 = "data:image/webp;base64,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";

  const FitinnLogo = ({ size = "normal" }) => {
    const height = size === "small" ? "40px" : size === "large" ? "70px" : "56px";
    return <img src={logoBase64} alt="FITINN" style={{ height, width: 'auto', objectFit: 'contain' }} />;
  };

  const FitinnLogoSmall = () => <img src={logoBase64} alt="FITINN" style={{ height: '24px', width: 'auto', objectFit: 'contain' }} />;

  return (
    <div className="min-h-screen bg-black flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 xl:w-96 flex-col bg-zinc-950 border-r border-zinc-800">
        <div className="p-6 border-b border-zinc-800">
          <div className="mb-4"><FitinnLogo /></div>
          <p className="text-zinc-400 text-sm">Težki časi so mimo.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center"><span className="text-yellow-400">⏰</span></div>
              <h3 className="text-white font-semibold">Odpiralni čas</h3>
            </div>
            <p className="text-zinc-300 text-sm">Vsak dan od <span className="text-yellow-400 font-bold">6:00</span> do <span className="text-yellow-400 font-bold">24:00</span></p>
            <p className="text-zinc-500 text-xs mt-1">Tudi vikendi in prazniki!</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center"><span className="text-yellow-400">💰</span></div>
              <h3 className="text-white font-semibold">Cenik</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Standard</span>
                <span className="text-yellow-400 font-bold">29,90 €/mes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Dnevna karta</span>
                <span className="text-zinc-300">14,90 €</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center"><span className="text-yellow-400">📍</span></div>
              <h3 className="text-white font-semibold">5x v Sloveniji</h3>
            </div>
            <div className="space-y-2">
              {locations.map((loc, i) => (
                <div key={i} className="text-sm">
                  <span className="text-zinc-300">{loc.name}</span>
                  <p className="text-zinc-500 text-xs">{loc.address}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center"><span className="text-yellow-400">✨</span></div>
              <h3 className="text-white font-semibold">Ugodnosti</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Gym80 oprema', 'Precor kardio', 'Prostor za ženske', 'Funkcionalni del', 'WiFi', 'Trenerji'].map((f, i) => (
                <span key={i} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full">{f}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <a href="https://fitinn.si/clanstvo/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105">
            <span>Postani član</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <FitinnLogo size="small" />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-300 hover:text-yellow-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="mt-4 space-y-3 animate-slideDown">
              <div className="bg-zinc-900 rounded-xl p-3 flex items-center justify-between">
                <span className="text-zinc-400 text-sm">⏰ Odpiralni čas</span>
                <span className="text-yellow-400 font-bold text-sm">6:00 - 24:00</span>
              </div>
              <div className="bg-zinc-900 rounded-xl p-3 flex items-center justify-between">
                <span className="text-zinc-400 text-sm">💰 Od</span>
                <span className="text-yellow-400 font-bold text-sm">29,90 €/mesec</span>
              </div>
              <a href="https://fitinn.si/clanstvo/" target="_blank" rel="noopener noreferrer" className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-xl text-center text-sm transition-colors">Postani član →</a>
            </div>
          )}
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-zinc-950/50 backdrop-blur-sm border-b border-zinc-800 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-white font-bold text-lg">Virtualni pomočnik</h1>
              <p className="text-zinc-500 text-sm">Vprašaj me karkoli o FITINN fitnesu</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-zinc-400 text-sm">Na voljo 24/7</span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ backgroundImage: 'radial-gradient(ellipse at top left, rgba(234, 179, 8, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(234, 179, 8, 0.03) 0%, transparent 50%)' }}>
          <div className="max-w-4xl mx-auto space-y-4 h-full">
            {showWelcome && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 lg:py-16">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 border border-zinc-700 p-3">
                  <FitinnLogo size="large" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">Pozdravljeni!</h1>
                <p className="text-zinc-400 text-center max-w-md mb-6 px-4 leading-relaxed">
                  Jaz sem FITINN virtualni asistent. Pomagam vam z informacijami o naših fitnes studiih, članarini, odpiralnem času ter z nasveti za vadbo in prehrano.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  {isLoadingData ? (
                    <><div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div><span className="text-zinc-500 text-xs">Nalagam podatke...</span></>
                  ) : (
                    <><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="text-zinc-500 text-xs">Povezan s FITINN</span></>
                  )}
                </div>
                {nearestStudio && (
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 mb-6 max-w-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400">📍</span>
                      <span className="text-zinc-400 text-sm">Najbližji studio</span>
                    </div>
                    <p className="text-white font-semibold">{nearestStudio.name}</p>
                    <p className="text-zinc-400 text-sm">{nearestStudio.address}</p>
                    <p className="text-yellow-400 text-sm mt-1">{nearestStudio.distance} km od vas</p>
                    <a href={nearestStudio.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg transition-colors">Več informacij →</a>
                  </div>
                )}
                <p className="text-zinc-500 text-sm mb-4">Poskusite eno od naslednjih vprašanj:</p>
                <div className="flex flex-wrap justify-center gap-3 mb-3 px-4">
                  {quickQuestions.slice(0, 3).map((q, i) => (
                    <button key={i} onClick={() => handleQuickQuestion(q.text)} className="px-5 py-2.5 bg-transparent hover:bg-zinc-800 border border-zinc-600 hover:border-yellow-500/50 text-zinc-200 hover:text-yellow-400 text-sm font-medium rounded-full transition-all duration-200">{q.text}</button>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-3 px-4">
                  {quickQuestions.slice(3).map((q, i) => (
                    <button key={i} onClick={() => handleQuickQuestion(q.text)} className="px-5 py-2.5 bg-transparent hover:bg-zinc-800 border border-zinc-600 hover:border-yellow-500/50 text-zinc-200 hover:text-yellow-400 text-sm font-medium rounded-full transition-all duration-200">{q.text}</button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`} style={{ animationDelay: `${index * 0.05}s` }}>
                    {message.role === 'assistant' && (
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-zinc-800 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 border border-zinc-700 p-2">
                        <FitinnLogoSmall />
                      </div>
                    )}
                    <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl ${message.role === 'user' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-black font-medium rounded-br-md shadow-lg shadow-yellow-500/20' : 'bg-zinc-800/80 text-zinc-100 rounded-bl-md border border-zinc-700/50 backdrop-blur-sm'}`}>
                      <p className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap">{renderMessageContent(message.content)}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-500 rounded-xl flex items-center justify-center ml-3 flex-shrink-0">
                        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-slideIn">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-zinc-800 rounded-xl flex items-center justify-center mr-3 border border-zinc-700 p-2"><FitinnLogoSmall /></div>
                    <div className="bg-zinc-800/80 border border-zinc-700/50 px-4 py-3 rounded-2xl rounded-bl-md backdrop-blur-sm">
                      <div className="flex space-x-2">
                        <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Quick Questions - only show when not on welcome screen */}
        {!showWelcome && (
          <div className="bg-zinc-950/80 backdrop-blur-sm border-t border-zinc-800 px-4 py-3">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {quickQuestions.map((q, i) => (
                  <button key={i} onClick={() => handleQuickQuestion(q.text)} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-500/50 text-zinc-300 hover:text-yellow-400 text-sm font-medium rounded-xl transition-all duration-200">
                    <span>{q.icon}</span>
                    <span>{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-zinc-950 border-t border-zinc-800 p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Vprašaj me karkoli o FITINN..."
              className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 rounded-xl px-4 py-3 lg:py-4 text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-200 text-sm lg:text-base"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 disabled:from-zinc-700 disabled:to-zinc-700 text-black disabled:text-zinc-500 font-bold px-5 lg:px-8 py-3 lg:py-4 rounded-xl transition-all duration-200 shadow-lg shadow-yellow-500/30 disabled:shadow-none hover:shadow-yellow-500/50 hover:scale-105 disabled:hover:scale-100 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
