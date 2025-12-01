import { ScoreBracket } from "@/types/rubric";
import ScoreBracketCard from "./ScoreBracketCard";
import ParagraphBox from "../ParagraphBox";

interface RubricCriteriaProps {
  brackets: ScoreBracket[];
  note?: string;
}

const RubricCriteria = ({ brackets, note }: RubricCriteriaProps) => {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h3 className="text-base text-uGrayLight">Score Brackets</h3>
        <div className="grid grid-cols-2 gap-4">
          {brackets
            .sort((a, b) => a.minScore - b.minScore)
            .map((bracket) => (
              <ScoreBracketCard
                key={bracket.id}
                bracket={bracket}
                onEdit={() => {}} // No-op for view mode
                onDelete={() => {}} // No-op for view mode
                disabled={true}
              />
            ))}
        </div>
      </div>
      {note && (
        <div className="flex flex-col gap-1">
          <h3 className="text-base text-uGrayLight">Additional Notes</h3>
          <ParagraphBox
            value={note}
            setValue={() => {}} // No-op for view mode
            placeholder="No additional notes"
            disabled={true}
            rows={3}
          />
        </div>
      )}
    </>
  );
};

export default RubricCriteria;
