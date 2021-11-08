import _ from "lodash";
import { useContext } from "react";
import Modal from "../../../../common/Modal/Modal";
import { RoomContext } from "../../../../contexts/RoomContext";

export const AcceptPeerModal = () => {
  const { roomInfo, socket, requestPeers, setRequestPeers } =
    useContext(RoomContext);

  const denyOne = (peerId: string) => {
    socket.request("denyPeer", { peerId }).then(() => {
      setRequestPeers(
        roomInfo.requestPeers?.filter((peer) => peer.id !== peerId) || null
      );
    });
  };

  const denyAll = () => {
    socket.request("denyAllPeers").then(() => {
      setRequestPeers([]);
    });
  };

  const acceptOne = (peerId: string) => {
    socket.request("acceptPeer", { peerId }).then(() => {
      setRequestPeers(
        roomInfo.requestPeers?.filter((peer) => peer.id !== peerId) || null
      );
    });
  };

  const acceptAll = () => {
    socket.request("acceptAllPeers").then(() => {
      setRequestPeers([]);
    });
  };

  return (
    <Modal
      className="bg-white mt-20 py-3 px-5 rounded-md w-[400px]"
      isOpen={!_.isEmpty(requestPeers)}
      onClose={() => {}}
    >
      <h2 className="text-[17px] font-semibold text-gray-800 mb-4">
        Someone wants to join this meeting
      </h2>
      <div className="mb-3 space-y-3">
        {requestPeers?.map((peer) => (
          <div className="flex items-center" key={`requestPeer${peer.id}`}>
            <div>
              <img
                className="w-8 h-8 rounded-full mr-2"
                src={peer.picture}
                alt="avatar"
              />
            </div>
            <div className="text-sm text-gray-600 font-semibold">
              {peer.name}
            </div>
          </div>
        ))}
        {requestPeers?.map((peer) => (
          <div className="flex items-center" key={`requestPeer${peer.id}`}>
            <div>
              <img
                className="w-8 h-8 rounded-full mr-2"
                src={peer.picture}
                alt="avatar"
              />
            </div>
            <div className="text-sm text-gray-600 font-semibold">
              {peer.name}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end text-[13px] space-x-5 text-blue-600 font-be">
        <button
          onClick={() => {
            if (requestPeers?.length === 1) {
              denyOne(requestPeers[0].id);
            } else {
              denyAll();
            }
          }}
          className="font-semibold hover:text-blue-700 transition-colors"
        >
          {requestPeers?.length === 1 ? "Deny entry" : "Deny all"}
        </button>
        <button
          onClick={() => {
            if (requestPeers?.length === 1) {
              acceptOne(requestPeers[0].id);
            } else {
              acceptAll();
            }
          }}
          className="font-semibold hover:text-blue-700 transition-colors"
        >
          {requestPeers?.length === 1 ? "Accept" : "Accept all"}
        </button>
      </div>
    </Modal>
  );
};
