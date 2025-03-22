import TableLoader from "@/components/loader/TableLoader";
import SynonymsPluralsTable from "@/components/tables/SynonymsPluralsTable";
import { useQueryWords } from "@/services/word.service";

function SynonymsPlurals() {
  const { data, isLoading, error } = useQueryWords();

  if (error && error.code?.includes("ERR_NETWORK")) {
    throw error;
  }

  return (
    <>
      <div className="g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">Synonyms & Plurals</h3>
        </div>
      </div>
      {isLoading ? (
        <TableLoader />
      ) : (
        <>
          <SynonymsPluralsTable data={data} />
        </>
      )}
    </>
  );
}

export default SynonymsPlurals;
