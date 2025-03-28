// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => <p className="text-yellow-400">Loading map...</p>
});

interface Message {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
}

export default function SuperParty() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer
  useEffect(() => {
    const partyDate = new Date('2024-03-29T19:00:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = partyDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Message handling
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      
      const data = await response.json();
      if (data.success) {
        setStatus('Message sent successfully!');
        setName('');
        setMessage('');
        fetchMessages();
      } else {
        setStatus('Error sending message');
      }
    } catch (error) {
      setStatus('Failed to send message');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-blue-600 to-purple-900">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-4 overflow-hidden">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <img 
            src="/superman-logo.png" 
            alt="Superman Logo" 
            className="mx-auto w-64 h-64 animate-bounce"
          />
        </motion.div>

        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-6xl md:text-8xl font-bold text-yellow-400 mb-8 font-luckiest-guy drop-shadow-2xl"
        >
          SUPER BOY HALL DAY
        </motion.h1>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['DAYS', 'HOURS', 'MIN', 'SEC'].map((label, idx) => (
            <motion.div
              key={label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-black/80 p-4 rounded-xl min-w-[120px]"
            >
              <div className="text-4xl text-yellow-400">
                {timeLeft[label.toLowerCase() as keyof typeof timeLeft]}
              </div>
              <div className="text-white">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Event Details */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
          <h2 className="text-4xl text-yellow-400 text-center mb-8 font-bangers">
            🦸♂️ EVENT DETAILS 🦸♀️
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4 mb-8">
                <p className="text-2xl text-white">
                  📅 Date: 29 March<br />
                  🕖 Time: 7:00 PM<br />
                  🏠 Room: Super Secret Lair
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  {['User1', 'User2', 'User3'].map((user) => (
                    <motion.div
                      key={`user-${user}`}
                      whileHover={{ scale: 1.1 }}
                      className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center 
                               border-4 border-yellow-400 text-white font-bold text-center p-2"
                    >
                      {user}
                    </motion.div>
                  ))}
                </div>
              </div>

              <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl 
                               text-2xl transition-transform duration-300 hover:scale-105">
                RSVP NOW
              </button>
            </div>

            <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
              <MapComponent 
                partyLat={22.321989} 
                partyLng={87.307446} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Messages Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
          <h2 className="text-4xl text-yellow-400 text-center mb-8 font-bangers">
            🦸♂️ SUPER MESSAGES 🦸♀️
          </h2>

          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-gray-300"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Super Message"
              className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-gray-300 h-32"
              required
            />
            <button
              type="submit"
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-2xl 
                         text-xl font-bold transition-all duration-300"
            >
              SEND MESSAGE
            </button>
            {status && <p className="text-center text-yellow-400">{status}</p>}
          </form>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg._id} className="p-4 bg-black/20 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-400 font-bold">{msg.name}</span>
                  <span className="text-gray-300 text-sm">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-white">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}