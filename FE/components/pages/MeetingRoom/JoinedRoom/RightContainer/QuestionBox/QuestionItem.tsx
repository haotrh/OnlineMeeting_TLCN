import classNames from "classnames";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-autosize-textarea/lib";
import { AiFillCaretUp } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { IoRemoveCircleOutline, IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/redux";
import {
  removeQuestion,
  replyQuestion,
  upvoteQuestion,
} from "../../../../../../lib/redux/slices/questions.slice";
import { Question } from "../../../../../../types/room.type";
import Button from "../../../../../common/Button/Button";
import Popover from "../../../../../common/Popover/Popover";
import { RoomContext } from "../../../../../contexts/RoomContext";
import Avatar from "../../../../../global/Avatar/Avatar";
import { ParticipantTag } from "../ParticipantBox/ParticipantTag";

const QuestionItem = ({ question }: { question: Question }) => {
  const isHost = useAppSelector((selector) => selector.me.info.isHost);
  const authId = useAppSelector((selector) => selector.me.info.authId);

  const [upvoting, setUpvoting] = useState(false);
  const [isAnswer, setIsAnswer] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answering, setAnswering] = useState(false);
  const [showQuestionOptions, setShowQuestionOptions] = useState(false);
  const [showAnswerOptions, setShowAnswerOptions] = useState(false);
  const [questionSince, setQuestionSince] = useState(
    moment(question.timestamp).fromNow()
  );
  const [answerSince, setAnswerSince] = useState(
    moment(question?.reply?.timestamp ?? 0).fromNow()
  );
  const intervalRef = useRef<number | null>(null);

  const { socket } = useContext(RoomContext);
  const dispatch = useAppDispatch();

  const handleUpvote = async () => {
    setUpvoting(true);
    try {
      const { upvotes, isVoted } = await socket.request("upvoteQuestion", {
        questionId: question.id,
      });

      dispatch(upvoteQuestion({ isVoted, upvotes, questionId: question.id }));
    } catch (error) {
      toast(error as string);
    }
    setUpvoting(false);
  };

  const handleAnswer = async () => {
    setAnswering(true);
    try {
      const reply = await socket.request("host:replyQuestion", {
        questionId: question.id,
        answer,
      });

      dispatch(replyQuestion({ questionId: question.id, reply }));

      setAnswer("");
      setIsAnswer(false);
      setAnswerSince(moment(reply.timestamp).fromNow());
    } catch (error) {
      toast(error as string);
    }
    setAnswering(false);
  };

  const handleDeleteQuestion = async () => {
    try {
      await socket.request("host:deleteQuestion", {
        questionId: question.id,
      });

      dispatch(removeQuestion({ questionId: question.id }));
    } catch (error) {
      toast(error as string);
    }
  };

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setQuestionSince(moment(question.timestamp).fromNow());
      question.reply &&
        setAnswerSince(moment(question.reply.timestamp).fromNow());
    }, 60000);

    return () => {
      window.clearInterval(intervalRef.current || 0);
    };
  }, []);

  return (
    <div>
      <div className="whitespace-pre-wrap flex text-gray-700 mb-4">
        <div className="flex-shrink-0 mr-2">
          <Button
            disabled={upvoting}
            onClick={handleUpvote}
            base="custom"
            className={classNames(
              "w-8 h-8 border rounded-md flex-center flex-col transition-colors",
              {
                "bg-blue-100/50 border-blue-100 hover:bg-blue-100/75 transition-colors text-blue-600":
                  question.isVoted,
                " hover:bg-gray-50": !question.isVoted,
              }
            )}
          >
            <AiFillCaretUp className="flex-shrink-0" size={11} />
            <div className="text-xs font-semibold leading-3">
              {question.upvotes}
            </div>
          </Button>
        </div>
        <div className="flex-1 pt-0.5 min-w-0">
          {/* Question section */}
          <div className="flex group">
            <div className="flex flex-1 min-w-0">
              <div className="flex-shrink-0 mr-2">
                <Avatar
                  src={question.user.profilePic}
                  name={question.user.displayName}
                  size={32}
                />
              </div>
              <div className="flex-1 min-w-0 text-sm flex-col flex">
                <div className="font-bold flex items-center space-x-2">
                  <div>{question.user.displayName}</div>
                  {authId === question.user.id && <ParticipantTag name="You" />}
                </div>
                <div className="font-medium whitespace-pre-wrap text-[13px] flex-1 min-w-0 break-words w-full">
                  {question.question}
                </div>
                <div className="text-sm font-medium text-gray-500 mt-1">
                  {questionSince}
                </div>
              </div>
            </div>
            {/* Host action (remove) */}
            {isHost && (
              <Popover
                onClickOutside={() => setShowQuestionOptions(false)}
                interactive={true}
                visible={showQuestionOptions}
                placement="bottom-start"
                offset={[0, 0]}
                content={
                  <div onClick={() => setShowQuestionOptions(false)}>
                    <button
                      onClick={handleDeleteQuestion}
                      className="bg-white py-1 px-2 shadow-md border rounded text-sm font-semibold cursor-pointer
                  hover:bg-blue-50 hover:text-blue-700 transition-all flex items-center"
                    >
                      <IoRemoveCircleOutline size={18} className="mr-2" />
                      <div>Delete question</div>
                    </button>
                  </div>
                }
              >
                <div className="group-hover:opacity-100 opacity-0 transition-all">
                  <button
                    onClick={() => setShowQuestionOptions(!showQuestionOptions)}
                    className="p-1"
                  >
                    <BsThreeDotsVertical />
                  </button>
                </div>
              </Popover>
            )}
          </div>
          {/* Answer section */}
          {question.reply && !isAnswer && (
            <div
              className="group bg-gray-100 p-2 mt-2 rounded-md text-sm whitespace-pre-wrap
            font-medium flex space-x-2"
            >
              <div className="flex-1">
                <div className="font-bold mb-1">
                  Host answer ({answerSince}):
                </div>
                <div>{question.reply.answer}</div>
              </div>
              {/* Host option to answer */}
              {isHost && (
                <Popover
                  onClickOutside={() => setShowAnswerOptions(false)}
                  interactive={true}
                  visible={showAnswerOptions}
                  placement="bottom-start"
                  offset={[0, 0]}
                  content={
                    <div onClick={() => setShowAnswerOptions(false)}>
                      <button
                        onClick={() => {
                          setAnswer(question.reply.answer);
                          setIsAnswer(true);
                        }}
                        className="bg-white py-1 px-2 shadow-md border rounded text-sm font-semibold cursor-pointer
                  hover:bg-blue-50 hover:text-blue-700 transition-all flex items-center"
                      >
                        <FiEdit className="mr-2" />
                        <div>Edit answer</div>
                      </button>
                    </div>
                  }
                >
                  <div className="group-hover:opacity-100 opacity-0 transition-all">
                    <button
                      onClick={() => setShowAnswerOptions(!showAnswerOptions)}
                      className="p-1"
                    >
                      <BsThreeDotsVertical size={16} />
                    </button>
                  </div>
                </Popover>
              )}
            </div>
          )}
          {/* Host answer section */}
          {isHost && (!question.reply || isAnswer) && (
            <div className="rounded-md border overflow-hidden mt-2 text-sm font-medium">
              {!isAnswer ? (
                <div
                  onClick={() => setIsAnswer(true)}
                  className="select-none py-1 px-2 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  Type your answer...
                </div>
              ) : (
                <div>
                  <TextareaAutosize
                    readOnly={answering}
                    placeholder="Enter your answer..."
                    value={answer}
                    onChange={(e) =>
                      setAnswer((e.target as HTMLTextAreaElement).value)
                    }
                    className="w-full resize-none focus:outline-none p-2 scrollbar1"
                    rows={3}
                    maxRows={8}
                  />
                  <div className="flex items-center justify-between p-2 -mt-3">
                    <button
                      className="font-semibold"
                      onClick={() => setIsAnswer(false)}
                    >
                      Close
                    </button>
                    <Button
                      disabled={answering}
                      onClick={handleAnswer}
                      base="custom"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <IoSend size={18} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <hr />
    </div>
  );
};

export default QuestionItem;
