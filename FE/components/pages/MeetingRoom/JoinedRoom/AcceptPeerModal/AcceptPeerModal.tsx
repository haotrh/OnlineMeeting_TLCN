import _ from "lodash";
import { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import {
  addRequestPeers,
  clearRequestPeer,
  removeRequestPeer,
} from "../../../../../lib/redux/slices/requestPeers.slice";
import Modal from "../../../../common/Modal/Modal";
import { RoomContext } from "../../../../contexts/RoomContext";

export const AcceptPeerModal = () => {
  const { socket } = useContext(RoomContext);

  const requestPeers = useAppSelector((selector) => selector.requestPeers);

  const dispatch = useAppDispatch();

  const denyOne = (peerId: string) => {
    socket.request("denyPeer", { peerId });
  };

  const denyAll = () => {
    socket.request("denyAllPeers");
  };

  const acceptOne = (peerId: string) => {
    socket.request("acceptPeer", { peerId }).then(() => {
      dispatch(removeRequestPeer({ peerId }));
    });
  };

  const acceptAll = () => {
    socket.request("acceptAllPeers").then(() => {
      dispatch(clearRequestPeer());
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
        {_.values(requestPeers).map((peer) => (
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
        {_.values(requestPeers).map((peer) => (
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
            if (Object.keys(requestPeers).length === 1) {
              denyOne(requestPeers[0].id);
            } else {
              denyAll();
            }
          }}
          className="font-semibold hover:text-blue-700 transition-colors"
        >
          {Object.keys(requestPeers).length === 1 ? "Deny entry" : "Deny all"}
        </button>
        <button
          onClick={() => {
            if (Object.keys(requestPeers).length === 1) {
              acceptOne(Object.keys(requestPeers)[0]);
            } else {
              acceptAll();
            }
          }}
          className="font-semibold hover:text-blue-700 transition-colors"
        >
          {Object.keys(requestPeers).length === 1 ? "Accept" : "Accept all"}
        </button>
      </div>
    </Modal>
  );
};
