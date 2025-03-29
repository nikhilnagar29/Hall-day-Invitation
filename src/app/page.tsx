// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock
} from 'react-icons/fa';

import diddy from './diddy.webp';
import bgimg from './bgimg.webp';

const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center text-yellow-400">
      Loading map...
    </div>
  ),
});

export default function HallDayInvitation() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPartyStarted, setIsPartyStarted] = useState(false);

  const partyDetails = {
    date: '29 March',
    time: '8:00 PM',
    location: 'Room C-248',
    hosts: [
      { name: 'Nikhil Nagar', image: '/nikhil.jpg' },
      { name: 'Krishnendu Polley', image: '/krishnendu.jpg' },
      { name: 'Arghyadip Mondal', image: '/arghya.jpg' },
    ],
  };

  useEffect(() => {
    const partyDate = new Date('2024-03-29T20:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = partyDate - now;

      if (distance < 0) {
        setIsPartyStarted(true);
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 w-full h-[100vh] overflow-hidden">
        <Image
          src={bgimg}
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="text-center py-20 px-4">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-48 h-48 md:w-64 md:h-64 mx-auto"
            >
              <Image
                src={diddy}
                alt="Diddy"
                fill
                className="object-cover rounded-full drop-shadow-2xl"
                sizes="(max-width: 768px) 192px, 256px"
                priority
              />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'backOut' }}
            className="text-6xl md:text-8xl font-bold text-yellow-400 mb-8 drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]"
            style={{ fontFamily: "'Bangers', cursive" }}
          >
            It&apos;s RP Day!
          </motion.h1>

          {!isPartyStarted ? (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {Object.entries(timeLeft).map(([key, value], idx) => (
                <motion.div
                  key={key}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.15, duration: 0.8 }}
                  className="bg-black/40 backdrop-blur-md p-6 rounded-2xl min-w-[140px] border-2 border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                >
                  <motion.div
                    key={value}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl text-yellow-400 font-bold"
                  >
                    {value}
                  </motion.div>
                  <div className="text-white text-xl mt-2">{key.toUpperCase()}</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: [1, 1.05, 1],
                backgroundColor: [
                  'rgba(0,0,0,0.4)',
                  'rgba(250,204,21,0.2)',
                  'rgba(0,0,0,0.4)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl text-yellow-400 font-bold mb-8 bg-black/40 backdrop-blur-md p-8 rounded-2xl border-2 border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.4)]"
            >
              🎉 Daddy&apos;s Home! Do join us! 🎉
            </motion.div>
          )}
        </section>

        {/* Event Details */}
        <section className="container mx-auto px-4 py-12 mb-16">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-purple-400/30 relative overflow-hidden"
          >
            {/* Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-yellow-400/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-radial from-purple-600/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <motion.h2
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-5xl text-yellow-400 text-center mb-8"
              style={{ fontFamily: "'Bangers', bold" }}
            >
              🎊 EVENT DETAILS 🎊
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              {/* Text Info */}
              <div className="space-y-6 mb-8">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
                >
                  <div className="text-2xl text-white space-y-4">
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt size={24} color="#FCD34D" />
                      <span>Date: {partyDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaClock size={24} color="#FCD34D" />
                      <span>Time: {partyDetails.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt size={24} color="#FCD34D" />
                      <span>Location: {partyDetails.location}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="text-white text-xl bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
                >
                  Come hungry, leave happy. 🎂🎶
                  <br />
                  Dress code: Be your awesome self! 🕺✨
                </motion.div>

                {/* Hosts Section */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
                >
                  <h3 className="text-2xl text-yellow-400 mb-6 text-center">Your Hosts</h3>
                  <div className="flex flex-wrap justify-center gap-8">
                    {partyDetails.hosts.map((host, idx) => (
                      <motion.div
                        key={host.name}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1 + idx * 0.2, duration: 0.6 }}
                        className="text-2xl md:text-3xl font-bold text-white hover:text-yellow-400 transition-colors"
                        style={{ fontFamily: "'Bangers', cursive" }}
                      >
                        {host.name}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Map Section */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="w-full h-80 md:h-full rounded-2xl overflow-hidden"
              >
                <MapComponent partyLat={22.321989} partyLng={87.307446} />
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
