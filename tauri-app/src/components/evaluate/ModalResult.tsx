import { ArrowRight, VolumeOff, Volume2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useSpeech } from "@/context/speech";
import clsx from "clsx";
import DropDown from "@/components/container/DropDown";
import { useChat } from "@/context/main/chat";
import { useNavigate } from "react-router";
import Button from "../Button";
import Markdown from "../Markdown";
import ModalView from "../rubric/ModalView";
import { Rubric } from "@/database/rubric";
import BaseModal from "../container/BaseModal";

interface IModalResult {
  score: number;
  totalScore?: number;
  justification: string;
  answer: string;
  question?: string;
  rubric?: Rubric;
  onClose: (param?: { re_evaluate: boolean }) => void;
  isVisible: boolean;
}

const ModalResult = ({
  onClose,
  score,
  totalScore = 10,
  justification,
  question,
  answer,
  rubric,
  isVisible,
}: IModalResult) => {
  const navigate = useNavigate();
  const { talk, ask, cancelTalk, cancelAsk } = useSpeech();
  const { sendMessage } = useChat();
  const [isSpeeching, setIsSpeeching] = useState(false);
  const [showRubricModal, setShowRubricModal] = useState(false);

  const createConversation = async () => {
    cancelInteract();
    await navigate("/chat", {});
    onClose();
    await sendMessage(
      `Hello, Lets discuss about the topics related to this question: "${question}"`,
      true
    );
  };

  const interact = async () => {
    if (justification) {
      setIsSpeeching(true);
      await talk(
        `You've got the score of ${score} out of ${totalScore}. It is because: `.concat(
          justification
        )
      );

      const isCreateConversation = await ask(
        "Are you interested about this topic? Please answer in Yes or No."
      );
      setIsSpeeching(false);

      if (isCreateConversation) createConversation();
    }
  };

  const cancelInteract = () => {
    setIsSpeeching(false);
    cancelAsk();
    cancelTalk();
  };

  useEffect(() => {
    if (isVisible) {
      interact();
    } else {
      cancelInteract();
    }
  }, [isVisible]);

  return (
    <BaseModal
      isOpen={isVisible}
      onClose={() => onClose()}
      title="Result"
      panelClassName="max-w-5xl"
    >
      {/* Score and Justification */}
      <div className="flex flex-col md:flex-row items-center gap-6 w-full p-6">
        <div
          className={clsx(
            "px-10 py-14 text-5xl font-extrabold text-uGray",
            `bg-score-${Math.round((score / totalScore) * 10)}`,
            "rounded-lg text-center shadow-sm",
            "flex flex-row items-end"
          )}
        >
          <div>{score}</div>
          <div className="text-lg text-uGrayLight">/ {totalScore}</div>
        </div>
        <ArrowRight className="hidden md:block h-10 w-10 text-uGrayLight" />
        <div
          className={clsx(
            "flex-1 flex flex-col gap-3 pr-1",
            "text-base text-uGrayLight font-mono",
            "shadow-md"
          )}
        >
          <div className="relative overflow-hidden">
            <div className=" pb-4 max-h-72 overflow-y-auto shadow-md rounded-md bg-background">
              {/* Sticky Header */}
              <div
                className={clsx(
                  "sticky top-0 z-10 py-4 px-4",
                  "bg-panel/80 backdrop-blur-sm border-b border-uGrayLight",
                  "flex flex-row gap-1 items-center"
                )}
              >
                <p className="font-semibold text-lg">Justification</p>
                <Button
                  onClick={isSpeeching ? cancelInteract : interact}
                  secondary
                  className="p-0"
                >
                  {isSpeeching ? <VolumeOff /> : <Volume2 />}
                </Button>
              </div>
              <div className="px-4">
                <Markdown text={justification} />
                <div className="h-8" />
              </div>
            </div>

            {/* Gradient overlay */}
            <div
              className={clsx(
                "pointer-events-none absolute bottom-0 left-0 right-0 h-8",
                "bg-gradient-to-t from-background to-transparent",
                "rounded-b-md"
              )}
            />
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "flex flex-row w-full justify-center gap-1",
          "text-lg text-uGrayLight"
        )}
      >
        <p>Interested with this topic?</p>
        <button
          className="underline underline-offset-2 hover:text-primary"
          onClick={createConversation}
        >
          Continue to Chat.
        </button>
      </div>

      {/* Inputs Section */}

      <DropDown
        containerClassName="border-t py-2 p-6"
        headerElement={
          <div className="flex flex-row flex-between">
            <p className="text-lg font-semibold text-uGray">Evaluation Input</p>
          </div>
        }
      >
        <div className="w-full flex flex-col gap-4">
          <div className="relative">
            <table
              className={clsx(
                "w-full overflow-y-auto max-h-28",
                "rounded-md p-4 shadow-md",
                "text-uGrayLight text-sm",
                "table-fixed"
              )}
            >
              <tbody>
                <tr>
                  <th className="font-semibold text-left w-24 align-top pb-2">
                    QUESTION
                  </th>
                  <td className="font-mono truncate">{question!}</td>
                </tr>
                <tr>
                  <th className="font-semibold text-left w-24 align-top pt-2">
                    ANSWER
                  </th>
                  <td className="font-mono">{answer}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-row gap-4 items-center justify-between">
            <div className="flex flex-row gap-4 items-center">
              {rubric && (
                <Button onClick={() => setShowRubricModal(true)} secondary>
                  <FileText className="w-4 h-4" />
                  View Rubric
                </Button>
              )}
            </div>
            <div className="flex flex-row gap-4 items-center">
              <p className="text-uGrayLight text-base italic">
                Not satisfied with the score?
              </p>
              <Button
                title="Evaluate Again"
                onClick={() => onClose({ re_evaluate: true })}
              />
            </div>
          </div>
        </div>
      </DropDown>
      {/* Rubric Modal */}
      <ModalView
        rubric={showRubricModal ? rubric || null : null}
        onClose={() => setShowRubricModal(false)}
      />
    </BaseModal>
  );
};

export default ModalResult;
