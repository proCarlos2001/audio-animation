import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

interface SoundWaveProps {
  audioBuffer: { data: Uint8Array };
  ttsAudio?: HTMLAudioElement | null;
}

const SoundWave: React.FC<SoundWaveProps> = ({ audioBuffer, ttsAudio }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  let myp5: p5 | null = null;
  let audioContext: AudioContext | null = null;
  let source: AudioBufferSourceNode | null = null;
  let analyser: AnalyserNode | null = null;

  useEffect(() => {
    // Verificar si estamos en un entorno de cliente
    if (typeof window !== 'undefined' && audioBuffer) {
      const sketch = (p: p5) => {
        let radius: number;
        let frequencyData: Uint8Array;

        p.setup = () => {
          p.createCanvas(400, 400).parent(sketchRef.current!);
          radius = p.width / 4;

          // Decodificar audioBuffer
          audioContext = new AudioContext();
          source = audioContext.createBufferSource();
          analyser = audioContext.createAnalyser();
          source.connect(analyser);
          analyser.connect(audioContext.destination);

          const arrayBuffer = audioBuffer.data.buffer instanceof ArrayBuffer ? audioBuffer.data.buffer : new Uint8Array(audioBuffer.data).buffer;

          audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            source!.buffer = buffer;
            frequencyData = new Uint8Array(analyser!.frequencyBinCount);
            source!.start(0); 
          }, (error) => {
            console.error('Error al decodificar el audio:', error);
          });
        };

        p.draw = () => {
          p.background(255);
          p.stroke(0, 100, 200);
          p.strokeWeight(3);
          p.noFill();

          if (analyser) {
            if (!(frequencyData instanceof Uint8Array)) {
              frequencyData = new Uint8Array(analyser.frequencyBinCount);
            }
            analyser.getByteFrequencyData(frequencyData);

            p.beginShape();
            for (let a = 0; a < p.TWO_PI; a += 0.1) {
              const i = Math.floor(p.map(a, 0, p.TWO_PI, 0, frequencyData.length));
              const vol = frequencyData[i] / 255;
              //const xoff = p.map(vol, 0, 1, 0, 100);
              const r = radius + vol * 80;
              const x = p.width / 2 + r * p.cos(a);
              const y = p.height / 2 + r * p.sin(a);
              p.vertex(x, y);
            }
            p.endShape(p.CLOSE);

            // Sincronización con ttsAudio
            if (ttsAudio) {
              const currentTime = ttsAudio.currentTime;
              if (currentTime > 0 && source && audioContext && analyser) {
                if (audioContext.state !== 'running') {
                  source.start(0, currentTime);
                }
              }
            }
          }
        };
      };

      myp5 = new p5(sketch, sketchRef.current!);

      return () => {
        if (source) {
          source.stop();
        }
        if (audioContext) {
          audioContext.close();
        }
        if (myp5) {
          myp5.remove();
        }
      };
    }
  }, [audioBuffer, ttsAudio]);

  return <div ref={sketchRef} />;
};

export default SoundWave;















// Para usar la librería de p5.sound...no reconoce el archivo de la ruta (p5/lib/addons/p5.sound)

// import React, { useEffect, useRef } from 'react';
// import p5 from 'p5';
// import 'p5/lib/addons/p5.sound';



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
//     if (typeof window !== 'undefined' && audioBuffer) {
//       const sketch = (p: p5) => {
//         let fft: p5.FFT;
//         let radius: number;

//         p.setup = () => {
//           p.createCanvas(p.windowWidth, p.windowHeight).parent(sketchRef.current!);
//           fft = new p5.FFT(0.8, 1024);
//           radius = p.width / 4;

//           // Crear contexto de audio
//           audioContext = new AudioContext();
//           source = audioContext.createBufferSource();
//           analyser = audioContext.createAnalyser();
//           source.connect(analyser);
//           analyser.connect(audioContext.destination);

//           const arrayBuffer = audioBuffer.data.buffer instanceof ArrayBuffer
//             ? audioBuffer.data.buffer
//             : new Uint8Array(audioBuffer.data).buffer;

//           audioContext.decodeAudioData(arrayBuffer as ArrayBuffer, (buffer) => {
//             source!.buffer = buffer;
//             source!.start(0);
//           }, (error) => {
//             console.error('Error al decodificar el audio:', error);
//           });
//         };

//         p.draw = () => {
//           p.background(255);

//           // Obtener datos de la forma de onda
//           const wave = fft.waveform();
//           drawWaveform(wave, p.width / 2, p.color(210, 100, 50)); // Azul suave
//         };

//         const drawWaveform = (wave: number[], xPos: number, col: p5.Color) => {
//           p.push();
//           p.translate(xPos, p.height / 2);
//           p.noFill();
//           p.stroke(col);
//           p.strokeWeight(2);
//           p.beginShape();

//           for (let i = 0; i < wave.length; i += 10) {
//             let angle = p.map(i, 0, wave.length, 0, 360);
//             let r = p.map(wave[i], -1, 1, 100, 130); // Suavizamos el radio
//             let x = r * p.cos(angle);
//             let y = r * p.sin(angle);
//             p.vertex(x, y);
//           }
//           p.endShape();
//           p.pop();
//         };

//         p.windowResized = () => {
//           p.resizeCanvas(p.windowWidth, p.windowHeight);
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
