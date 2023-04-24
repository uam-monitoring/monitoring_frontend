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
  //소켓통신을 시작한다

  const colorPlusModel = () => {
    // 각 함수에서 색상을 정한다.
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = Math.random(); // alpha component can be any value between 0 and 1
    const color = `rgba(${r}, ${g}, ${b}, ${a})`;
    //object를 순회하며 color를 넣는다.
  };

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
