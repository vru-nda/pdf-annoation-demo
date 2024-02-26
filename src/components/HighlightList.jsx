import Sidebar from "@/components/Sidebar";

const HighlightList = ({
  highlights,
  resetHighlights,
  highlightId,
  setHighlightId,
}) => {
  return (
    <Sidebar
      highlights={highlights}
      resetHighlights={resetHighlights}
      highlightId={highlightId}
      setHighlightId={setHighlightId}
    />
  );
};

export default HighlightList;
