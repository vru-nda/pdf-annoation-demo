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

import HighlightPopup from "@/components/HighlightPopup";
import Sidebar from "@/components/Sidebar";
import Spinner from "@/components/Spinner";
import testHighlights from "@/components/tesHighlights";

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const PDF_URLS = {
  primary: PRIMARY_PDF_URL,
  secondary: SECONDARY_PDF_URL,
};

const getNextId = () => String(Math.random()).slice(2);

const Home = () => {
  // const [url, setUrl] = useState(PDF_URLS.primary);
  const [highlights, setHighlights] = useState([
    ...testHighlights[PDF_URLS.primary],
  ]);
  const [highlightId, setHighlightId] = useState(null);
  const [scrollToSidebar, setScrollToSideBar] = useState(false);
  const scrollViewerTo = useRef(() => {});
  const sideBarRef = useRef();

  // const toggleDocument = () => {
  //   const newUrl =
  //     url === PDF_URLS.primary ? PDF_URLS.secondary : PDF_URLS.primary;
  //   setUrl(newUrl);
  //   setHighlights([]);
  // };

  const getHighlightById = (id) =>
    highlights.find((highlight) => highlight.id === id);

  const scrollToSelectedHighlight = () => {
    const highlight = getHighlightById(highlightId);

    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  };

  useEffect(() => {
    if (highlightId && !scrollToSidebar) {
      scrollToSelectedHighlight();
    }
  }, [highlightId, scrollViewerTo]);

  const addHighlight = (highlight) => {
    setHighlights((prevHighlights) => [
      { ...highlight, id: getNextId() },
      ...prevHighlights,
    ]);
  };

  const updateHighlight = (highlightId, position, content) => {
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
        setScrollToSideBar={setScrollToSideBar}
        setHighlightId={setHighlightId}
        sideBarRef={sideBarRef}
      />
      <div style={{ height: "100vh", width: "75vw", position: "relative" }}>
        <PdfLoader url={PDF_URLS.primary} beforeLoad={<Spinner />}>
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
                    onClick={() => {
                      setScrollToSideBar(true);
                      setHighlightId(highlight.id);
                    }}
                  />
                ) : (
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      updateHighlight(
                        highlight.id,
                        { boundingRect: viewportToScaled(boundingRect) },
                        { image: screenshot(boundingRect) }
                      );
                    }}
                  />
                );

                return (
                  <Popup
                    popupContent={
                      <HighlightPopup sideBarRef={sideBarRef} {...highlight} />
                    }
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
