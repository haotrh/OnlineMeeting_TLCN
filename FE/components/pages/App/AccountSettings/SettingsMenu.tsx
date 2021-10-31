import SettingsMenuLink from "./SettingsMenuLink";

const SettingsMenu = () => {
  return (
    <div className="py-10 space-y-3">
      <SettingsMenuLink name="My settings" value="user-settings" />
      <SettingsMenuLink name="My profile" value="user-profile" />
    </div>
  );
};

export default SettingsMenu;
