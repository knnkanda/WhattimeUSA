import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

// アンビエントアニメーション用のキーフレームスタイル
const keyframes = `
  @keyframes float1 {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(10px, 15px) scale(1.1); }
    100% { transform: translate(-10px, -5px) scale(0.9); }
  }
  @keyframes float2 {
    0% { transform: translate(0, 0) scale(0.9); }
    50% { transform: translate(-15px, 10px) scale(1); }
    100% { transform: translate(15px, -10px) scale(1.1); }
  }
  @keyframes float3 {
    0% { transform: translate(0, 0) scale(1.1); }
    50% { transform: translate(15px, -15px) scale(0.9); }
    100% { transform: translate(-15px, 15px) scale(1); }
  }
`;

const TimeConverter = () => {
  const [japanTime, setJapanTime] = useState('');
  const [newYorkTime, setNewYorkTime] = useState('');
  const [losAngelesTime, setLosAngelesTime] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [timeObject, setTimeObject] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // ウィンドウサイズの監視
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // スタイルタグを追加
    const styleTag = document.createElement('style');
    styleTag.innerHTML = keyframes;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // 全角数字を半角に変換する関数
  const toHalfWidth = (str) => {
    return str.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    // 全角数字を半角に変換
    const halfWidthValue = toHalfWidth(value);
    
    if (halfWidthValue === '' || (halfWidthValue.length <= 4 && /^\d*$/.test(halfWidthValue))) {
      setJapanTime(halfWidthValue);
    }
  };
  
  // Get current Japan time
  const setCurrentJapanTime = () => {
    const now = new Date();
    
    // 日本時間のオフセット（+9時間）
    const jpTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    
    // 日本時間を24時間形式で4桁にフォーマット
    const hours = jpTime.getUTCHours().toString().padStart(2, '0');
    const minutes = jpTime.getUTCMinutes().toString().padStart(2, '0');
    
    setJapanTime(hours + minutes);
  };

  // Convert time when input changes
  useEffect(() => {
    if (japanTime.length === 4) {
      const hours = parseInt(japanTime.substring(0, 2));
      const minutes = parseInt(japanTime.substring(2, 4));
      
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        // Create date object with current date but specified time in JST
        const now = new Date();
        const jstDate = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          hours - 9, // Convert JST to UTC
          minutes
        ));
        
        setTimeObject(jstDate);
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } else if (japanTime.length > 0) {
      setIsValid(false);
    }
  }, [japanTime]);

  // Format and set target times when timeObject changes
  useEffect(() => {
    if (timeObject && isValid) {
      // サマータイム情報を含めたフォーマット設定
      const nyOptions = { 
        timeZone: 'America/New_York',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'  // タイムゾーン略称を追加 (EST/EDT)
      };
      
      const laOptions = { 
        timeZone: 'America/Los_Angeles',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'  // タイムゾーン略称を追加 (PST/PDT)
      };
      
      setNewYorkTime(timeObject.toLocaleTimeString('en-US', nyOptions));
      setLosAngelesTime(timeObject.toLocaleTimeString('en-US', laOptions));
    } else {
      setNewYorkTime('');
      setLosAngelesTime('');
    }
  }, [timeObject, isValid]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* 大きな背景の円たち */}
        <div className="absolute rounded-full bg-white opacity-10" 
             style={{
               width: '500px', 
               height: '500px', 
               left: '10%', 
               top: '20%', 
               filter: 'blur(80px)',
               animation: 'float1 25s ease-in-out infinite alternate'
             }} />
        <div className="absolute rounded-full bg-white opacity-15" 
             style={{
               width: '400px', 
               height: '400px', 
               right: '5%', 
               top: '10%', 
               filter: 'blur(70px)',
               animation: 'float2 30s ease-in-out infinite alternate'
             }} />
        <div className="absolute rounded-full bg-white opacity-10" 
             style={{
               width: '600px', 
               height: '600px', 
               left: '30%', 
               bottom: '10%', 
               filter: 'blur(90px)',
               animation: 'float3 35s ease-in-out infinite alternate'
             }} />
        <div className="absolute rounded-full bg-white opacity-10" 
             style={{
               width: '350px', 
               height: '350px', 
               right: '15%', 
               bottom: '20%', 
               filter: 'blur(70px)',
               animation: 'float1 28s ease-in-out 2s infinite alternate-reverse'
             }} />
      </div>
      <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden z-10 border border-white border-opacity-30 mx-auto">
        <div className="p-8 text-white">
          <div className="flex justify-center items-center mb-6">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white mr-2" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">アメリカでは何時？</h1>
          </div>
          
          <div className="mb-8">
            <label className="block text-white text-xs sm:text-sm font-medium mb-2">
              日本時間を半角数字４桁（24時間表記）でタイプしてください
            </label>
            <div className="relative">
              <input
                type="text"
                value={japanTime}
                onChange={handleInputChange}
                placeholder="例: 1430"
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${
                  isValid ? 'border-white border-opacity-50 focus:border-white' : 'border-red-300'
                } focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-base sm:text-lg font-medium transition duration-150 bg-white bg-opacity-10 backdrop-blur-sm text-white placeholder-white placeholder-opacity-70`}
              />
              {!isValid && japanTime.length > 0 && (
                <p className="text-red-200 text-xs mt-1">
                  有効な時刻を入力してください (0000-2359)
                </p>
              )}
            </div>
            </div>
            
            {/* 現在時刻ボタン */}
            <button 
              onClick={setCurrentJapanTime}
              className="mt-3 flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg border border-white border-opacity-30 text-white transition-all duration-200 text-sm sm:text-base"
            >
              <div className="mr-2 w-5 h-5 relative">
                <div className="absolute inset-0 bg-white rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                </div>
              </div>
              現在時刻
            </button>
          </div>
          
                      <div className="p-3">
              <div className="text-xs text-white text-opacity-80 text-center mb-1 mt-2 sm:mt-0">
                サマータイム対応
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TimeDisplay 
              city="ロサンゼルス" 
              time={losAngelesTime} 
              emoji="🌴" 
              color="bg-fuchsia-500 bg-opacity-60"
              isValid={isValid && japanTime.length === 4}
            />
            <TimeDisplay 
              city="ニューヨーク" 
              time={newYorkTime} 
              emoji="🗽" 
              color="bg-purple-500 bg-opacity-60"
              isValid={isValid && japanTime.length === 4}
            />
          </div>
        </div>
        

      </div>
    </div>
  );
};

// Component for displaying time for a city
const TimeDisplay = ({ city, time, emoji, color, isValid }) => {
  return (
    <div className={`rounded-lg overflow-hidden ${isValid ? 'opacity-100' : 'opacity-50'}`}>
      <div className={`${color} px-3 py-2 text-white font-medium flex items-center justify-center sm:justify-start`}>
        <span className="mr-1">{emoji}</span> {city}
      </div>
      <div className="bg-white bg-opacity-10 backdrop-blur-sm px-3 py-3 text-center">
        <span className="text-base sm:text-xl font-bold text-white">
          {isValid && time ? time : '--:-- --'}
        </span>
      </div>
    </div>
  );
};

export default TimeConverter;
