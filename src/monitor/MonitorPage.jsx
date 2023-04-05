import styled from "styled-components";
import Altitude from "./Altitude";
import Path from "./Path";

const MonitorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 15% 85%;
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

export default function MonitorPage() {
  return (
    <MonitorContainer>
      <AltitudeContainer>
        <Altitude />
      </AltitudeContainer>
      <RouteContainer>
        <Path />
      </RouteContainer>
    </MonitorContainer>
  );
}
