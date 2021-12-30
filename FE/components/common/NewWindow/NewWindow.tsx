import { useRef } from "react";
import ReactDOM from "react-dom";

const NewWindow = () => {
  const container = useRef(document.createElement("div"));

  return ReactDOM.createPortal(<div></div>, container.current);
};

export default NewWindow;
