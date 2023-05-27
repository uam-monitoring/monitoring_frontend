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
    let obj;
    try {
      const { data } = await getUAMList();
      const promises = data?.map(async (item) => {
        const { data: fixmData } = await getFIXM(item);
        return [item, { FIXM: fixmData, ADSB: [] }];
      });
      const results = await Promise.all(promises);
      obj = Object.fromEntries(results);
    } catch (error) {
      alert(error);
    }
    // ADSB에 데이터 넣기 (안해도 될란가)
    // getADSB().then(({ data }) => {});
    const ws = new WebSocket(`ws://34.64.73.86:8080/socket`);
    ws.onmessage = ({ data }) => {
      const newData = JSON.parse(data);
      obj[newData.flightIdentifier.uamIdentification].ADSB.push(
        newData.currentPosition
      );
      setUamData(obj);
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
      <RouteContainer>{/* <Path uamData={uamData} /> */}</RouteContainer>
    </MonitorContainer>
  );
}
