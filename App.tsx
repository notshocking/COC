import React, { useReducer, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { AppState, AppAction } from './types';
import { analyzeImage } from './services/geminiService';
import { APP_NAME } from './constants';
import { BrainCircuit } from 'lucide-react';

const initialState: AppState = { status: 'IDLE' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_ANALYSIS':
      return { status: 'ANALYZING', imageSrc: action.imageSrc };
    case 'ANALYSIS_SUCCESS':
      if (state.status !== 'ANALYZING') return state;
      return { status: 'RESULT', imageSrc: state.imageSrc, result: action.result };
    case 'ANALYSIS_ERROR':
      return {
        status: 'ERROR',
        imageSrc: state.status === 'ANALYZING' ? state.imageSrc : null,
        error: action.error,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const handleFileSelect = useCallback(async (base64: string, mimeType: string) => {
    const imageSrc = `data:${mimeType};base64,${base64}`;
    dispatch({ type: 'START_ANALYSIS', imageSrc });

    try {
      const result = await analyzeImage(base64, mimeType);
      dispatch({ type: 'ANALYSIS_SUCCESS', result });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong. The AI might be overwhelmed by your aura.';
      dispatch({ type: 'ANALYSIS_ERROR', error: errorMessage });
    }
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-neon/30">
        {/* Navbar */}
        <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleReset}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleReset()}
            >
              <BrainCircuit className="w-6 h-6 sm:w-8 sm:h-8 text-neon" />
              <span className="text-lg sm:text-xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {APP_NAME}
              </span>
            </div>
            <div className="text-[10px] sm:text-xs font-mono text-gray-500 hidden sm:block">
              V2.5.0 // GEMINI POWERED
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-[-20%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-900/20 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-900/20 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />

          <div className="w-full max-w-5xl z-10">
            {state.status === 'IDLE' && (
              <div className="text-center space-y-8 sm:space-y-12 animate-in fade-in zoom-in duration-500">
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="flex flex-wrap items-center justify-center gap-4 text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-tight pb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)] py-2 px-4">
                      CHAD
                    </span>
                    <span className="text-white text-xl sm:text-3xl font-light tracking-widest opacity-60">
                      OR
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-500 to-stone-700 drop-shadow-[0_0_15px_rgba(120,113,108,0.3)] py-2 px-4">
                      CHUD
                    </span>
                  </h1>
                  <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto px-2 leading-relaxed">
                    Let AI judge your physiognomy. Will you mog the competition or is it over for
                    you? Upload a photo for a brutally honest assessment.
                  </p>
                </div>

                <FileUpload onFileSelect={handleFileSelect} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left max-w-3xl mx-auto pt-4 sm:pt-8">
                  {[
                    {
                      title: 'Physiognomy Analysis',
                      desc: 'Precise evaluation of facial harmony, grooming standards, and genetic potential.',
                    },
                    {
                      title: 'Looksmaxxing Protocol',
                      desc: 'Curated, high-impact product recommendations to fix flaws and maximize your stats.',
                    },
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <h3 className="font-bold text-white mb-1 sm:mb-2 text-sm sm:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {state.status === 'ANALYZING' && <LoadingScreen />}

            {state.status === 'ERROR' && (
              <div className="text-center max-w-md mx-auto">
                <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl mb-6">
                  <h2 className="text-xl font-bold text-red-500 mb-2">Analysis Failed</h2>
                  <p className="text-gray-300">{state.error}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {state.status === 'RESULT' && (
              <AnalysisResult
                result={state.result}
                imageSrc={state.imageSrc}
                onReset={handleReset}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-4 sm:py-6 border-t border-white/10 bg-black text-center">
          <p className="text-gray-600 text-xs sm:text-sm px-4">
            ChadOrChud &copy; {new Date().getFullYear()}. Results generated by AI for
            entertainment.
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
