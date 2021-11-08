import classNames from "classnames";
import { motion } from "framer-motion";
import _ from "lodash";
import * as mediasoupClient from "mediasoup-client";
import { Producer } from "mediasoup-client/lib/Producer";
import { useContext, useEffect, useRef, useState } from "react";
import { BsArrowBarRight } from "react-icons/bs";
import { Peer } from "../../../../types/room.type";
import {
  ConsumeStream,
  JoinedRoomContext,
} from "../../../contexts/JoinedRoomContext";
import { RoomContext } from "../../../contexts/RoomContext";
import { AcceptPeerModal } from "./AcceptPeerModal/AcceptPeerModal";
import Control from "./Control/Control";
import { MainScreen } from "./MainScreen/MainScreen";
import RightContainer from "./RightContainer/RightContainer";

export type MediaType = "audio" | "video" | "screen";

const JoinedRoom = () => {
  const {
    roomInfo,
    socket,
    setPeers,
    requestPeers,
    setRequestPeers,
    peers,
    setMicProducer,
    sendTransport,
    mediasoupDevice,
    setWebcamProducer,
  } = useContext(RoomContext);

  const [showRightContainer, setShowRightContainer] = useState<boolean>(true);
  const [device, setDevice] = useState<mediasoupClient.types.Device>();
  const [videoConsumers, setVideoConsumers] = useState<ConsumeStream[]>([]);
  const [audioConsumers, setAudioConsumers] = useState<ConsumeStream[]>([]);

  const videoRef = useRef<null | HTMLVideoElement>(null);

  useEffect(() => {
    socket.on("notification", ({ method, data }) => {
      switch (method) {
        case "newPeer":
          setPeers([...peers, data]);
          break;
        case "peerLeave":
          setPeers(peers.filter((peer) => peer.id !== data.peerId));
          break;
        case "askToJoin":
          setRequestPeers(
            _.isNull(requestPeers) ? null : [...requestPeers, data]
          );
          break;
        case "askToJoinPeerLeave":
          setRequestPeers(
            _.isNull(requestPeers)
              ? null
              : requestPeers.filter((peer) => peer.id !== data.peerId)
          );
          break;
        default:
          console.log("unknown method " + method);
      }
    });

    return () => {
      socket.off("notification");
    };
  }, [peers, requestPeers]);

  useEffect(() => {
    if (mediasoupDevice && sendTransport) {
      console.log(sendTransport);
      (async () => {
        let track;

        try {
          if (!mediasoupDevice.canProduce("audio"))
            throw new Error("cannot produce audio");

          const devices = await navigator.mediaDevices.enumerateDevices();
          let deviceId = "";
          devices.forEach((device) => {
            if (device.kind === "audioinput") {
              deviceId = device.deviceId;
            }
          });

          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId,
              sampleRate: 96000,
              channelCount: 1,
              sampleSize: 16,
            },
          });

          [track] = stream.getAudioTracks();

          const micProducer = await sendTransport.produce({
            track,
            codecOptions: {
              opusStereo: false,
              opusDtx: true,
              opusFec: true,
              opusPtime: 20,
              opusMaxPlaybackRate: 96000,
            },
            appData: { source: "mic" },
          });

          setMicProducer(micProducer);

          micProducer.on("transportclose", () => {
            setMicProducer({} as Producer);
          });
        } catch (err) {
          console.log(err);
        }

        try {
          if (!mediasoupDevice.canProduce("video"))
            throw new Error("cannot produce video");

          const devices = await navigator.mediaDevices.enumerateDevices();
          let deviceId = "";
          devices.forEach((device) => {
            if (device.kind === "videoinput") {
              deviceId = device.deviceId;
            }
          });

          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { ideal: deviceId },
              width: { ideal: 640 },
              aspectRatio: 1.777,
              frameRate: 30,
            },
          });

          [track] = stream.getVideoTracks();

          const webcamProducer = await sendTransport.produce({
            track,
            codecOptions: {
              videoGoogleStartBitrate: 1000,
            },
            encodings: [
              {
                rid: "r0",
                maxBitrate: 100000,
                //scaleResolutionDownBy: 10.0,
                scalabilityMode: "S1T3",
              },
              {
                rid: "r1",
                maxBitrate: 300000,
                scalabilityMode: "S1T3",
              },
              {
                rid: "r2",
                maxBitrate: 900000,
                scalabilityMode: "S1T3",
              },
            ],
            appData: { source: "webcam" },
          });

          setWebcamProducer(webcamProducer);

          webcamProducer.on("transportclose", () => {
            setWebcamProducer({} as Producer);
          });
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [mediasoupDevice, sendTransport]);

  return (
    <JoinedRoomContext.Provider
      value={{
        videoConsumers,
        audioConsumers,
        setAudioConsumers,
        setVideoConsumers,
        device,
      }}
    >
      <AcceptPeerModal />
      <div className="w-screen h-screen flex space-x-4 overflow-hidden font-quicksand bg-[#202124] text-gray-50">
        <motion.div
          animate={showRightContainer ? { width: "100vw" } : {}}
          className="flex-1 flex-col flex p-4 overflow-hidden"
        >
          <div className="h-[40px] mb-2 flex justify-between items-center">
            <div className="flex space-x-3 items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex-center">
                <img
                  className="w-full h-full object-contain"
                  alt="logo"
                  src="https://st1.zoom.us/static/5.2.2562/image/new/ZoomLogo.png"
                />
              </div>
              <div className="font-semibold">{roomInfo.name}</div>
            </div>
            <div>
              <button
                className="text-xl hover:bg-gray-50/20 p-2 rounded-full transition-colors"
                onClick={() => setShowRightContainer(!showRightContainer)}
              >
                <BsArrowBarRight
                  className={classNames({
                    "scale-x-[-1]": !showRightContainer,
                  })}
                />
              </button>
            </div>
          </div>
          <MainScreen />
          <Control videoRef={videoRef} />
        </motion.div>
        <RightContainer show={showRightContainer} />
      </div>
    </JoinedRoomContext.Provider>
  );
};

export default JoinedRoom;
