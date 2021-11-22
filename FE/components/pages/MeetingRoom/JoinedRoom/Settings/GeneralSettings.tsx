import Button from "../../../../common/Button/Button";

const GeneralSettings = () => {
  return (
    <div className="py-2 px-6 space-y-4 select-none">
      <div className="text-[13px] mb-7 font-semibold text-gray-500">
        LET EVERYONE
      </div>
      <div className="space-y-7 text-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-[17px] mb-1">
              Share their screen
            </div>
            <div className="font-medium text-[15px]">
              When turned off, only hosts can share their screen
            </div>
          </div>
          <div>
            <Button>On</Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-[17px] mb-1">
              Send chat messages
            </div>
            <div className="font-medium text-[15px]">
              When turned off, only hosts can send chat messages
            </div>
          </div>
          <div>
            <Button>On</Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-[17px] mb-1">
              Turn on their microphone
            </div>
            <div className="font-medium text-[15px]">
              When turned off, only hosts can turn on their microphone
            </div>
          </div>
          <div>
            <Button>On</Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-[17px] mb-1">
              Turn on their video
            </div>
            <div className="font-medium text-[15px]">
              When turned off, only hosts can turn on their video
            </div>
          </div>
          <div>
            <Button>On</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
