// Creando la animación diractamente con Canvas...El resultado es el mismo
// Para probar este código solo cambia el nombre del archivo en (index.tsx)


// import React, { useEffect, useRef } from 'react';

// interface SoundWaveProps {
//   audioBuffer: { data: Uint8Array };
//   ttsAudio?: HTMLAudioElement | null;
// }

// const SoundWave: React.FC<SoundWaveProps> = ({ audioBuffer, ttsAudio }) => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   let audioContext: AudioContext | null = null;
//   let source: AudioBufferSourceNode | null = null;
//   let analyser: AnalyserNode | null = null;
//   let frequencyData: Uint8Array;

//   useEffect(() => {
//     // Verificar si estamos en un entorno de cliente
//     if (typeof window !== 'undefined' && audioBuffer) {
//       const canvas = canvasRef.current;
//       if (!canvas) return; // Manejar si el canvas es null

//       const ctx = canvas.getContext('2d');
//       if (!ctx) return; // Manejar si el contexto es null

//       // Establecer tamaño del canvas
//       canvas.width = 400;
//       canvas.height = 400;

//       // Decodificar audioBuffer
//       audioContext = new AudioContext();
//       source = audioContext.createBufferSource();
//       analyser = audioContext.createAnalyser();
//       source.connect(analyser);
//       analyser.connect(audioContext.destination);

//       const arrayBuffer =
//         audioBuffer.data.buffer instanceof ArrayBuffer
//           ? audioBuffer.data.buffer
//           : new Uint8Array(audioBuffer.data).buffer;

//       audioContext.decodeAudioData(
//         arrayBuffer,
//         (buffer) => {
//           source!.buffer = buffer;
//           frequencyData = new Uint8Array(analyser!.frequencyBinCount);
//           source!.start(0);

//           // Iniciar el loop de animación
//           const animate = () => {
//             // Limpiar el canvas
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.strokeStyle = 'rgba(0, 100, 200, 1)';
//             ctx.lineWidth = 3;
//             ctx.beginPath();

//             if (analyser) {
//               analyser.getByteFrequencyData(frequencyData);

//               const numPoints = 100; // Número de puntos en el contorno
//               const angleStep = (Math.PI * 2) / numPoints; // Paso de ángulo

//               for (let i = 0; i < numPoints; i++) {
//                 const angle = i * angleStep;
//                 const iFreq = Math.floor((i / numPoints) * frequencyData.length); // Mapeo de índice de frecuencia
//                 const vol = frequencyData[iFreq] / 255; // Normalizar el volumen

//                 // Calcular el radio en función de la amplitud de la frecuencia
//                 const radius = 100 + vol * 100; // Ajusta el valor 100 para modificar la cantidad de distorsión

//                 // Calcular las coordenadas x e y
//                 const x = canvas.width / 2 + radius * Math.cos(angle);
//                 const y = canvas.height / 2 + radius * Math.sin(angle);
                
//                 // Dibuja la línea hacia el nuevo punto
//                 ctx.lineTo(x, y);
//               }
              
//               ctx.closePath();
//               ctx.stroke();

//               // Sincronización con ttsAudio
//               if (ttsAudio) {
//                 const currentTime = ttsAudio.currentTime;
//                 if (currentTime > 0 && source && audioContext && analyser) {
//                   if (audioContext.state !== 'running') {
//                     source.start(0, currentTime);
//                   }
//                 }
//               }
//             }

//             requestAnimationFrame(animate);
//           };

//           animate();
//         },
//         (error) => {
//           console.error('Error al decodificar el audio:', error);
//         }
//       );
//     }

//     return () => {
//       if (source) {
//         source.stop();
//       }
//       if (audioContext) {
//         audioContext.close();
//       }
//     };
//   }, [audioBuffer, ttsAudio]);

//   return <canvas ref={canvasRef} />;
// };

// export default SoundWave;
