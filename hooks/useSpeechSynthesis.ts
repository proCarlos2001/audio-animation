import React from "react";
import playAudio from "@/utils/playAudio";

type MessageData = {
  filename: string;
  audioBuffer: { data: Uint8Array };
};

export default function useSpeechSynthesis() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [text, setText] = React.useState("");
  const [avatarSay, setAvatarSay] = React.useState("");
  const [messageData, setMessageData] = React.useState<MessageData | null>(null);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSynthesis = async () => {
    if (isPlaying) {
      return;
    }
    setIsPlaying(true);
    setMessageData(null);
    setAvatarSay("Please wait...");
    setText("");

    const response = await fetch("/api/server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }), 
    });

    if (!response.ok) {
      console.error("Error sending message to OpenAI");
      return;
    }

    const data = await response.json();
    setAvatarSay(data.response);
    setMessageData(data);
  };

  React.useEffect(() => {
    if (isPlaying && messageData) {
      playAudio({ audioBuffer: messageData.audioBuffer }).then(() => {
        setIsPlaying(false);
      });
    }
  }, [isPlaying, messageData]);

  return { isPlaying, text, avatarSay, messageData, handleTextChange, handleSynthesis };
}
