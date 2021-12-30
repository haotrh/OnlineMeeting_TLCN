import Button from "../../../../common/Button/Button";

const BreakoutRoomsControl = () => {
  return (
    <div className="flex justify-between p-2 border-t">
      <div>
        <Button>Options</Button>
      </div>
      <div className="flex space-x-2">
        <Button>Add a Room</Button>
        <Button>Open All Rooms</Button>
      </div>
    </div>
  );
};

export default BreakoutRoomsControl;
