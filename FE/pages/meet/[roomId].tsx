import { arrayMoveImmutable } from "array-move";
import axios from "axios";
import { Harker } from "hark";
import _ from "lodash";
import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { Producer } from "mediasoup-client/lib/Producer";
import { Transport } from "mediasoup-client/lib/Transport";
import moment from "moment";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { RoomContext } from "../../components/contexts/RoomContext";
import JoinedRoom from "../../components/pages/MeetingRoom/JoinedRoom/JoinedRoom";
import Lobby from "../../components/pages/MeetingRoom/Lobby/Lobby";
import { MeetingNotFound } from "../../components/pages/MeetingRoom/NotFound/NotFound";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { addMessage } from "../../lib/redux/slices/chat.slice";
import hark from "hark";
import {
  setAudioDevices,
  setAudioInProgress,
  setInfo,
  setMediaCapablities,
  setRaiseHand,
  setScreenShareInProgress,
  setWebcamInProgress,
  setWebcams,
} from "../../lib/redux/slices/me.slice";
import {
  addPeer,
  addPeerConsumer,
  addPeers,
  removePeer,
  removePeerConsumer,
  setHand,
  setSpeaking,
} from "../../lib/redux/slices/peers.slice";
import {
  addPoll,
  closePoll,
  openPoll,
  removePoll,
} from "../../lib/redux/slices/polls.slice";
import {
  addQuestion,
  removeQuestion,
  replyQuestion,
  upvoteQuestion,
} from "../../lib/redux/slices/questions.slice";
import {
  addRequestPeer,
  addRequestPeers,
  clearRequestPeer,
  removeRequestPeer,
} from "../../lib/redux/slices/requestPeers.slice";
import {
  setActiveSpeaker,
  setInRoom,
  setPin,
  setRoomAllowCamera,
  setRoomAllowChat,
  setRoomAllowMicrophone,
  setRoomAllowQuestion,
  setRoomAllowRaiseHand,
  setRoomAllowScreenshare,
  setRoomInfo,
  setRoomState,
  setSpotlights,
} from "../../lib/redux/slices/room.slice";
import {
  changeAudioDevice,
  changeWebcam,
  setAudioMuted,
  setIsScreenSharing,
  setLastN,
  setVideoMuted,
} from "../../lib/redux/slices/settings.slice";
import {
  Peer,
  PinType,
  Room,
  RoomPermission,
  Spotlight,
} from "../../types/room.type";
import { RequestMethod, RoomSocket } from "../../types/socket.type";
import { setPeerVolume } from "../../lib/redux/slices/peerVolumes.slice";
import urljoin from "url-join";
import { config } from "../../utils/config";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session)
    return { redirect: { destination: "/login", permanent: false } };

  if (!session.user.isVerified)
    return { redirect: { destination: "/verify-request", permanent: false } };

  const room = (
    await axios.get(
      urljoin(config.backendUrl, `api/rooms/${context.query.roomId}`)
    )
  ).data;

  return { props: { room, token: session.accessToken } };
};

const VIDEO_CONSTRAINS = {
  low: {
    width: { ideal: 320 },
    aspectRatio: 1.7777,
  },
  medium: {
    width: { ideal: 640 },
    aspectRatio: 1.7777,
  },
  high: {
    width: { ideal: 1280 },
    aspectRatio: 1.7777,
  },
  veryhigh: {
    width: { ideal: 1920 },
    aspectRatio: 1.7777,
  },
  ultra: {
    width: { ideal: 3840 },
    aspectRatio: 1.7777,
  },
};

const MeetingRoomPage = ({ roomId, token }: any) => {
  //Socket
  const socket = useRef<RoomSocket>({} as RoomSocket);
  const [socketConnected, setSocketConnected] = useState(false);
  const roomPermissions = useRef(new Set<RoomPermission>());

  //Room
  const room = useAppSelector((selector) => selector.room);
  const isHost = useRef(false);

  //Settings
  const settings = useAppSelector((selector) => selector.settings);

  //Audio devices
  const audioDevices = useRef<{ [deviceId: string]: MediaDeviceInfo }>({});
  const selectedAudioDevice = useRef<string>("");

  //Audio devices
  const webcams = useRef<{ [deviceId: string]: MediaDeviceInfo }>({});
  const selectedWebcam = useRef<string>("");

  //Dispatch
  const dispatch = useAppDispatch();

  //Send transport
  const sendTransportRef = useRef<Transport | null>(null);

  //Recv transport
  const recvTransportRef = useRef<Transport | null>(null);

  //Consumers
  const consumersRef = useRef<{ [consumerId: string]: Consumer }>({});
  const [consumers, setConsumers] = useState<{
    [consumerId: string]: Consumer;
  }>({});

  //Mediasoup device
  const mediasoupDeviceRef = useRef<Device | null>(null);

  //Mic producer
  const micProducerRef = useRef<Producer | null>(null);
  const micProducerId = useRef("");

  //Webcam producer
  const [webcamProducer, setWebcamProducer] = useState<Producer | null>(null);
  const webcamProducerRef = useRef<Producer | null>(null);
  const webcamProducerId = useRef("");

  //Screen producer
  const [screenProducer, setScreenProducer] = useState<Producer | null>(null);
  const screenProducerStreamRef = useRef<MediaStream | null>(null);
  const screenProducerRef = useRef<Producer | null>(null);
  const screenProducerId = useRef("");
  // const screenConsumersRef = useRef<Consumer[]>([]);

  //Spotlights
  const maxSpotlights = useRef(12);
  const peerList = useRef<string[]>([]);
  const pin = useRef<PinType>(null);
  const currentSpotlights = useRef<Spotlight[]>([]);

  //Local mic hark
  const lastVolume = useRef<number>(0);
  const harkRef = useRef<Harker | null>(null);
  const harkStreamRef = useRef<MediaStream | null>(null);
  const consumerHark = useRef<{
    [consumerId: string]: {
      hark: Harker;
      volume: number;
    };
  }>({});

  //Is speaking
  const isSpeaking = useRef<boolean>(false);

  //Sound effect
  const messageAlert = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined"
      ? new Audio("/sounds/message-alert.mp3")
      : undefined
  );
  const askToJoinAlert = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined"
      ? new Audio("/sounds/ask-to-join.wav")
      : undefined
  );
  const notificationSound = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined"
      ? new Audio("/sounds/notification-sound.mp3")
      : undefined
  );

  const diconnectLocalHark = () => {
    if (harkStreamRef.current !== null) {
      let [track] = harkStreamRef.current.getAudioTracks();

      track.stop();

      harkStreamRef.current = null;
    }

    if (harkRef.current !== null) {
      harkRef.current.stop();
    }
  };

  const connectLocalHark = (track: MediaStreamTrack) => {
    harkStreamRef.current = new MediaStream();

    const newTrack = track.clone();

    harkStreamRef.current.addTrack(newTrack);

    newTrack.enabled = true;

    harkRef.current = hark(harkStreamRef.current, {
      play: false,
      interval: 10,
      history: 100,
    });

    lastVolume.current = -100;

    harkRef.current.on("volume_change", (volume) => {
      if (
        micProducerRef.current &&
        !micProducerRef.current.paused &&
        isSpeaking.current &&
        Math.abs(volume - lastVolume.current) > 2
      ) {
        if (volume < lastVolume.current) {
          volume =
            lastVolume.current -
            Math.pow(
              (volume - lastVolume.current) / (100 + lastVolume.current),
              2
            ) *
              10;
        }

        lastVolume.current = volume;

        dispatch(setPeerVolume({ peerId: socket.current.id, volume }));
      }
    });

    harkRef.current.on("speaking", () => {
      if (
        micProducerRef.current &&
        micProducerRef.current.paused &&
        isSpeaking.current
      ) {
        micProducerRef.current.resume();
      }
    });

    harkRef.current.on("stopped_speaking", () => {
      if (micProducerRef.current && !micProducerRef.current.paused) {
        micProducerRef.current.pause();
        dispatch(setPeerVolume({ peerId: socket.current.id, volume: 0 }));
      }
    });
  };

  const changeMaxSpotlights = (max: number) => {
    if (max > 16) return;

    const oldMaxSpotlights = maxSpotlights.current;

    maxSpotlights.current = max;

    if (oldMaxSpotlights !== max) {
      spotlightsUpdated();
      dispatch(setLastN(max));
    }
  };

  const addScreenToSpotlight = (spotlight: Spotlight) => {
    if (currentSpotlights.current.indexOf(spotlight) === -1) {
      const newSpotlights = [spotlight, ...currentSpotlights.current];

      spotlightsUpdated(newSpotlights);

      pin.current = "otherpeer";
      dispatch(setPin("otherpeer"));
    }
  };

  const removeScreenSpotlight = (peerId: string) => {
    if (currentSpotlights.current.indexOf({ type: "screen", peerId }) === -1) {
      const newSpotlights = currentSpotlights.current.filter(
        (spotlight) =>
          spotlight.type !== "screen" ||
          (spotlight.type === "screen" && spotlight.peerId !== peerId)
      );

      spotlightsUpdated(newSpotlights);
    }
  };

  const updateSpotlights = async (spotlights: Spotlight[]) => {
    dispatch(setSpotlights(spotlights));

    try {
      for (const consumer of _.values(consumersRef.current)) {
        if (consumer.kind === "video") {
          if (spotlights.includes(consumer.appData.peerId))
            await resumeConsumer(consumer);
          else {
            await pauseConsumer(consumer);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const spotlightsUpdated = (newSpotlights?: Spotlight[]) => {
    let spotlights;

    const maxN =
      maxSpotlights.current - 1 - (screenProducerRef.current ? 1 : 0);

    if (newSpotlights) {
      spotlights = newSpotlights;
    } else {
      spotlights = _.uniqWith(
        [
          ...currentSpotlights.current,
          ...peerList.current.map((peer) => ({
            type: "peer",
            peerId: peer,
          })),
        ],
        _.isEqual
      );
    }

    if (!_.isEqual(currentSpotlights.current, spotlights.slice(0, maxN))) {
      currentSpotlights.current = spotlights.slice(0, maxN) as Spotlight[];
      updateSpotlights(currentSpotlights.current);
    } else {
      console.log("spotlights not updated");
    }
  };

  const addPeerToSpotlight = (peerId: string) => {
    if (peerList.current.indexOf(peerId) === -1) {
      peerList.current.push(peerId);

      spotlightsUpdated();
    }
  };

  const removePeerSpotlight = (peerId: string) => {
    peerList.current = peerList.current.filter((peer) => peer !== peerId);
    const newSpotlights = currentSpotlights.current.filter(
      (spotlight) => spotlight.peerId !== peerId
    );
    spotlightsUpdated(newSpotlights);
  };

  const pinSpotlight = (spotlight: Spotlight, pinType?: PinType) => {
    pin.current = pinType ?? "otherpeer";

    if (pin.current === "otherpeer") {
      let newSpotlights;

      const spotlightIndex = _.findIndex(currentSpotlights.current, spotlight);

      if (spotlightIndex === -1) {
        newSpotlights = [spotlight, ...currentSpotlights.current];
      } else {
        newSpotlights = arrayMoveImmutable(
          currentSpotlights.current,
          spotlightIndex,
          0
        );

        console.log(currentSpotlights.current);
        console.log(newSpotlights);
      }

      spotlightsUpdated(newSpotlights);
    }
    dispatch(setPin(pinType ?? "otherpeer"));
  };

  const unpinSpotlight = () => {
    pin.current = null;

    changeMaxSpotlights(12);

    dispatch(setPin(null));
  };

  const addPeersToSpotlight = (peers: Peer[]) => {
    for (const peer of peers) {
      if (peerList.current.indexOf(peer.id) === -1) {
        peerList.current.push(peer.id);
      }
    }
    spotlightsUpdated();
  };

  const resumeConsumer = async (consumer: Consumer) => {
    if (!consumer.paused || consumer.closed) return;

    try {
      await socket.current.request("resumeConsumer", {
        consumerId: consumer.id,
      });

      consumer.resume();

      consumer.appData = {
        ...consumer.appData,
        remotelyPaused: false,
        locallyPaused: false,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const pauseConsumer = async (consumer: Consumer) => {
    if (!consumer.paused || consumer.closed) return;

    try {
      await socket.current.request("pauseConsumer", {
        consumerId: consumer.id,
      });

      consumer.pause();

      consumer.appData = {
        ...consumer.appData,
        locallyPaused: true,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const close = () => {
    if (room.state === "closed") return;

    socket.current.close();

    if (sendTransportRef.current) sendTransportRef.current.close();

    if (recvTransportRef.current) recvTransportRef.current.close();

    dispatch(setRoomState("closed"));
  };

  const updateRoomData = (roomData: any) => {
    let { peers, requestPeers, me, ...roomInfo } = roomData;

    isHost.current = roomInfo.isHost;
    (roomInfo as Room).allowCamera &&
      roomPermissions.current.add("SHARE_VIDEO");
    (roomInfo as Room).allowMicrophone &&
      roomPermissions.current.add("SHARE_AUDIO");
    (roomInfo as Room).allowScreenShare &&
      roomPermissions.current.add("SHARE_SCREEN");

    dispatch(setRoomInfo({ roomInfo }));
    dispatch(addPeers({ peers }));
    dispatch(addRequestPeers({ peers: requestPeers }));
    dispatch(setInfo(me));
  };

  const havePermission = (permission: RoomPermission) => {
    if (isHost.current) return true;

    if (
      permission === "SHARE_VIDEO" &&
      roomPermissions.current.has("SHARE_VIDEO")
    ) {
      return true;
    }

    if (
      permission === "SHARE_SCREEN" &&
      roomPermissions.current.has("SHARE_SCREEN")
    ) {
      return true;
    }

    if (
      permission === "SHARE_AUDIO" &&
      roomPermissions.current.has("SHARE_AUDIO")
    ) {
      return true;
    }

    return false;
  };

  const initTransport = async () => {
    if (mediasoupDeviceRef.current) {
      try {
        //Init send transport
        {
          const transportInfo = await socket.current.request(
            "createWebRtcTransport",
            {
              forceTcp: true,
              producing: true,
              consuming: false,
            }
          );

          const { params } = transportInfo;

          sendTransportRef.current =
            mediasoupDeviceRef.current.createSendTransport(params);

          sendTransportRef.current.on(
            "connect",
            ({ dtlsParameters }, callback, errback) => {
              socket.current
                .request("connectWebRtcTransport", {
                  transportId: sendTransportRef.current?.id,
                  dtlsParameters,
                })
                .then(callback)
                .catch(errback);
            }
          );

          sendTransportRef.current.on(
            "produce",
            async ({ kind, rtpParameters, appData }, callback, errback) => {
              try {
                const { producerId } = await socket.current.request("produce", {
                  transportId: sendTransportRef?.current?.id,
                  kind,
                  rtpParameters,
                  appData,
                });

                if (appData.source === "mic") {
                  micProducerId.current = producerId;
                }

                if (appData.source === "webcam") {
                  webcamProducerId.current = producerId;
                }

                if (appData.source === "screen") {
                  screenProducerId.current = producerId;
                }

                callback({ producerId });
              } catch (error) {
                errback(error);
              }
            }
          );
        }

        //Init recv transport
        {
          const transportInfo = await socket.current.request(
            "createWebRtcTransport",
            {
              force: true,
              producing: false,
              consuming: true,
            }
          );

          const { params } = transportInfo;

          recvTransportRef.current =
            mediasoupDeviceRef.current.createRecvTransport(params);

          recvTransportRef.current.on(
            "connect",
            ({ dtlsParameters }, callback, errback) => {
              socket.current
                .request("connectWebRtcTransport", {
                  transportId: recvTransportRef.current?.id,
                  dtlsParameters,
                })
                .then(callback)
                .catch(errback);
            }
          );

          dispatch(
            setMediaCapablities({
              canSendMic: mediasoupDeviceRef.current.canProduce("audio"),
              canSendWebcam: mediasoupDeviceRef.current.canProduce("video"),
              canShareScreen: mediasoupDeviceRef.current.canProduce("video"),
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const joinRoom = async (roomData: any) => {
    updateRoomData(roomData);

    dispatch(setInRoom(true));
    dispatch(setRoomState("connecting"));

    if (mediasoupDeviceRef.current) {
      if (
        !settings.videoMuted &&
        havePermission("SHARE_VIDEO") &&
        mediasoupDeviceRef.current.canProduce("video")
      ) {
        await updateWebcam({ start: true });
      } else {
        await updateWebcams();
      }

      if (
        !settings.audioMuted &&
        havePermission("SHARE_AUDIO") &&
        mediasoupDeviceRef.current.canProduce("audio")
      ) {
        await updateMic({ start: true });
      } else {
        await updateAudioDevices();
      }
    }

    dispatch(setRoomState("connected"));

    toast("Joined room!");

    const { peers } = roomData;

    addPeersToSpotlight(peers);
  };

  const handleJoinRoom = async () => {
    const device = new Device();

    const routerRtpCapabilities = await socket.current.request(
      "getRouterRtpCapabilities"
    );

    await device.load({ routerRtpCapabilities });
    mediasoupDeviceRef.current = device;
    try {
      if (room.allowToJoin) {
        await initTransport();

        const roomData = await socket.current.request("join", {
          rtpCapabilities: mediasoupDeviceRef.current?.rtpCapabilities,
        });

        joinRoom(roomData);
      } else {
        await socket.current.request("askToJoin", {
          rtpCapabilities: mediasoupDeviceRef.current?.rtpCapabilities,
        });

        dispatch(setRoomState("requesting"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateAudioDevices = async () => {
    audioDevices.current = {};

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      for (const device of devices) {
        if (device.kind !== "audioinput") continue;

        audioDevices.current[device.deviceId] = device;
      }
      dispatch(
        setAudioDevices(
          _.values(audioDevices.current).map((audioDevice) => ({
            label: audioDevice.label,
            deviceId: audioDevice.deviceId,
          }))
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const updateWebcams = async () => {
    webcams.current = {};

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      for (const device of devices) {
        if (device.kind !== "videoinput") continue;

        webcams.current[device.deviceId] = device;
      }
      dispatch(
        setWebcams(
          _.values(webcams.current).map((webcam) => ({
            label: webcam.label,
            deviceId: webcam.deviceId,
          }))
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getAudioDeviceId = async () => {
    try {
      await updateAudioDevices();

      const currentSelectedDevice = selectedAudioDevice.current;

      if (
        currentSelectedDevice &&
        audioDevices.current?.[currentSelectedDevice]
      )
        return currentSelectedDevice;
      else {
        const tmpAudioDevices = Object.values(audioDevices.current);

        return tmpAudioDevices[0] ? tmpAudioDevices[0].deviceId : null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWebcamDeviceId = async () => {
    try {
      await updateWebcams();

      const currentSelectedDevice = selectedWebcam.current;

      if (currentSelectedDevice && webcams.current?.[currentSelectedDevice])
        return currentSelectedDevice;
      else {
        const tmpWebcams = Object.values(webcams.current);

        return tmpWebcams[0] ? tmpWebcams[0].deviceId : null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disableMic = async () => {
    if (!micProducerRef.current) return;

    dispatch(setAudioInProgress({ flag: true }));

    micProducerRef.current.close();

    try {
      await socket.current.request("closeProducer", {
        producerId: micProducerId.current,
      });
    } catch (error) {
      console.log(error);
    }

    micProducerRef.current = null;

    dispatch(setAudioMuted(true));
    dispatch(setAudioInProgress({ flag: false }));
    isSpeaking.current = false;
  };

  const updateMic = async ({
    start = false,
    restart = false,
    newDeviceId = null,
  }) => {
    let track;

    try {
      if (!mediasoupDeviceRef.current?.canProduce("audio"))
        throw new Error("cannot produce audio");

      if (newDeviceId && !restart)
        throw new Error("changing device requires restart");

      if (newDeviceId) {
        dispatch(changeAudioDevice(newDeviceId));
        selectedAudioDevice.current = newDeviceId;
      }

      dispatch(setAudioInProgress({ flag: true }));

      const deviceId = (await getAudioDeviceId()) as string;
      const device = audioDevices.current?.[deviceId];

      if (!device) throw new Error("no audio devices");

      if ((restart && micProducerRef.current) || start) {
        diconnectLocalHark();

        if (micProducerRef.current) await disableMic();

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { ideal: deviceId },
            sampleRate: 96000,
            channelCount: 1,
            echoCancellation: true,
            sampleSize: 16,
          },
        });

        [track] = stream.getAudioTracks();

        const { deviceId: trackDeviceId } = track.getSettings();

        dispatch(changeAudioDevice({ deviceId: trackDeviceId as string }));

        micProducerRef.current =
          (await sendTransportRef.current?.produce({
            track,
            codecOptions: {
              opusStereo: false,
              opusDtx: true,
              opusFec: true,
              opusPtime: 20,
              opusMaxPlaybackRate: 96000,
            },
            appData: { source: "mic" },
          })) ?? null;

        micProducerRef.current?.on("transportclose", () => {
          micProducerRef.current = null;
        });

        micProducerRef.current?.on("trackended", () => {
          disableMic();
        });

        connectLocalHark(track);
      } else if (micProducerRef.current) {
        ({ track } = micProducerRef.current);
      }

      await updateAudioDevices();
    } catch (error) {
      console.log(error);
    }
    dispatch(setAudioInProgress({ flag: false }));
    dispatch(setAudioMuted(false));
    isSpeaking.current = true;
  };

  const unmuteMic = async () => {
    if (!micProducerRef.current) {
      updateMic({ start: true });
    } else {
      micProducerRef.current.resume();

      try {
        await socket.current.request("resumeProducer", {
          producerId: micProducerId.current,
        });

        dispatch(setAudioMuted(false));
        isSpeaking.current = true;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const muteMic = async () => {
    micProducerRef.current?.pause();

    try {
      await socket.current.request("pauseProducer", {
        producerId: micProducerId.current,
      });

      dispatch(setAudioMuted(true));
      dispatch(setPeerVolume({ peerId: socket.current.id, volume: 0 }));
      isSpeaking.current = false;
    } catch (error) {
      console.log(error);
    }
  };

  const disableWebcam = async () => {
    if (!webcamProducerRef.current) return;

    dispatch(setWebcamInProgress({ flag: true }));

    webcamProducerRef.current.close();

    try {
      await socket.current.request("closeProducer", {
        producerId: webcamProducerId.current,
      });
    } catch (error) {
      console.log(error);
    }

    webcamProducerRef.current = null;
    setWebcamProducer(null);
    dispatch(setVideoMuted(true));
    dispatch(setWebcamInProgress({ flag: false }));
  };

  const updateWebcam = async ({
    start = false,
    restart = false,
    newDeviceId = null,
  }) => {
    let track;

    try {
      if (!mediasoupDeviceRef.current?.canProduce("video"))
        throw new Error("cannot produce video");

      if (newDeviceId) {
        dispatch(changeWebcam({ deviceId: newDeviceId }));
        selectedWebcam.current = newDeviceId;
      }

      dispatch(setVideoMuted(false));

      dispatch(setWebcamInProgress({ flag: true }));

      const deviceId = (await getWebcamDeviceId()) as string;
      const device = webcams.current?.[deviceId];

      if (!device) throw new Error("no webcam devices");

      const { resolution, frameRate } = settings;

      if ((restart && webcamProducerRef.current) || start) {
        if (webcamProducerRef.current) await disableWebcam();

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { ideal: deviceId },
            ...VIDEO_CONSTRAINS[resolution],
            frameRate,
          },
        });

        [track] = stream.getVideoTracks();

        const { deviceId: trackDeviceId } = track.getSettings();

        dispatch(changeWebcam({ deviceId: trackDeviceId as string }));

        const producer =
          (await sendTransportRef.current?.produce({
            track,
            codecOptions: { videoGoogleStartBitrate: 1000 },
            appData: { source: "webcam" },
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
          })) ?? null;

        webcamProducerRef.current = producer;
        setWebcamProducer(producer);

        webcamProducerRef.current?.on("transportclose", () => {
          webcamProducerRef.current = null;
          setWebcamProducer(null);
        });

        webcamProducerRef.current?.on("trackended", () => {
          disableWebcam();
        });
      } else if (webcamProducerRef.current) {
        ({ track } = webcamProducerRef.current);
      }

      await updateWebcams();
    } catch (error) {
      console.log(error);
    }
    dispatch(setWebcamInProgress({ flag: false }));
  };

  const disableScreenSharing = async () => {
    if (!screenProducerRef.current) return;

    dispatch(setScreenShareInProgress({ flag: true }));

    if (pin.current === "myscreen") unpinSpotlight();

    screenProducerRef.current.close();

    try {
      await socket.current.request("closeProducer", {
        producerId: screenProducerId.current,
      });
    } catch (error) {
      console.log(error);
    }

    if (
      screenProducerStreamRef.current &&
      screenProducerStreamRef.current instanceof MediaStream !== false
    ) {
      screenProducerStreamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());
      screenProducerStreamRef.current = null;
    }

    screenProducerRef.current = null;
    setScreenProducer(null);

    dispatch(setIsScreenSharing(false));
    dispatch(setScreenShareInProgress({ flag: false }));
  };

  const updateScreenSharing = async ({ start = false }) => {
    let track;

    try {
      if (!mediasoupDeviceRef.current?.canProduce("video"))
        throw new Error("cannot produce video");

      dispatch(setScreenShareInProgress({ flag: true }));

      const { screenSharingResolution, screenSharingFrameRate } = settings;

      if (start) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: {
            ...VIDEO_CONSTRAINS[screenSharingResolution],
            frameRate: screenSharingFrameRate,
          },
        });

        [track] = stream.getVideoTracks();
        screenProducerStreamRef.current = stream;

        const producer =
          (await sendTransportRef.current?.produce({
            track,
            appData: {
              source: "screen",
            },
          })) || null;

        screenProducerRef.current = producer;
        setScreenProducer(producer);

        producer?.on("transportclose", () => {
          screenProducerRef.current = null;
          setScreenProducer(null);
        });

        producer?.on("trackended", () => {
          disableScreenSharing();
        });

        dispatch(setIsScreenSharing(true));
      } else if (screenProducerRef.current) {
        ({ track } = screenProducerRef.current);
      }
    } catch (error) {
      console.log(error);

      if (track) track.stop();
    }
    dispatch(setScreenShareInProgress({ flag: false }));
  };

  useEffect(() => {
    socket.current = io(config.backendUrl, {
      withCredentials: true,
      query: {
        roomId,
        token,
      },
    }) as RoomSocket;

    socket.current.request = (method: RequestMethod, data = {}) => {
      return new Promise((resolve, reject) => {
        socket.current.emit(
          "request",
          { method, data },
          (returnedData: any) => {
            if (returnedData && returnedData.error) {
              reject(returnedData.error);
            } else {
              resolve(returnedData);
            }
          }
        );
      });
    };

    socket.current.on("connect", () => {
      setSocketConnected(true);
    });

    socket.current.once("initialized", () => {
      socket.current.request("getMyRoomInfo").then((roomData) => {
        updateRoomData(roomData);
        dispatch(setRoomState("connected"));
      });
    });

    socket.current.on("disconnect", (reason) => {
      switch (reason) {
        case "io client disconnect":
        case "io server disconnect": {
          close();
          break;
        }

        case "ping timeout":
        case "transport close":
        case "transport error": {
          toast("You lost your network connection. Trying to reconnect");
          break;
        }
      }
    });

    navigator.mediaDevices.addEventListener("devicechange", async () => {
      await updateAudioDevices();
      await updateWebcams();
    });

    return () => {
      close();
    };
  }, []);

  useEffect(() => {
    try {
      if (socketConnected) {
        //Listen to server request
        socket.current.on("request", async (request, cb) => {
          switch (request.method) {
            case "newConsumer": {
              const {
                peerId,
                producerId,
                id,
                kind,
                rtpParameters,
                appData,
                producerPaused,
              } = request.data;

              if (recvTransportRef.current) {
                const consumer = await recvTransportRef.current.consume({
                  id,
                  producerId,
                  kind,
                  rtpParameters,
                  appData: {
                    ...appData,
                    peerId,
                    remotelyPaused: producerPaused,
                    locallyPaused: false,
                  },
                });

                consumersRef.current[id] = consumer;

                consumer.on("transportclose", () => {
                  delete consumersRef.current[id];
                  setConsumers({ ...consumersRef.current });
                  dispatch(removePeerConsumer({ consumerId: id, peerId }));
                });

                if (appData.source === "screen") {
                  addScreenToSpotlight({
                    type: "screen",
                    peerId,
                  });
                }

                dispatch(setSpeaking({ peerId, flag: !producerPaused }));

                setConsumers({ ...consumersRef.current });
                dispatch(
                  addPeerConsumer({
                    consumerId: id,
                    peerId,
                    consumerType: appData.source,
                  })
                );

                if (kind === "audio") {
                  consumerHark.current[id] = {
                    hark: {} as Harker,
                    volume: 100,
                  };

                  const stream = new MediaStream();

                  stream.addTrack(consumer.track);

                  if (!stream.getAudioTracks()[0]) {
                    console.log(
                      "request.newConsumer | given stream has no audio track"
                    );
                    return;
                  }

                  consumerHark.current[id].hark = hark(stream, { play: false });

                  consumerHark.current[id].hark.on(
                    "volume_change",
                    (volume) => {
                      volume = Math.round(volume);

                      if (
                        consumerHark.current[id] &&
                        volume !== consumerHark.current[id].volume
                      ) {
                        consumerHark.current[id].volume = volume;

                        dispatch(setPeerVolume({ peerId, volume }));
                      }
                    }
                  );
                }

                cb(null);
              } else {
                console.log("newConsumer: no recv transport");
              }

              break;
            }

            case "acceptedPeer": {
              console.log(socket.current.id);

              await initTransport();

              const roomData = request.data;

              await joinRoom(roomData);

              cb();

              break;
            }

            default:
              console.log("unknown request method");
          }
        });

        //Listen to server notification
        socket.current.on("notification", async (notification) => {
          switch (notification.method) {
            case "consumerClosed": {
              const { consumerId } = notification.data;

              if (consumersRef.current) {
                const consumer = consumersRef.current[consumerId];

                if (!consumer) {
                  console.log("consumerClosed: no consumer");

                  break;
                }

                if (consumer.appData.source === "screen") {
                  removeScreenSpotlight(consumer.appData.peerId);
                }

                if (!_.isEmpty(consumerHark.current[consumerId])) {
                  consumerHark.current[consumerId].hark.stop();
                  delete consumerHark.current[consumerId];
                }

                consumer.close();

                delete consumersRef.current[consumerId];

                setConsumers({ ...consumersRef.current });

                dispatch(
                  removePeerConsumer({
                    consumerId,
                    peerId: consumer.appData.peerId,
                  })
                );
              }

              break;
            }

            case "consumerResumed": {
              const { consumerId } = notification.data;
              const consumer = consumersRef.current[consumerId];

              if (!consumer) break;

              if (consumer.kind === "audio") {
                dispatch(
                  setSpeaking({ peerId: consumer.appData.peerId, flag: true })
                );
              }

              consumer.resume();

              break;
            }

            case "consumerPaused": {
              const { consumerId } = notification.data;
              const consumer = consumersRef.current[consumerId];

              if (!consumer) break;

              if (consumer.kind === "audio") {
                dispatch(
                  setSpeaking({ peerId: consumer.appData.peerId, flag: false })
                );
              }

              consumer.pause();

              break;
            }

            case "newPeer": {
              dispatch(addPeer({ peer: notification.data }));

              addPeerToSpotlight(notification.data.id);
              break;
            }

            case "peerLeave": {
              removePeerSpotlight(notification.data.peerId);

              dispatch(removePeer({ peerId: notification.data.peerId }));
              break;
            }

            case "askToJoin": {
              dispatch(addRequestPeer({ peer: notification.data }));
              askToJoinAlert.current &&
                (
                  askToJoinAlert.current.cloneNode(true) as HTMLVideoElement
                ).play();
              break;
            }

            case "askToJoinPeerLeave": {
              dispatch(removeRequestPeer({ peerId: notification.data.peerId }));

              break;
            }

            case "askToJoinPeerAllLeave": {
              dispatch(clearRequestPeer());

              break;
            }

            case "deniedPeer": {
              dispatch(setRoomState("denied"));

              socket.current.disconnect();

              break;
            }

            case "activeSpeaker": {
              const { peerId } = notification.data;

              dispatch(setActiveSpeaker(peerId));

              if (peerId && peerId !== socket.current.id) {
              }

              break;
            }

            case "chatMessage": {
              dispatch(
                addMessage({
                  ...notification.data,
                  timestamp: moment(Date.now()).format("HH:mm A"),
                })
              );

              messageAlert.current &&
                (
                  messageAlert.current.cloneNode(true) as HTMLAudioElement
                ).play();

              break;
            }

            case "raisedHand": {
              const { peerId } = notification.data;

              dispatch(setHand({ peerId, flag: true }));

              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              break;
            }

            case "lowerHand": {
              const { peerId } = notification.data;

              dispatch(setHand({ peerId, flag: false }));

              break;
            }

            case "newQuestion": {
              const question = notification.data;

              dispatch(addQuestion(question));
              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              break;
            }

            case "upvoteQuestion": {
              const { questionId, upvotes, isVoted } = notification.data;

              dispatch(
                upvoteQuestion({
                  questionId,
                  isVoted,
                  upvotes,
                })
              );

              break;
            }

            case "deleteQuestion": {
              const { questionId } = notification.data;

              dispatch(removeQuestion({ questionId }));
              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              break;
            }

            case "replyQuestion": {
              const { questionId, reply } = notification.data;

              dispatch(replyQuestion({ questionId, reply }));

              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              break;
            }

            case "newPoll": {
              const newPoll = notification.data;

              dispatch(addPoll(newPoll));
              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              toast("Host has created a new poll");

              break;
            }

            case "votePoll": {
              const newPoll = notification.data;

              dispatch(addPoll(newPoll));

              break;
            }

            case "pollClosed": {
              const { pollId } = notification.data;
              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              dispatch(closePoll({ pollId }));

              break;
            }

            case "pollOpened": {
              const { pollId } = notification.data;
              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              dispatch(openPoll({ pollId }));

              break;
            }

            case "deletePoll": {
              const { pollId } = notification.data;
              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              dispatch(removePoll({ pollId }));

              break;
            }

            case "host:mute": {
              muteMic();

              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              toast("You have been muted by the host");
              break;
            }

            case "host:stopVideo": {
              disableWebcam();
              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              toast("You have been stopped webcam by the host");
              break;
            }

            case "host:stopScreenSharing": {
              disableScreenSharing();
              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              toast("You have been stopped screensharing by the host");
              break;
            }

            case "host:lowerHand": {
              await socket.current.request("lowerHand");

              dispatch(setRaiseHand(false));

              notificationSound.current &&
                (
                  notificationSound.current.cloneNode(true) as HTMLAudioElement
                ).play();

              toast("You have been lowered hand by the host");
              break;
            }

            case "host:kick": {
              close();
              break;
            }

            case "host:turnOnScreenSharing": {
              dispatch(setRoomAllowScreenshare(true));
              roomPermissions.current.add("SHARE_SCREEN");
              break;
            }

            case "host:turnOffScreenSharing": {
              await disableScreenSharing();
              dispatch(setRoomAllowScreenshare(false));
              roomPermissions.current.delete("SHARE_SCREEN");
              break;
            }

            case "host:turnOnChat": {
              dispatch(setRoomAllowChat(true));
              break;
            }
            case "host:turnOffChat": {
              dispatch(setRoomAllowChat(false));
              break;
            }
            case "host:turnOnMicrophone": {
              dispatch(setRoomAllowMicrophone(true));
              roomPermissions.current.add("SHARE_AUDIO");
              break;
            }
            case "host:turnOffMicrophone": {
              await disableMic();
              dispatch(setRoomAllowMicrophone(false));
              roomPermissions.current.delete("SHARE_AUDIO");
              break;
            }
            case "host:turnOnVideo": {
              dispatch(setRoomAllowCamera(true));
              roomPermissions.current.add("SHARE_VIDEO");
              break;
            }
            case "host:turnOffVideo": {
              await disableWebcam();
              dispatch(setRoomAllowCamera(false));
              roomPermissions.current.delete("SHARE_VIDEO");
              break;
            }

            case "host:turnOnQuestion": {
              dispatch(setRoomAllowQuestion(true));
              break;
            }

            case "host:turnOffQuestion": {
              dispatch(setRoomAllowQuestion(false));
              break;
            }

            case "host:turnOnRaisehand": {
              dispatch(setRoomAllowRaiseHand(true));
              break;
            }

            case "host:turnOffRaisehand": {
              dispatch(setRoomAllowRaiseHand(false));
              break;
            }

            default: {
              console.log("unknown notification", {
                method: notification.method,
              });
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [socketConnected]);

  return (
    <RoomContext.Provider
      value={{
        handleJoinRoom,
        muteMic,
        unmuteMic,
        socket: socket.current,
        consumers,
        disableWebcam,
        updateWebcam,
        updateMic,
        changeMaxSpotlights,
        webcamProducer,
        addPeerToSpotlight,
        updateScreenSharing,
        screenProducer,
        disableScreenSharing,
        pinSpotlight,
        unpinSpotlight,
        close,
      }}
    >
      {room.inRoom ? <JoinedRoom /> : <Lobby />}
    </RoomContext.Provider>
  );
};

const MeetingRoom: NextPage = ({ room, token }: any) => {
  if (!room || !token) return <MeetingNotFound />;

  return <MeetingRoomPage roomId={room.id} token={token} />;
};

export default MeetingRoom;
