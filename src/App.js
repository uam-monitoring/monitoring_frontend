import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
const INITIAL_VIEW_STATE = {
  longitude: 127.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiamFlaGVvbiIsImEiOiJjbGZxdmR6eHYwMmc0NDRsbDI2dWRnYjc1In0.CgjNkZEQHphOCvirgEekqA";
function App() {
  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true}>
      <Map
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </DeckGL>
  );
}
export default App;
