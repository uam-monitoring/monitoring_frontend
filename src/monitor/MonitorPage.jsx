import styled from "styled-components";
import Altitude from "./Altitude";
import Path from "./Path";

import { useEffect } from "react";
import axios from "axios";

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

export const API_ENDPOINT = "http://34.64.73.86:8080";

export default function MonitorPage() {
  const uamData = [
    {
      id: 123123,
      color: "yellow",
    },
  ];

  useEffect(() => {
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["Access-Control-Allow-Credentials"] = true;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    // getCourseInfo();
    // getFIXM();
    // getStatus();
    const ws = new WebSocket(`ws://34.64.73.86:8080/socket`);
    ws.onmessage = (event) => {
      console.log(event.data);
      // const newData = JSON.parse(event.data);
      // console.log(newData);
      // setData((prevData) => [...prevData, ...newData]); // Update the chart data with new data
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
