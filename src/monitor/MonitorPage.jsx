import styled from "styled-components";
import Altitude from "./Altitude";
import Path from "./Path";
import { useEffect, useState } from "react";
import { getADSB, getFIXM, getUAMList, initAxiosHeader } from "../api";
import { useRecoilState } from "recoil";
import { UamDataState } from "../atom";

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
  const [uamData, setUamData] = useRecoilState(UamDataState);
  async function setupMonitorSystem() {
    try {
      const { data } = await getUAMList();
      let cnt = 100;
      const promises = data?.map(async (item) => {
        const { data: fixmData } = await getFIXM(item);
        cnt += 100;
        if (cnt >= 600) {
          cnt = 100;
        }
        return [item, { FIXM: fixmData, ADSB: [], Altitude: cnt }];
      });
      const results = await Promise.all(promises);
      const obj = Object.fromEntries(results);
      setUamData(obj);
    } catch (error) {
      alert(error);
    }
    const ws = new WebSocket(`ws://34.64.73.86:8080/socket`);
    ws.onmessage = ({ data }) => {
      const newData = JSON.parse(data);
      // obj[newData.flightIdentifier.uamIdentification].ADSB.push(
      //   newData.currentPosition
      // );
    };
    return () => {
      ws.close();
    };
  }

  useEffect(() => {
    initAxiosHeader();
    setupMonitorSystem();
  }, []);

  return (
    <MonitorContainer>
      <AltitudeContainer>
        <Altitude />
      </AltitudeContainer>
      <RouteContainer>
        <Path uamData={uamData} />
      </RouteContainer>
    </MonitorContainer>
  );
}
