export interface Peer {
  name: string;
  picture: string;
  id: string;
  authId: string;
  isHost: boolean;
  raisedHand: boolean;
}

export interface Room {
  name: string;
  id: string;
  peers: Peer[];
  requestPeers: Peer[] | null;
  allowCamera: boolean;
  allowChat: boolean;
  allowMicrophone: boolean;
  allowScreenShare: boolean;
  allowToJoin: boolean;
}

export interface CreateRoom {
  name: string;
}
