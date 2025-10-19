import { ScoreBracket } from "@/types/rubric";
import BaseModal from "../container/BaseModal";

interface ModalViewBracketProps {
  isOpen: boolean;
  onClose: () => void;
  bracket: ScoreBracket;
}

const ModalViewBracket = ({
  isOpen,
  onClose,
  bracket,
}: ModalViewBracketProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Scoring Bracket">
      <div className="space-y-4 p-6">
        <table className="w-full border-none">
          <tbody>
            <tr className="border-b border-uGrayLightLight">
              <td className="text-base text-uGrayLight font-semibold w-28 py-2">
                Score Range
              </td>
              <td className="text-base text-uGrayLight">
                {bracket.minScore === bracket.maxScore
                  ? bracket.minScore
                  : `${bracket.minScore} - ${bracket.maxScore}`}
              </td>
            </tr>
            <tr>
              <td className="text-base text-uGrayLight font-semibold">
                Criteria
              </td>
              <td className="text-base text-uGrayLight py-2">
                {bracket.criteria}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseModal>
  );
};

export default ModalViewBracket;
