import classNames from "classnames";
import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/redux";
import { addQuestions } from "../../../../../../lib/redux/slices/questions.slice";
import Button from "../../../../../common/Button/Button";
import { Select } from "../../../../../common/Select/Select";
import { RoomContext } from "../../../../../contexts/RoomContext";
import CircularLoading from "../../../../../global/Loading/CircularLoading";
import QuestionItem from "./QuestionItem";
import QuestionModal from "./QuestionModal";

interface QuestionProps {
  hidden: boolean;
}

type QuestionBoxState = "loading" | "error" | "loaded";

type OrderByType =
  | "newest"
  | "oldest"
  | "upvotes"
  | "answered"
  | "not answered";

const orderByOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Upvotes", value: "upvotes" },
  { label: "Answered", value: "answered" },
  { label: "Not answered", value: "not answered" },
];

const optionDirection: {
  [orderBy: string]: "asc" | "desc";
} = {
  newest: "desc",
  oldest: "asc",
  upvotes: "desc",
  answered: "desc",
  "not answered": "asc",
};

const QuestionBox = ({ hidden }: QuestionProps) => {
  const [questionBoxState, setQuestionBoxState] =
    useState<QuestionBoxState>("loading");
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [orderBy, setOrderBy] = useState<OrderByType>("newest");

  console.log(orderBy);

  const { socket } = useContext(RoomContext);
  const dispatch = useAppDispatch();

  const questions = useAppSelector((selector) => selector.questions);

  const getQuestions = async () => {
    try {
      setQuestionBoxState("loading");
      const questions = await socket.request("getQuestions");
      dispatch(addQuestions(questions));
      setQuestionBoxState("loaded");
    } catch (error) {
      console.log(error);
      setQuestionBoxState("error");
    }
  };

  useEffect(() => {
    if (!hidden && questionBoxState === "loading") {
      (async () => {
        await getQuestions();
      })();
    }
  }, [hidden]);

  return (
    <>
      {!_.isEmpty(questions) && (
        <div
          className={classNames(
            "border-b flex items-end p-4 text-sm font-semibold",
            { hidden: hidden }
          )}
        >
          <div>Order by</div>
          <div>&nbsp;</div>
          <Select
            className="font-bold"
            onChange={(v) => setOrderBy(v)}
            options={orderByOptions}
          />
        </div>
      )}
      <div
        className={classNames(
          "flex-1 p-4 overflow-y-auto space-y-2 scrollbar1 overflow-x-hidden text-gray-900",
          { hidden: hidden }
        )}
      >
        {questionBoxState === "loading" && (
          <div className="h-full flex-center">
            <div>Loading</div>
            <CircularLoading size={32} />
          </div>
        )}
        {questionBoxState === "error" && (
          <div className="p-10 text-center">
            <h2 className="font-bold text-[15px] mb-4">
              Failed to load questions
            </h2>
            <div>
              <Button
                onClick={getQuestions}
                className="font-semibold"
                base="light-primary"
              >
                Try again
              </Button>
            </div>
          </div>
        )}
        {questionBoxState === "loaded" && (
          <>
            {/* No question */}
            {_.isEmpty(questions) && (
              <div className="p-10 text-center space-y-4 text-[15px]">
                <h2 className="font-bold">Nobody has asked a question yet</h2>
                <div className="font-medium">
                  Participants can send questions here. Questions will last
                  until the room is closed.
                </div>
              </div>
            )}
            {/* Have question */}
            {!_.isEmpty(questions) && (
              <>
                <div className="space-y-4">
                  {_.orderBy(
                    _.values(questions),
                    [
                      (question) => {
                        switch (orderBy) {
                          case "answered":
                          case "not answered":
                            return !_.isEmpty(question.reply);
                          case "newest":
                          case "oldest":
                            return question.timestamp;
                          case "upvotes":
                            return question.upvotes;
                        }
                      },
                    ],
                    optionDirection[orderBy]
                  ).map((question) => (
                    <QuestionItem key={question.id} question={question} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className={classNames({ hidden })}>
        <div className="flex-center bg-white p-3 border-t border-gray-200">
          <Button
            onClick={() => setIsOpenModal(true)}
            className="font-semibold"
          >
            Ask a new question
          </Button>
        </div>
      </div>
      <QuestionModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
    </>
  );
};

export default QuestionBox;
