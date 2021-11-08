import classNames from "classnames";
import { Device } from "mediasoup-client";
import { useContext, useEffect, useRef, useState } from "react";
import { IoMic, IoMicOff, IoVideocam, IoVideocamOff } from "react-icons/io5";
import { PageLayout } from "../../../../layouts/PageLayout";
import Button from "../../../common/Button/Button";
import { RoomContext } from "../../../contexts/RoomContext";
import { ThreeDotsLoading } from "../../../global/Loading/ThreeDotsLoading";

const Lobby = () => {
  const {
    setRoomState,
    setRoomInfo,
    roomInfo,
    socket,
    enableMic,
    setEnableMic,
    enableCamera,
    setEnableCamera,
    setMediasoupDevice,
    setSendTransport,
    setRecvTransport,
    setPeers,
    setRequestPeers,
  } = useContext(RoomContext);
  const currentMediaStream = useRef<MediaStream>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [lobbyState, setLobbyState] = useState<"NORMAL" | "WAIT" | "REJECT">(
    "NORMAL"
  );

  const handleJoinRequest = async () => {
    try {
      if (roomInfo.allowToJoin) {
        const device = new Device();

        const routerRtpCapabilities = await socket.request(
          "getRouterRtpCapabilities"
        );

        await device.load({ routerRtpCapabilities });
        setMediasoupDevice(device);

        //Create send transport if enable camera or mic in lobby
        const transportInfo = await socket.request("createWebRtcTransport", {
          forceTcp: true,
          producing: true,
          consuming: false,
        });

        const { params } = transportInfo;

        const sendTransport = device.createSendTransport(params);

        sendTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
          socket
            .request("connectWebRtcTransport", {
              transportId: sendTransport.id,
              dtlsParameters,
            })
            .then(callback)
            .catch(errback);
        });

        sendTransport.on(
          "produce",
          async ({ kind, rtpParameters, appData }, callback, errback) => {
            console.log("produce");
            try {
              const { id } = await socket.request("produce", {
                transportId: sendTransport.id,
                kind,
                rtpParameters,
                appData,
              });
              callback({ id });
            } catch (error) {
              errback(error);
            }
          }
        );

        console.log(sendTransport);

        setSendTransport(sendTransport);

        //Create consumer transport
        {
          const transportInfo = await socket.request("createWebRtcTransport", {
            forceTcp: true,
            producing: false,
            consuming: true,
          });

          const { params } = transportInfo;

          const recvTransport = device.createRecvTransport(params);

          recvTransport.on(
            "connect",
            ({ dtlsParameters }, callback, errback) => {
              socket
                .request("connectWebRtcTransport", {
                  transportId: recvTransport.id,
                  dtlsParameters,
                })
                .then(callback)
                .catch(errback);
            }
          );

          setRecvTransport(recvTransport);
        }

        console.log("join");

        const { peers, requestPeers, ...roomInfo } = await socket.request(
          "join",
          {
            rtpCapabilities: device.rtpCapabilities,
          }
        );

        console.log("joined");

        setRoomInfo(roomInfo);
        setPeers(peers);
        setRequestPeers(requestPeers);

        setRoomState("JOINED");
      } else {
        const device = new Device();

        const routerRtpCapabilities = await socket.request(
          "getRouterRtpCapabilities"
        );

        await device.load({ routerRtpCapabilities });
        setMediasoupDevice(device);

        await socket.request("askToJoin", {
          rtpCapabilities: device.rtpCapabilities,
        });

        setLobbyState("WAIT");

        socket.once("acceptedPeer", async (data) => {
          //Create send transport if enable camera or mic in lobby
          const transportInfo = await socket.request("createWebRtcTransport", {
            forceTcp: true,
            producing: true,
            consuming: false,
          });

          const { id, iceParameters, iceCandidates, dtlsParameters } =
            transportInfo;

          const sendTransport = device.createSendTransport({
            id,
            iceCandidates,
            iceParameters,
            dtlsParameters,
          });

          sendTransport.on(
            "connect",
            ({ dtlsParameters }, callback, errback) => {
              socket
                .request("connectWebRtcTransport", {
                  transportId: sendTransport.id,
                  dtlsParameters,
                })
                .then(callback)
                .catch(errback);
            }
          );

          sendTransport.on(
            "produce",
            async ({ kind, rtpParameters, appData }, callback, errback) => {
              try {
                console.log("produce");
                const { id } = await socket.request("produce", {
                  transportId: sendTransport.id,
                  kind,
                  rtpParameters,
                  appData,
                });
                callback({ id });
              } catch (error) {
                errback(error);
              }
            }
          );

          setSendTransport(sendTransport);

          //Create consumer transport
          {
            const transportInfo = await socket.request(
              "createWebRtcTransport",
              {
                forceTcp: true,
                producing: false,
                consuming: true,
              }
            );

            const { id, iceParameters, iceCandidates, dtlsParameters } =
              transportInfo;

            const recvTransport = device.createRecvTransport({
              id,
              iceParameters,
              iceCandidates,
              dtlsParameters,
            });

            recvTransport.on(
              "connect",
              ({ dtlsParameters }, callback, errback) => {
                socket
                  .request("connectWebRtcTransport", {
                    transportId: recvTransport.id,
                    dtlsParameters,
                  })
                  .then(callback)
                  .catch(errback);
              }
            );

            setRecvTransport(recvTransport);
          }
          const { peers, requestPeers, ...roomInfo } = data;

          setRoomInfo(roomInfo);
          setPeers(peers);
          setRequestPeers(requestPeers);

          setRoomState("JOINED");
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCamera = () => {
    setEnableCamera(!enableCamera);
    if (!enableCamera) {
      if (currentMediaStream.current) {
        currentMediaStream.current.getTracks().forEach(function (track) {
          track.stop();
        });
      }
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((mediaStream) => {
          currentMediaStream.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = currentMediaStream.current;
            videoRef.current?.play();
          }
        });
    } else {
      if (videoRef.current) {
        currentMediaStream.current?.getTracks().forEach(function (track) {
          track.stop();
        });

        videoRef.current.srcObject = null;
        videoRef.current?.pause();
      }
    }
  };

  useEffect(() => {
    handleCamera();

    if (!roomInfo.allowToJoin) {
      socket.on("notification", ({ method, data }) => {
        switch (method) {
          case "acceptedPeer":
            const { peers, requestPeers, ...roomInfo } = data;

            setRoomInfo(roomInfo);
            setPeers(peers);
            setRequestPeers(requestPeers);
            setRoomState("JOINED");
            break;
          case "deniedPeer":
            setLobbyState("REJECT");
            break;
          default:
            console.log("unknown method");
        }
      });
    }

    return () => {
      if (!roomInfo.allowToJoin) {
        socket.off("notification");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageLayout noFooter>
      <div className="h-screen flex flex-col absolute top-0 inset-0">
        <div className="flex-grow">
          <div className="min-h-full flex">
            <div className="flex-center flex-grow space-x-12">
              <div className="flex-center max-w-[764px] m-2 flex-1 relative select-none">
                <div
                  className="bg-[#202124] text-2xl text-gray-50 flex-center
                shadow-inner flex-grow h-[400px] rounded-xl flex-center relative overflow-hidden"
                >
                  Camera is off
                  <video
                    ref={videoRef}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full flex-center p-4 space-x-3">
                  <button
                    onClick={() => setEnableMic(!enableMic)}
                    className={classNames(
                      "rounded-full w-12 h-12 flex-center text-xl text-white transition-colors",
                      {
                        "bg-gray-700/40 backdrop-blur hover:bg-gray-600/40":
                          enableMic,
                        "bg-red-600 hover:bg-red-500": !enableMic,
                      }
                    )}
                  >
                    {enableMic ? <IoMic /> : <IoMicOff />}
                  </button>
                  <button
                    onClick={handleCamera}
                    className={classNames(
                      "rounded-full w-12 h-12 flex-center text-xl text-white transition-colors",
                      {
                        "bg-gray-700/40 backdrop-blur hover:bg-gray-600/40":
                          enableCamera,
                        "bg-red-600 hover:bg-red-500": !enableCamera,
                      }
                    )}
                  >
                    {enableCamera ? <IoVideocam /> : <IoVideocamOff />}
                  </button>
                </div>
              </div>
              <div className="w-[448px] flex-center flex-col select-none font-medium">
                {lobbyState === "NORMAL" && (
                  <>
                    <h2 className="text-[28px] mb-4">Ready to join?</h2>
                    <div>No one else is here</div>
                    <div className="mt-3">
                      <Button
                        className="w-[120px] rounded-full py-3 font-medium font-poppins"
                        onClick={handleJoinRequest}
                      >
                        {roomInfo.allowToJoin ? "Join now" : "Ask to join"}
                      </Button>
                    </div>
                  </>
                )}
                {lobbyState === "WAIT" && (
                  <>
                    <h2 className="text-[28px] mb-4">Asking to join...</h2>
                    <div>
                      You&apos;ll join the call when someone lets you in
                    </div>
                    <div className="mt-5">
                      <ThreeDotsLoading />
                    </div>
                  </>
                )}
                {lobbyState === "REJECT" && (
                  <>
                    <h2 className="text-[28px] mb-4">
                      You can&apos;t join this call
                    </h2>
                    <div>Meeting host denied your request to join</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Lobby;
