"use client";

import { useState } from "react";

import HighlightList from "@/components/HighlightList";
import PDFViewer from "@/components/PDFViewer";
import testHighlights from "@/components/tesHighlights";
import LOCAL_PDF from "../assets/demo.pdf";

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const PDF_URLS = {
  primary: PRIMARY_PDF_URL,
  secondary: SECONDARY_PDF_URL,
  local: LOCAL_PDF,
};

const getNextId = () => String(Math.random()).slice(2);

const Home = () => {
  const [url, setUrl] = useState(PDF_URLS.primary);
  const [highlights, setHighlights] = useState([
    ...testHighlights[PDF_URLS.primary],
  ]);
  const [highlightId, setHighlightId] = useState(null);

  const addHighlight = (highlight) => {
    // Check if there is no text then add placeholder
    const highlightObj = {
      ...highlight,
      comment: {
        ...highlight.comment,
        text: highlight.comment.text !== "" ? highlight.comment.text : "Text",
      },
    };

    setHighlights((prevHighlights) => [
      { ...highlightObj, id: getNextId() },
      ...prevHighlights,
    ]);
  };

  const updateHighlight = (boundingRect, highlightId, position, content) => {
    setHighlights((prevHighlights) =>
      prevHighlights.map((h) =>
        h.id === highlightId
          ? {
              ...h,
              position: { ...h.position, ...position },
              content: { ...h.content, ...content },
            }
          : h
      )
    );
  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <HighlightList
        highlights={highlights}
        resetHighlights={() => setHighlights([])}
        highlightId={highlightId}
        setHighlightId={setHighlightId}
      />
      <PDFViewer
        url={url}
        highlightId={highlightId}
        highlights={highlights}
        setHighlightId={setHighlightId}
        addHighlight={addHighlight}
        updateHighlight={updateHighlight}
      />
    </div>
  );
};

export default Home;
