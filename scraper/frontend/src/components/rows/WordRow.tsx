import { WordEntity } from "@/schema/word.schema";
import { useBoundStore } from "@/store";

function WordRow({ word }: { word: WordEntity }) {
  const { setWordToModal } = useBoundStore();

  function handleAddPluralSyn() {
    setWordToModal(word);
  }

  return (
    <tr className="hover-actions-trigger btn-reveal-trigger position-static">
      <td className="city align-middle white-space-nowrap text-primary fw-bold text-capitalize">
        {word.word}
      </td>
      <td className="last_active align-middle white-space-nowrap text-700 fw-bold text-capitalize">
        {word.language.name}
      </td>
      <td className="email align-middle white-space-nowrap">
        <button
          className="btn btn-link fw-semi-bold"
          onClick={handleAddPluralSyn}
        >
          Add Plurals & Synonyms
        </button>
      </td>
    </tr>
  );
}

export default WordRow;
