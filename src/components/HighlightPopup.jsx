const HighlightPopup = ({ comment, sideBarRef }) => {
  return (
    comment.text && (
      <div
        className="Highlight__popup"
        onClick={() => sideBarRef.current.scrollIntoView()}
      >
        {comment.emoji} {comment.text}
      </div>
    )
  );
};
export default HighlightPopup;
