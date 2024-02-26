"use client";

import { useEffect, useRef, useState } from "react";

import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,
} from "react-pdf-highlighter";

// const { AreaHighlight, Highlight, PdfHighlighter, PdfLoader, Popup, Tip } =
//   dynamic(() => import("react-pdf-highlighter"), { ssr: true });

import HighlightPopup from "@/components/HighlightPopup";
import Sidebar from "@/components/Sidebar";
import Spinner from "@/components/Spinner";
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
  const scrollViewerTo = useRef(() => {});

  // Scroll to the hightlight in pdf
  const scrollToSelectedHighlight = () => {
    const highlight = highlights.find(
      (highlight) => highlight.id === highlightId
    );

    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  };

  // Wait for the hightlight scroll function to be initialized
  useEffect(() => {
    if (highlightId) {
      scrollToSelectedHighlight();
    }
  }, [highlightId, scrollViewerTo]);

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
      <Sidebar
        highlights={highlights}
        resetHighlights={() => setHighlights([])}
        highlightId={highlightId}
        setHighlightId={setHighlightId}
      />
      <div style={{ height: "100vh", width: "75vw", position: "relative" }}>
        <PdfLoader url={url} beforeLoad={<Spinner />}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={() => setHighlightId(null)}
              scrollRef={(scrollTo) => {
                scrollViewerTo.current = scrollTo;
              }}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => {
                return (
                  <Tip
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      addHighlight({ content, position, comment });
                      hideTipAndSelection();
                    }}
                  />
                );
              }}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => {
                const isTextHighlight = !Boolean(
                  highlight.content && highlight.content.image
                );

                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                ) : (
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      updateHighlight(
                        boundingRect,
                        highlight.id,
                        { boundingRect: viewportToScaled(boundingRect) },
                        { image: screenshot(boundingRect) }
                      );
                    }}
                  />
                );

                return (
                  <Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={(popupContent) =>
                      setTip(highlight, () => popupContent)
                    }
                    onMouseOut={hideTip}
                    key={index}
                  >
                    {component}
                  </Popup>
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </div>
    </div>
  );
};

export default Home;
