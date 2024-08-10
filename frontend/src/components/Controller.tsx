
import { useState, useRef } from 'react';
import Title from "./Title";
import RecordMessage from './RecordMessage';
import axios from "axios";
import defaultMp4 from "../videos/default.mp4"
// Jin Debug line
const Controller: React.FC = () => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  // const [blob, setBlob] = useState("");

  const createBlobUrl = (data: any) => {
    const blob = new Blob([data], { type:"audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  };

  const handleStop = async (blobUrl: string) => {
    // console.log(blobUrl);
    // setBlob(blobUrl);
    setIsLoading(true)


    // Append recorded message to messages
    const myMessage = { sender: "me", blobUrl: blobUrl, content: '' };

    // Convert blobUrl to blob object
    fetch(blobUrl).then((res) =>res.blob()).then(async (blob) => {

      // Construct audio to file
      const formData = new FormData;
      formData.append("file", blob, "myFile.wav");

      //  Send form Data to API endpoint
      await axios.post("http://localhost:8000/post-audio", formData, {headers: {"Content-Type": "audio/mpeg"}}).then(async (res: any) => {
        console.log(res.data)
        myMessage.content = res.data.question;
        const messagesArr = [...messages, myMessage];

        await axios.post("http://localhost:8000/transform", {text: res.data.answer}, {headers: {"Content-Type": "application/json"}, responseType: "arraybuffer", }).then(resp => {
          const blob = resp.data;
          const audio = new Audio();
          audio.src = createBlobUrl(blob);
          audio.onended = handleAudioEnded;
  
          // Append to audio
          const rachelMessage = {sender:"JinXi", blobUrl: audio.src, content: res.data.answer };
          messagesArr.push(rachelMessage);
  
          setMessages(messagesArr);
  
          // Play audio
          setIsLoading(false);
          audio.play();
          videoRef.current?.play();
        });


      }).catch((err) => {
        console.error(err.message);
        setIsLoading(false);
      });

    });

  };

  const handleAudioEnded = () => {
    console.log('event trigger')
    if(videoRef.current != null) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

  };

  return (
    <div className="h-screen overflow-y-hidden">
        <Title setMessages={setMessages}/>
        <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
        <div className='ml-10'>
          <video ref={videoRef} muted width="240">
            <source src={defaultMp4} type="video/mp4" />
          </video>
        </div>

            {/* <audio src={blob} controls/> */}


            {/* Conversation */}
            <div className="mt-5 px-5">
              {messages.map((audio, index) => {
                return <div key={index + audio.sender} className={"flex flex-col" + (audio.sender == "JinXi" && "flex items-end")}>
                  {/* Sender */}
                  <div className="mt-4">
                    <p className={audio.sender == "JinXi" ? "text-right mr-2 italic text-green-500" : "ml-2 italic text-blue-500" }>
                      {audio.sender}
                    </p>

                    {/* Audio Messages */}
                    <audio onEnded={handleAudioEnded} src={audio.blobUrl} className="appearance-none" controls />
                    <p className='text-xs bg-gray-100 p-3 mt-2'>{audio.content}</p>
                  </div>

                </div>;
              } )}

              {messages.length == 0 && !isLoading && (
                <div className="text-center font-light italic mt-10"> Send JinXi a message... </div>
              ) }

              {isLoading && (
                <div className="text-center font-light italic mt-10 animate-pulse"> Give me a few seconds... </div>
              ) }

            </div>


            {/* Recorder */}
            <div className="fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-sky-500 to-green-500">
                <div className="flex justify-center items-center w-full">
                    <RecordMessage handleStop={handleStop}/>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Controller;
