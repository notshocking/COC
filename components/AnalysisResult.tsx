import React, { useEffect, useState, useRef } from 'react';
import { AnalysisResult as ResultType, Verdict } from '../types';
import { ShieldCheck, ShieldAlert, ShoppingBag, ArrowRight, Download, RefreshCw, Trophy, Skull } from 'lucide-react';
import Button from './Button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PRODUCT_CATALOG } from '../data/products';
import html2canvas from 'html2canvas';

interface AnalysisResultProps {
  result: ResultType;
  imageSrc: string | null;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, imageSrc, onReset }) => {
  const [visible, setVisible] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small delay for entrance animation
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const isChad = result.verdict === Verdict.CHAD;
  const mainColor = isChad ? 'text-chad' : 'text-chud';
  const bgColor = isChad ? 'bg-chad' : 'bg-chud';
  const borderColor = isChad ? 'border-chad' : 'border-chud';
  const glowShadow = isChad ? 'shadow-[0_0_50px_-12px_rgba(255,215,0,0.5)]' : 'shadow-[0_0_50px_-12px_rgba(139,69,19,0.5)]';

  const chartData = [
    { name: 'Score', value: result.score },
    { name: 'Remaining', value: 100 - result.score },
  ];
  
  const chartColors = isChad ? ['#FFD700', '#333'] : ['#8B4513', '#333'];

  const getProductLink = (term: string) => {
    // Check if we have a specific link in the catalog
    const catalogItem = PRODUCT_CATALOG.find(p => p.name === term);
    if (catalogItem?.link) {
      return catalogItem.link;
    }
    // Fallback to Amazon search
    return `https://www.amazon.com/s?k=${encodeURIComponent(term)}`;
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsGeneratingCard(true);

    try {
      // Small delay to ensure any images in the hidden div are ready (though base64 should be instant)
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#050505',
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      const filename = `ChadOrChud-${result.verdict}-${Date.now()}.png`;
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Failed to generate card:", error);
      alert("Could not generate player card. Please try again.");
    } finally {
      setIsGeneratingCard(false);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Header Badge */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className={`
          relative px-6 py-3 sm:px-8 sm:py-4 rounded-full border-4 ${borderColor} ${bgColor}/10 backdrop-blur-md
          flex items-center gap-3 sm:gap-4 ${glowShadow} transform hover:scale-105 transition-transform duration-300
        `}>
          {isChad ? (
            <Trophy className={`w-8 h-8 sm:w-10 sm:h-10 ${mainColor}`} />
          ) : (
            <Skull className={`w-8 h-8 sm:w-10 sm:h-10 ${mainColor}`} />
          )}
          <h1 className={`text-4xl sm:text-5xl font-black uppercase tracking-tighter ${mainColor} drop-shadow-md`}>
            {result.verdict}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Left Column: Stats & Explanation */}
        <div className="space-y-6">
          <div className="bg-card border border-gray-800 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              {isChad ? <ShieldCheck className="w-24 h-24 sm:w-32 sm:h-32" /> : <ShieldAlert className="w-24 h-24 sm:w-32 sm:h-32" />}
            </div>
            
            {/* User Photo */}
            {imageSrc && (
              <div className={`
                relative w-full aspect-[4/3] mb-6 rounded-xl overflow-hidden border-2 
                ${isChad ? 'border-chad/30 shadow-[0_0_20px_rgba(255,215,0,0.1)]' : 'border-chud/30'}
                group bg-black
              `}>
                 <img 
                   src={imageSrc} 
                   alt="Subject" 
                   className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                 
                 {/* Badge Overlay */}
                 <div className="absolute bottom-3 left-3 z-10">
                   <span className={`text-xs font-mono font-bold px-2 py-1 rounded bg-black/80 border ${borderColor} ${mainColor}`}>
                     SUBJECT: {result.verdict}
                   </span>
                 </div>

                 {/* Score Overlay - Top Right */}
                 <div className="absolute top-3 right-3 flex flex-col items-end z-10">
                   <span className={`text-6xl sm:text-7xl font-black ${mainColor} drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-none`}>
                     {result.score}
                   </span>
                 </div>
              </div>
            )}
            
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 relative z-10">{result.title}</h2>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <span className={`text-xs sm:text-sm font-mono px-2 py-0.5 rounded ${bgColor} text-black font-bold`}>
                CONFIDENCE: 99.9%
              </span>
            </div>

            <div className="space-y-3 mb-6 relative z-10">
              {result.explanation.map((line, idx) => (
                <div key={idx} className="flex items-start gap-3">
                   <div className={`mt-2 w-2 h-2 shrink-0 rounded-full ${bgColor}`} />
                   <p className="text-gray-300 text-base sm:text-lg leading-snug">{line}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 relative z-10">
              <h3 className="text-sm uppercase tracking-widest text-gray-500 font-semibold">Key Observations</h3>
              <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-2">
                {result.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm sm:text-base leading-tight">
                    <span className={`mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full ${bgColor}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Score Chart */}
          <div className="hidden sm:flex bg-card border border-gray-800 rounded-2xl p-4 sm:p-6 items-center justify-between">
            <div>
              <h3 className="text-gray-400 text-xs sm:text-sm uppercase">Overall Analysis</h3>
              <p className={`text-5xl sm:text-6xl font-black ${mainColor}`}>{result.score}<span className="text-xl sm:text-2xl text-gray-600">/100</span></p>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={40}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Looksmaxxing Kit */}
        <div className="bg-card border border-gray-800 rounded-2xl p-4 sm:p-6 flex flex-col h-full">
           <div className="flex items-center gap-3 mb-6">
             <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-neon" />
             <h2 className="text-lg sm:text-xl font-bold text-white">Your Looksmaxxing Kit</h2>
           </div>
           
           <div className="space-y-4 flex-grow">
             {result.improvements.map((item, idx) => (
               <a 
                key={idx}
                href={getProductLink(item.productSearchTerm)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-gray-600 rounded-xl p-3 sm:p-4 transition-all duration-200"
               >
                 <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border border-gray-700 px-2 py-0.5 rounded-md">
                     {item.category}
                   </span>
                   <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 group-hover:text-neon transition-colors" />
                 </div>
                 <h4 className="font-bold text-white mb-1 text-sm sm:text-base group-hover:text-neon transition-colors">
                   {item.productSearchTerm}
                 </h4>
                 <p className="text-xs sm:text-sm text-gray-400">
                   {item.suggestion}
                 </p>
               </a>
             ))}
           </div>

           <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-xs text-center text-gray-600 mb-4">
                *Products linked are AI suggested searches based on your analysis.
              </p>
           </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
        <Button variant="secondary" onClick={onReset} className="w-full sm:w-auto order-2 sm:order-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Upload Another
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDownloadCard} 
          className="w-full sm:w-auto order-1 sm:order-2"
          isLoading={isGeneratingCard}
        >
          <Download className="w-4 h-4 mr-2" />
          Save Chud Card
        </Button>
      </div>

      {/* 
        HIDDEN RENDER AREA FOR CHUD CARD 
        This is rendered off-screen (absolute -left-9999px) to generate the PNG 
      */}
      <div 
        ref={cardRef} 
        className="absolute -left-[9999px] top-0 w-[600px] bg-[#050505] p-8 rounded-3xl border-4 flex flex-col overflow-hidden"
        style={{ borderColor: isChad ? '#FFD700' : '#8B4513' }}
      >
        {/* Card Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${bgColor}/20`}>
                {isChad ? <Trophy className={`w-8 h-8 ${mainColor}`} /> : <Skull className={`w-8 h-8 ${mainColor}`} />}
             </div>
             <div>
                <div className="text-gray-400 text-xs font-bold tracking-widest uppercase">ChadOrChud</div>
                <div className="text-white font-black text-xl tracking-tighter italic">OFFICIAL RATING</div>
             </div>
          </div>
          {/* Centered Rating Badge */}
          <div className={`px-8 py-2 rounded-full border-2 ${borderColor} ${bgColor}/10 flex items-center justify-center min-w-[140px]`}>
            <span className={`text-3xl font-black uppercase ${mainColor} leading-none pb-1`}>{result.verdict}</span>
          </div>
        </div>

        {/* Card Main Image */}
        {imageSrc && (
          <div className={`
            relative w-full aspect-[4/3] mb-6 rounded-2xl overflow-hidden border-2 
            ${isChad ? 'border-chad/50' : 'border-chud/50'}
          `}>
            <img src={imageSrc} className="w-full h-full object-cover" alt="Subject" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Overlay Stats */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div>
                 <h2 className="text-3xl font-black text-white leading-none drop-shadow-lg max-w-[300px]">{result.title}</h2>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Score</span>
                {/* Centered Score */}
                <div className={`
                  w-24 h-24 rounded-full bg-black/80 backdrop-blur border-4 ${borderColor} 
                  flex items-center justify-center
                `}>
                  <span className={`text-5xl font-black ${mainColor} leading-none pb-1`}>{result.score}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card Details */}
        <div className="bg-[#111] rounded-xl p-5 border border-white/10 mb-4">
           <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Analysis Summary</h3>
           <div className="space-y-2">
              {result.explanation.map((line, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full ${bgColor}`} />
                  <p className="text-gray-300 text-sm font-medium leading-snug">{line}</p>
                </div>
              ))}
           </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-white/5">
           <div className="text-[10px] text-gray-600">ID: {Date.now().toString().slice(-8)}</div>
           <div className="text-[10px] text-gray-600 font-mono">GENERATED BY CHADORCHUD.COM</div>
        </div>
      </div>

    </div>
  );
};

export default AnalysisResult;