import _ from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AiOutlineSearch } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { useQuery } from "react-query";
import { searchUsers } from "../../../../lib/serverApi/user.api";
import useDebounce from "../../../../hooks/useDebounce";
import useOnClickOutside from "../../../../hooks/useOnClickOutside";
import { User } from "../../../../types/user.type";
import Input from "../../../common/Input/Input";
import Avatar from "../../../global/Avatar/Avatar";
import CircularLoading from "../../../global/Loading/CircularLoading";
import { MeetingFormData } from "./MeetingDrawer";

interface MeetingSearchUsersProps {
  readOnly: boolean;
}

const useUsers = (email: string, userId: string) => {
  return useQuery<User[]>(
    ["users", { email }],
    () => searchUsers(email, userId, true, 5, 0),
    {
      refetchOnWindowFocus: false,
      refetchInterval: Infinity,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );
};

const MeetingSearchUsers = ({ readOnly }: MeetingSearchUsersProps) => {
  const user = useSession().data?.user;
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);
  const { data, isLoading } = useUsers(debounceSearch, user?.id ?? "0");

  const [showResult, setShowResult] = useState(false);
  const searchRef = useRef(null);
  const onClickOutside = useCallback(() => {
    setShowResult(false);
  }, []);
  useOnClickOutside(searchRef, onClickOutside);

  const { control } = useFormContext<MeetingFormData>();
  const { append, fields, remove } = useFieldArray({
    name: "guests",
    keyName: "fieldId",
    control,
  });
  const onSelect = (user: User) => {
    setSearch("");
    setShowResult(false);
    if (fields.findIndex((field) => field.id === user.id) === -1) append(user);
  };

  return (
    <div>
      <label className="font-bold block mb-2">Guests</label>
      <div ref={searchRef} className="relative z-40">
        {!readOnly && (
          <Input
            autoComplete="new-password"
            onFocus={() => setShowResult(true)}
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            placeholder="Enter guest email"
          />
        )}
        {!_.isEmpty(search) && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-0 top-0 h-full flex-center px-2 transition-colors text-gray-500 hover:text-gray-700"
          >
            <MdClose />
          </button>
        )}
        {showResult && (
          <div className="absolute font-quicksand select-none top-full left-0 p-3 w-full rounded-md shadow-lg drop-shadow-sm mt-2 bg-white">
            {_.isEmpty(debounceSearch) ? (
              <div className="flex items-center space-x-2 text-sm font-semibold">
                <AiOutlineSearch size={18} />
                <div>Type guest email you want to find</div>
              </div>
            ) : isLoading ? (
              <div className="flex-center py-2">
                <CircularLoading size={25} />
              </div>
            ) : !data ? (
              <div>Error</div>
            ) : _.isEmpty(data) ? (
              <div className="flex items-center space-x-2 text-sm font-semibold">
                <AiOutlineSearch size={18} />
                <div>
                  We couldn&apos;t find any results for {`"${debounceSearch}"`}.
                </div>
              </div>
            ) : (
              data.map((user) => (
                <div
                  onClick={() => onSelect(user)}
                  key={`search${user.id}`}
                  className="flex hover:bg-indigo-50 p-2 rounded-lg hover:text-indigo-600 transition-colors cursor-pointer font-medium"
                >
                  <Avatar
                    className="mr-3"
                    src={user.profilePic}
                    name={user.displayName}
                    size={32}
                  />
                  <div className="">
                    <div className="text-[15px] leading-4 font-semibold mb-0.5">
                      {user.displayName}
                    </div>
                    <div className="text-[13px]">{user.email}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {!_.isEmpty(fields) && (
        // 260px = height of 4 guests
        <div className="space-y-3 mt-3 p-3 bg-gray-100 rounded-lg max-h-[260px] scrollbar1 overflow-y-auto">
          {fields.map((user, index) => (
            <div
              key={user.fieldId}
              className="flex justify-between items-center"
            >
              <div className="flex font-medium">
                <Avatar
                  className="mr-3"
                  src={user.profilePic}
                  name={user.displayName}
                  size={32}
                />
                <div className="">
                  <div className="text-[15px] leading-4 font-semibold mb-0.5">
                    {user.displayName}
                  </div>
                  <div className="text-[13px]">{user.email}</div>
                </div>
              </div>
              {!readOnly && (
                <button
                  onClick={() => remove(index)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <MdClose size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingSearchUsers;
