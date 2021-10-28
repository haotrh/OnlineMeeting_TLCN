import classNames from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { BsArrowBarRight } from "react-icons/bs";
import { socket } from "../../../../lib/socket";
import { RoomContext } from "../../../contexts/RoomContext";
import Control from "./Control/Control";
import RightContainer from "./RightContainer/RightContainer";
import * as mediasoupClient from "mediasoup-client";
import { MediaKind, RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import {
  ConsumeStream,
  JoinedRoomContext,
} from "../../../contexts/JoinedRoomContext";
import AudioElem from "./AudioElem/AudioElem";
import VideoElem from "./VideoElem/VideoElem";

export type MediaType = "audio" | "video" | "screen";

const JoinedRoom = () => {
  const { roomInfo } = useContext(RoomContext);

  const [showRightContainer, setShowRightContainer] = useState<boolean>(true);
  const [device, setDevice] = useState<mediasoupClient.types.Device>();
  const [producerTransport, setProducerTransport] =
    useState<mediasoupClient.types.Transport>();
  const [consumerTransport, setConsumerTransport] =
    useState<mediasoupClient.types.Transport>();
  const [videoConsumers, setVideoConsumers] = useState<ConsumeStream[]>([]);
  const [audioConsumers, setAudioConsumers] = useState<ConsumeStream[]>([]);

  const videoRef = useRef<null | HTMLVideoElement>(null);

  const loadDevice = async (routerRtpCapabilities: RtpCapabilities) => {
    console.log(routerRtpCapabilities);
    let device;
    try {
      device = new mediasoupClient.Device();
      await device.load({
        routerRtpCapabilities,
      });
      return device;
    } catch (error: any) {
      if (error.name === "UnsupportedError") {
        console.error("Browser not supported");
        alert("Browser not supported");
      }
      console.error(error);
    }
  };

  const initTransports = async (device: mediasoupClient.types.Device) => {
    //init producer transport
    {
      const data = await socket.request("createWebRtcTransport", {
        forceTcp: false,
        rtpCapabilities: device.rtpCapabilities,
      });

      console.log(data);

      if (data.error) {
        console.error(data.error);
        return;
      }

      const producerTransport = device.createSendTransport(data);

      producerTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          console.log(dtlsParameters);
          socket
            .request("connectTransport", {
              dtlsParameters,
              transport_id: data.id,
            })
            .then(() => {
              callback();
            })
            .catch(errback);
        }
      );

      producerTransport.on(
        "produce",
        async ({ kind, rtpParameters }, callback, errback) => {
          try {
            const { producer_id } = await socket.request("produce", {
              producerTransportId: producerTransport.id,
              kind,
              rtpParameters,
            });
            callback({ id: producer_id });
          } catch (err) {
            console.log(err);
            errback(err);
          }
        }
      );

      producerTransport.on("connectionstatechange", (state) => {
        console.log("STATE CHANGE: " + state);
      });

      setProducerTransport(producerTransport);
    }
    //init consumer transport
    {
      const data = await socket.request("createWebRtcTransport", {
        forceTcp: false,
      });

      if (data.error) {
        console.error(data.error);
        return;
      }

      const consumerTransport = device.createRecvTransport(data);

      consumerTransport.on(
        "connect",
        ({ dtlsParameters }, callback, errback) => {
          socket
            .request("connectTransport", {
              transport_id: consumerTransport.id,
              dtlsParameters,
            })
            .then(callback)
            .catch(errback);
        }
      );

      consumerTransport.on("connectionstatechange", (state) => {
        console.log("STATE CHANGE: " + state);
      });

      setConsumerTransport(consumerTransport);
    }
  };

  const initSockets = () => {
    socket.on("newProducers", (data: any[]) => {
      data.forEach(({ producer_id }) => {
        consume(producer_id);
      });
    });

    socket.on("consumerClosed", ({ consumer_id }) => {});

    socket.on("disconnect", () => {
      socket.request("exitRoom", () => {
        console.log("EXIT");
      });
    });
  };

  const consume = (producer_id: string) => {
    getConsumeStream(producer_id).then(({ consumer, stream, kind }) => {
      console.log(stream);
      const consumerStream: ConsumeStream = {
        consumer: consumer as mediasoupClient.types.Consumer,
        stream,
      };
      if ((kind as MediaKind) === "audio") {
        setAudioConsumers([...audioConsumers, consumerStream]);
      }
      if ((kind as MediaKind) === "video") {
        setVideoConsumers([...videoConsumers, consumerStream]);
      }

      const onDisconnect = () => {
        if (kind === "audio") {
          setAudioConsumers(
            audioConsumers.filter(
              (consumerStream) => consumerStream.consumer.id !== consumer?.id
            )
          );
        }
        if (kind === "video") {
          setVideoConsumers(
            videoConsumers.filter(
              (consumerStream) => consumerStream.consumer.id !== consumer?.id
            )
          );
        }
      };

      if (consumer) {
        consumer.on("trackended", () => {
          onDisconnect();
        });

        consumer.on("transportclose", () => {
          onDisconnect();
        });
      }
    });
  };

  const getConsumeStream = async (producerId: string) => {
    console.log("DEVICE");
    console.log(device);
    const { rtpCapabilities } = device as mediasoupClient.types.Device;

    const data = await socket.request("consume", {
      rtpCapabilities,
      consumerTransportId: consumerTransport?.id,
      producerId,
    });

    const { id, kind, rtpParameters } = data as mediasoupClient.types.Consumer;

    const consumer = await consumerTransport?.consume({
      id,
      producerId,
      kind: kind as MediaKind,
      rtpParameters,
    });

    const stream = new MediaStream();
    if (consumer?.track) {
      stream.addTrack(consumer.track);
    }

    return {
      consumer,
      stream,
      kind,
    };
  };

  const removeConsumer = (consumer_id: string) => {};

  const produce = async (type: MediaType, deviceId: string = "") => {
    let mediaConstraints: any = {};
    let audio = false;
    let screen = false;
    switch (type) {
      case "audio":
        mediaConstraints = {
          audio: {
            deviceId: deviceId,
          },
          video: false,
        };
        audio = true;
        break;
      case "video":
        mediaConstraints = {
          audio: false,
          video: {
            width: {
              min: 640,
              ideal: 1920,
            },
            height: {
              min: 400,
              ideal: 1080,
            },
            deviceId,
          },
        };
        break;
      case "screen":
        mediaConstraints = false;
        screen = true;
        break;
      default:
        return;
    }
    if (!device?.canProduce("video") && !audio) {
      console.error("Cannot produce video");
      return;
    }

    console.log(mediaConstraints);

    let stream;
    try {
      stream = screen
        ? await navigator.mediaDevices.getDisplayMedia()
        : await navigator.mediaDevices.getUserMedia(mediaConstraints);

      const track = audio
        ? stream.getAudioTracks()[0]
        : stream.getVideoTracks()[0];
      const params: any = {
        track,
      };
      if (!audio && !screen) {
        params.encodings = [
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
        ];
        params.codecOptions = {
          videoGoogleStartBitrate: 1000,
        };
      }
      const producer = await producerTransport?.produce(params);
      console.log("Producer", producer);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      const routerRtpCapabilities = await socket.request(
        "getRouterRtpCapabilities"
      );
      let device = (await loadDevice(
        routerRtpCapabilities
      )) as mediasoupClient.types.Device;
      await initTransports(device);
      setDevice(device);
      socket.emit("getProducers");
    })();
  }, []);

  useEffect(() => {
    if (device && producerTransport) {
      initSockets();
    }
  }, [device, producerTransport]);

  return (
    <JoinedRoomContext.Provider
      value={{
        videoConsumers,
        audioConsumers,
        setAudioConsumers,
        setVideoConsumers,
        produce,
        device,
      }}
    >
      <div className="w-screen h-screen flex p-3 space-x-4 overflow-hidden font-quicksand">
        <div className="flex-1 flex-col flex">
          <div className="h-[40px] mb-2 flex justify-between items-center border-b border-gray-200">
            <div className="font-medium text-lg">14:41 | {roomInfo.id}</div>
            <div>
              <button
                className="text-xl hover:bg-gray-200 p-2 rounded-full"
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
          <div className="flex-1 flex flex-col flex-wrap">
            <div className="flex-1 rounded-2xl overflow-hidden bg-gray-200 relative">
              {/* <video className="w-full h-full object-contain" ref={videoRef} /> */}
              {audioConsumers.map((consumerStream) => (
                <AudioElem
                  key={consumerStream.consumer.id}
                  stream={consumerStream.stream}
                />
              ))}
              {videoConsumers.map((consumerStream) => (
                <VideoElem
                  key={consumerStream.consumer.id}
                  stream={consumerStream.stream}
                />
              ))}
              <Control videoRef={videoRef} />
            </div>
          </div>
        </div>
        <RightContainer show={showRightContainer} />
      </div>
    </JoinedRoomContext.Provider>
  );
};

export default JoinedRoom;
