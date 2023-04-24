import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
const grayColor = "#8f8f8c";
const HOVER_INFO_Y = 500;
const HOVER_INFO_X = 0;

const Path = (uamData) => {
  uamData = {
    id: 123123,
    color: "red",
  };
  const svgRef = useRef(null);
  const [data, setData] = useState([{ x: 50, y: 50 }]);

  const updateData = () => {
    const minValue = 0;
    const maxValue = 10;
    setData((prevData) => [
      ...prevData,
      {
        x:
          prevData[prevData.length - 1].x +
          Math.floor(Math.random() * (maxValue - minValue + 1)) +
          minValue,
        y:
          prevData[prevData.length - 1].y +
          Math.floor(Math.random() * (maxValue - minValue + 1)) +
          minValue,
      },
    ]);
  };

  const drawVertport = () => {
    const svg = d3.select(svgRef.current);
    const vert1Data = [{ x: 50, y: 50 }];
    const vert2Data = [{ x: 990, y: 700 }];
    const vertGroup = svg.append("g");

    vertGroup
      .append("rect")
      .attr("x", vert1Data[0].x)
      .attr("y", vert1Data[0].y - 20)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", grayColor);
    vertGroup
      .append("rect")
      .attr("x", vert2Data[0].x)
      .attr("y", vert2Data[0].y)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", grayColor);
  };

  const drawUamPath = () => {
    const svg = d3.select(svgRef.current);
    const width = svg.attr("width");
    const height = svg.attr("height");
    const xScale = d3.scaleLinear().domain([0, 1000]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 1000]).range([0, height]);
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveBasis);

    const path = svg.select(".path-uam" + uamData?.id);
    if (path.empty()) {
      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "path-uam")
        .attr("stroke", "#8f8f8c")
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-dashoffset", 0)
        .attr("stroke-width", 2)
        .attr("d", line);
    } else {
      path.datum(data).attr("d", line);
    }

    const uamInfo = svg.select(".path-uamInfo" + uamData?.id);
    if (uamInfo.empty()) {
      svg
        .append("circle")
        .attr("class", "path-uamInfo" + uamData?.id)
        .attr("cx", xScale(data[data.length - 1].x))
        .attr("cy", yScale(data[data.length - 1].y))
        .attr("r", 15)
        .attr("fill", uamData?.color)
        .on("mouseover", function () {
          const rect = svg
            .append("rect")
            .attr("class", "path-uamInfoHover" + uamData?.id)
            .attr("x", xScale(HOVER_INFO_X))
            .attr("y", yScale(HOVER_INFO_Y))
            .attr("width", 150)
            .attr("height", 50)
            .attr("fill", "#000000f4");

          rect
            .append("text")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text("Hello, world!");
        })
        .on("mouseout", function () {
          svg.selectAll(".path-uamInfoHover" + uamData?.id).remove();
        });
    } else {
      uamInfo
        .attr("cx", xScale(data[data.length - 1].x))
        .attr("cy", yScale(data[data.length - 1].y));
    }
  };

  useEffect(() => {
    drawUamPath();
  }, [data]);

  useEffect(() => {
    drawVertport();
    const interval = setInterval(() => {
      updateData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      ref={svgRef}
      width={window.innerWidth * 0.85}
      height={window.innerHeight}
    />
  );
};

export default Path;
