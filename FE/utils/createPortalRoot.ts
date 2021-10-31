const createPortalRoot = () => {
  const root = document.createElement("div");
  root.setAttribute("id", "portal-root");
  return root
};

export default createPortalRoot