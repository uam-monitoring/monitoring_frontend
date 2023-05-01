import styled from "styled-components";
import Altitude from "./Altitude";
import Path from "./Path";

const MonitorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 15% 85%;
  overflow: hidden;
`;

const AltitudeContainer = styled.div`
  width: 100%;
  height: 100%;
  border-right: 3px solid;
`;

const RouteContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const COLOR_HEIGHT = {
  FIRST: "",
  SECOND: "",
  THIRD: "",
  FOURTH: "",
  FIFTH: "",
  SIXTH: "",
  SEVENTH: "",
};

export default function MonitorPage() {
  const uamData = [
    {
      id: 123123,
      color: "#ff0202",
    },
  ];

  return (
    <MonitorContainer>
      <AltitudeContainer>
        <Altitude uamData={uamData} />
      </AltitudeContainer>
      <RouteContainer>
        <Path uamData={uamData} />
      </RouteContainer>
    </MonitorContainer>
  );
}
