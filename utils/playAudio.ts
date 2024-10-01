interface playAudioProps {
  audioBuffer: { data: Uint8Array };
}

//let TRANSATION_DELAY = 60;
let ttsAudio: HTMLAudioElement;

async function playAudio({ audioBuffer }: playAudioProps) {
  if (ttsAudio) {
    ttsAudio.pause();
  }

  const arrayBuffer = Uint8Array.from(audioBuffer.data).buffer;
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" }); // Tipo de archivo -> 'audio/mpeg'
  const url = URL.createObjectURL(blob);
  ttsAudio = new Audio(url);

  ttsAudio.onended = () => {
    // Aqui va la lógica para cuando finalice el  (opcional)
  };

  ttsAudio.play();
}

export default playAudio;
