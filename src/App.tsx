import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Logo } from "./components/Logo";
import "./App.css";

function App() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const sessionId = generateSessionId();

    try {
      const response = await fetch(
        `https://n8n.verticalhamburg.de/webhook-test/2648c4ad-1296-40a3-975d-25664ea7d865?text=${encodeURIComponent(
          inputValue
        )}&sessionId=${sessionId}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResultUrl(data.resultUrl); // n8n sollte die URL in der Antwort zurückgeben
      setIsRunning(true);
      setTimeLeft(180); // 3 Minuten
    } catch (error) {
      console.error("Error:", error);
      alert("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isRunning && timeLeft !== null) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time === null || time <= 0) {
            clearInterval(interval);
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <Logo className="w-64 h-auto text-white mb-12" />
          
          {!isRunning && !isComplete ? (
            <>
              <h2 className="text-white text-3xl font-bold font-montserrat mb-8 text-center whitespace-nowrap">
                Von der Idee zum Pitch-Deck in 3 Minuten
              </h2>

              <p className="text-white text-lg font-montserrat mb-8 text-center">
                Gib hier deine Geschäftsidee ein, ein Satz genügt. Du kannst aber auch etwas ausführlicher beschreiben, was Du vor hast – wie Du magst.
              </p>
              
              <div className="w-full space-y-4">
                <Input 
                  name="business-idea"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/30 focus-visible:border-white/30 text-center"
                  placeholder="Deine Geschäftsidee..."
                />
                
                <Button 
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting || !inputValue.trim()}
                  className="w-full bg-white text-pink-600 hover:bg-white/90 transition-colors"
                >
                  {isSubmitting ? 'Wird gesendet...' : 'Los geht\'s!'}
                </Button>
              </div>
            </>
          ) : isComplete ? (
            <div className="w-full text-center space-y-4">
              <p className="text-white text-4xl font-bold font-montserrat">
                Fertig!
              </p>
              <p className="text-white text-lg font-montserrat">
                Dein Pitch-Deck wurde erstellt
              </p>
              {resultUrl && (
                <Button 
                  onClick={() => window.open(resultUrl, '_blank')}
                  className="inline-block mt-4 px-6 py-3 bg-white text-pink-600 hover:bg-white/90 transition-colors font-montserrat flex justify-center items-center max-w-[300px] mx-auto"
                >
                  Hier geht's zum Ergebnis
                </Button>
              )}
            </div>
          ) : (
            <div className="w-full text-center space-y-4">
              <p className="text-white text-4xl font-bold font-montserrat">
                {formatTime(timeLeft!)}
              </p>
              <p className="text-white text-lg font-montserrat">
                Bitte warte einen Moment, dein Pitch-Deck wird erstellt
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 