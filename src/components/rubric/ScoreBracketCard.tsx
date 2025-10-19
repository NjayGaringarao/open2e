import { ScoreBracket } from "@/types/rubric";
import { Trash2, Edit } from "lucide-react";
import { useState } from "react";
import ModalViewBracket from "./ModalViewBracket";

interface ScoreBracketCardProps {
  bracket: ScoreBracket;
  onEdit: (bracket: ScoreBracket) => void;
  onDelete: (bracketId: string) => void;
  disabled?: boolean;
}

const ScoreBracketCard = ({
  bracket,
  onEdit,
  onDelete,
  disabled = false,
}: ScoreBracketCardProps) => {
  const [isViewing, setIsViewing] = useState(false);
  const scoreRange =
    bracket.minScore === bracket.maxScore
      ? `${bracket.minScore}`
      : `${bracket.minScore}-${bracket.maxScore}`;

  return (
    <>
      <div className="relative shadow shadow-uGrayLight rounded-lg p-4 bg-panel overflow-hidden">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="w-full flex flex-rowitems-center gap-2 mb-2">
              <div className="flex-1 flex flex-row gap-2 items-center font-semibold">
                <p className="text-lg text-primary">{scoreRange}</p>
                <p className="text-sm text-uGrayLight">points</p>
              </div>
              {disabled ? (
                <button
                  onClick={() => setIsViewing(true)}
                  className="absolute top-0 right-0 h-full w-full bg-transparent"
                />
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(bracket)}
                    disabled={disabled}
                    className="text-uGrayLight hover:text-primary"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(bracket.id)}
                    disabled={disabled}
                    className="p-2 text-uGrayLight hover:text-uRed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-uGrayLight text-sm leading-relaxed line-clamp-2">
              {bracket.criteria}
            </p>
          </div>
        </div>
      </div>
      <ModalViewBracket
        isOpen={isViewing}
        onClose={() => setIsViewing(false)}
        bracket={bracket}
      />
    </>
  );
};

export default ScoreBracketCard;
