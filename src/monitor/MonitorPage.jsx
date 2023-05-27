import styled from "styled-components";
import Altitude from "./Altitude";
import Path from "./Path";
import { useEffect } from "react";
import { getADSB, getFIXM, initAxiosHeader } from "../api";

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

export default function MonitorPage() {
  const uamData = [
    {
      id: 123123,
      color: "red",
    },
  ];

  useEffect(() => {
    initAxiosHeader();
    let c = 0;
    getFIXM("UAL123").then((e) => {
      // console.log(e);
    });
    getADSB().then(({ data }) => {
      // console.log(data);
    });
    const ws = new WebSocket(`ws://34.64.73.86:8080/socket`);
    ws.onmessage = ({ data }) => {
      const newData = JSON.parse(data);
      console.log(c, newData);
      c += 1;
      // setData((prevData) => [...prevData, ...newData]);
    };
    return () => {
      ws.close();
    };
  }, []);

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
