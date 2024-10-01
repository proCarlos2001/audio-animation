import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

interface SoundWaveProps {
  audioBuffer: { data: Uint8Array };
  ttsAudio?: HTMLAudioElement | null;
}

const SoundWave: React.FC<SoundWaveProps> = ({ audioBuffer, ttsAudio }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  let myp5: p5 | null = null;

  useEffect(() => {
    if (typeof window !== 'undefined' && audioBuffer) {
      const sketch = (p: p5) => {
        let audioContext: AudioContext;
        let analyser: AnalyserNode;
        let dataArray: Uint8Array;

        p.setup = () => {
          p.createCanvas(400, 400).parent(sketchRef.current!);
          
          audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          
          const source = audioContext.createBufferSource();
          const arrayBuffer = audioBuffer.data.buffer instanceof ArrayBuffer 
            ? audioBuffer.data.buffer 
            : new Uint8Array(audioBuffer.data).buffer;
          
          audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            source.buffer = buffer;
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            source.start(0);
          }, (error) => console.error('Error decoding audio data:', error));

          dataArray = new Uint8Array(analyser.frequencyBinCount);
        };

        p.draw = () => {
          p.background(255); // Fondo blanco
          analyser.getByteFrequencyData(dataArray);

          let energy = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length / 255;

          // Dibuja el círculo central que pulsa con la energía
          p.noFill();
          p.stroke(0, 100, 200); // Color azul
          p.strokeWeight(3);
          let size = p.map(energy, 0, 1, 50, 300);
          p.ellipse(p.width / 2, p.height / 2, size);

          // Añade un efecto de brillo
          p.noFill();
          for (let i = 0; i < 5; i++) {
            let alpha = p.map(i, 0, 5, 100, 0);
            p.stroke(0, 100, 200, alpha);
            p.strokeWeight(2 - i * 0.4);
            p.ellipse(p.width / 2, p.height / 2, size + i * 10);
          }
        };
      };

      myp5 = new p5(sketch, sketchRef.current!);

      return () => {
        if (myp5) {
          myp5.remove();
        }
      };
    }
  }, [audioBuffer]);

  return <div ref={sketchRef} />;
};

export default SoundWave;





// Implementación #1:

// import React, { useEffect, useRef } from 'react';
// import p5 from 'p5';

// interface SoundWaveProps {
//   audioBuffer: { data: Uint8Array };
//   ttsAudio?: HTMLAudioElement | null;
// }

// const SoundWave: React.FC<SoundWaveProps> = ({ audioBuffer, ttsAudio }) => {
//   const sketchRef = useRef<HTMLDivElement>(null);
//   let myp5: p5 | null = null;
//   let audioContext: AudioContext | null = null;
//   let source: AudioBufferSourceNode | null = null;
//   let analyser: AnalyserNode | null = null;

//   useEffect(() => {
//     // Verificar si estamos en un entorno de cliente
//     if (typeof window !== 'undefined' && audioBuffer) {
//       const sketch = (p: p5) => {
//         let radius: number;
//         let frequencyData: Uint8Array;

//         p.setup = () => {
//           p.createCanvas(400, 400).parent(sketchRef.current!);
//           radius = p.width / 4;

//           // Decodificar audioBuffer
//           audioContext = new AudioContext();
//           source = audioContext.createBufferSource();
//           analyser = audioContext.createAnalyser();
//           source.connect(analyser);
//           analyser.connect(audioContext.destination);

//           const arrayBuffer = audioBuffer.data.buffer instanceof ArrayBuffer ? audioBuffer.data.buffer : new Uint8Array(audioBuffer.data).buffer;

//           audioContext.decodeAudioData(arrayBuffer, (buffer) => {
//             source!.buffer = buffer;
//             frequencyData = new Uint8Array(analyser!.frequencyBinCount);
//             source!.start(0); 
//           }, (error) => {
//             console.error('Error al decodificar el audio:', error);
//           });
//         };

//         p.draw = () => {
//           p.background(255);
//           p.stroke(0, 100, 200);
//           p.strokeWeight(3);
//           p.noFill();

//           if (analyser) {
//             if (!(frequencyData instanceof Uint8Array)) {
//               frequencyData = new Uint8Array(analyser.frequencyBinCount);
//             }
//             analyser.getByteFrequencyData(frequencyData);

//             p.beginShape();
//             for (let a = 0; a < p.TWO_PI; a += 0.1) {
//               const i = Math.floor(p.map(a, 0, p.TWO_PI, 0, frequencyData.length));
//               const vol = frequencyData[i] / 255;
//               //const xoff = p.map(vol, 0, 1, 0, 100);
//               const r = radius + vol * 80;
//               const x = p.width / 2 + r * p.cos(a);
//               const y = p.height / 2 + r * p.sin(a);
//               p.vertex(x, y);
//             }
//             p.endShape(p.CLOSE);

//             // Sincronización con ttsAudio
//             if (ttsAudio) {
//               const currentTime = ttsAudio.currentTime;
//               if (currentTime > 0 && source && audioContext && analyser) {
//                 if (audioContext.state !== 'running') {
//                   source.start(0, currentTime);
//                 }
//               }
//             }
//           }
//         };
//       };

//       myp5 = new p5(sketch, sketchRef.current!);

//       return () => {
//         if (source) {
//           source.stop();
//         }
//         if (audioContext) {
//           audioContext.close();
//         }
//         if (myp5) {
//           myp5.remove();
//         }
//       };
//     }
//   }, [audioBuffer, ttsAudio]);

//   return <div ref={sketchRef} />;
// };

// export default SoundWave;