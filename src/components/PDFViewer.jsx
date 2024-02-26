import React, { useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import Spinner from "./Spinner";
import HighlightPopup from "./HighlightPopup";

const AreaHighlight = dynamic(
  () => import("react-pdf-highlighter").then((mod) => mod.AreaHighlight),
  {
    ssr: false,
  }
);
const PdfHighlighter = dynamic(
  () => import("react-pdf-highlighter").then((mod) => mod.PdfHighlighter),
  {
    ssr: false,
  }
);

const Highlight = dynamic(
  () => import("react-pdf-highlighter").then((mod) => mod.Highlight),
  {
    ssr: false,
  }
);
const PdfLoader = dynamic(
  () => import("react-pdf-highlighter").then((mod) => mod.PdfLoader),
  {
    ssr: false,
  }
);
const Popup = dynamic(
  () => import("react-pdf-highlighter").then((mod) => mod.Popup),
  {
    ssr: false,
  }
);
const Tip = dynamic(
  () => import("react-pdf-highlighter").then((mod) => mod.Tip),
  {
    ssr: false,
  }
);

const PDFViewer = ({
  url,
  highlights,
  setHighlightId,
  highlightId,
  addHighlight,
  updateHighlight,
}) => {
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

  useEffect(() => {
    scrollToSelectedHighlight();
  }, [highlights, highlightId, scrollViewerTo]);

  return (
    <div style={{ height: "100vh", width: "75vw", position: "relative" }}>
      <Suspense fallback="Loading...">
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
      </Suspense>
    </div>
  );
};

export default PDFViewer;
