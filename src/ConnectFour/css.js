const styles = {
  // cells & turn/win text
  board: {
    border: "10px solid grey",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    width: "800px",
    height: "800px",
  },
  // square that houses circle
  padInner: {
    alignSelf: "stretch",
    flex: "1 1 auto",
    flexBasis: "auto",
    padding: "8px",
    alignItems: "stretch",
    border: "2px solid white",
  },
  // row of cells
  row: {
    alignSelf: "stretch",
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "row",
  },
  // outer container for app
  outer: {
    paddingLeft: "10px",
    display: "flex",
    flexDirection: "column",
  },
  // circle that represents slot for player tokens
  dot: {
    height: "100%",
    width: "100%",
    border: "1px solid grey",
    borderRadius: "50%",
    display: "inline-block",
    cursor: "pointer",
  },
  // reset button
  reset: {
    width: "100px",
    height: "25px",
    marginBottom: "10px",
  },
  // font for our turn/win text
  shadowFont: {
    textShadow: "#000 0px 0px 3px",
    fontSize: "30px",
  },
};
export default styles;
