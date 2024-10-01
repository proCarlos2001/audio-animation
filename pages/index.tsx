import dynamic from 'next/dynamic';
import PaperAirplane from "@/components/icons/PaperAirplane";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";

// Cargar SoundWave solo en el cliente
const SoundWave = dynamic(() => import('@/components/avatar/SoundWave'), {
  ssr: false, // No renderizar en el servidor
});

export default function AvatarApp() {
  const { isPlaying, text, avatarSay, handleTextChange, handleSynthesis, messageData } = useSpeechSynthesis();
  let ttsAudio: HTMLAudioElement | null = null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSynthesis();
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flux justify-center items-center w-[500px] relative flex flex-col items-center">
          {messageData && (
            <SoundWave 
              audioBuffer={messageData.audioBuffer} 
              ttsAudio={ttsAudio} // <-- Pasar ttsAudio como prop
            />
          )}
          {avatarSay ? (
            <div className="absolute top-[-50px] w-[400px] bg-white p-2 rounded-lg shadow-lg text-xs text-center">
              {avatarSay}
            </div>
          ) : null}
          <h1 className="text-2xl font-bold text-center text-blue-600 mt-4">Animation with Audio, ask a question</h1>
        </div>
        <div className="h-10 relative my-4 flex justify-center">
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            className="border-2 border-gray-300 bg-gray-100 h-10 w-[600px] pl-[20px] pr-[120px] rounded-lg text-sm mb-2"
            placeholder="Write something..."
            maxLength={100}
          />
          <button
            className={`bg-blue-500 text-white font-bold py-2 px-3 rounded-r-lg absolute bottom-0 right-0 w-[50px] h-10 
            ${isPlaying ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            type="submit"
            disabled={isPlaying}
          >
            <PaperAirplane />
          </button>
        </div>
      </form>
    </div>
  );
}