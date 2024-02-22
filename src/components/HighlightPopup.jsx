const HighlightPopup = ({ comment, id }) => {
  const handleSidebarScroll = () => {
    const sidebarItem = document.getElementById(`highlight_${id}`);
    if (sidebarItem) {
      sidebarItem.classList.add("sidebar_active");
      sidebarItem.scrollIntoView();
    }

    setTimeout(() => {
      sidebarItem.classList.remove("sidebar_active");
    }, 500);
  };

  return (
    comment.text && (
      <div className="Highlight__popup" onClick={handleSidebarScroll}>
        {comment.emoji} {comment.text}
      </div>
    )
  );
};
export default HighlightPopup;
