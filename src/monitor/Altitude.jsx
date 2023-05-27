import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useRecoilValue } from "recoil";
import { UamDataState } from "../atom";

const Altitude = () => {
  const chartRef = useRef(null);
  const uamData = useRecoilValue(UamDataState);
  const makeCanvas = () => {
    const svg = d3.select(chartRef.current);
    const yScale = d3
      .scaleLinear()
      .domain([0, 600])
      .range([window.innerHeight - 10, 10]);
    let yAxis = svg.select(".y-axis");
    if (yAxis.empty()) {
      yAxis = svg.append("g").attr("class", "y-axis");
    }
    yAxis
      .call(
        d3
          .axisLeft(yScale)
          .tickValues([0, 100, 200, 300, 400, 500, 600])
          .tickSize(0)
      )
      .style("font-size", "16px");
    yAxis.attr("transform", "translate(40,0)"); // y축 생성
  };

  const makeUamAltitudeLine = (data, id, color) => {
    const svg = d3.select(chartRef.current);
    const yScale = d3
      .scaleLinear()
      .domain([0, 600])
      .range([window.innerHeight, 0]);
    const line = d3
      .line()
      .x((d, i) => i * (window.innerWidth / (data.length - 1)))
      .y((d) => yScale(d));

    const path = svg.select(".line-path-" + id);

    if (path.empty()) {
      svg
        .append("path")
        .datum(data)
        .attr("class", "line-path-" + id)
        .attr("id", "line-path-" + id)
        .attr("stroke-width", 5)
        .attr("stroke", color)
        .attr("fill", "none");
      svg
        .append("text")
        .append("textPath")
        .attr("href", "#line-path-" + id) // the ID of the path element
        .attr("startOffset", "5.5%")
        .attr("text-anchor", "start")
        .attr("font-size", "1rem")
        .attr("fill", "#ffffff")
        .text(id);
    } else {
      path.datum(data).attr("d", line);
    }
  };

  useEffect(() => {
    // uamData?.map((uam) => {
    //   makeUamAltitudeLine(data, uam?.id, uam?.color);
    // });
    console.log("ree");
    Object?.entries(uamData)?.forEach(([key, value]) => {
      console.log(key, value);
    });
  }, [uamData]);

  useEffect(makeCanvas, []);

  return (
    <svg
      ref={chartRef}
      width={window.innerWidth * 0.15}
      height={window.innerHeight}
    />
  );
};

export default Altitude;
