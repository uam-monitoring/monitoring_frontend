export function colorPicker(latitude) {
  const COLOR_HEIGHT = {
    FIRST: "red",
    SECOND: "blue",
    THIRD: "green",
    FOURTH: "yello",
    FIFTH: "purple",
    SIXTH: "teal",
  };

  if (latitude < 100) {
    return COLOR_HEIGHT.FIRST;
  } else if (latitude < 200) {
    return COLOR_HEIGHT.SECOND;
  } else if (latitude < 300) {
    return COLOR_HEIGHT.THIRD;
  } else if (latitude < 400) {
    return COLOR_HEIGHT.FOURTH;
  } else if (latitude < 500) {
    return COLOR_HEIGHT.FIFTH;
  } else if (latitude <= 600) {
    return COLOR_HEIGHT.SIXTH;
  }
}
