import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const Path = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([{ x: 0, y: 0 }]);

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
    // Define the circle data with coordinates (50, 50)
    const circle1Data = [{ x: 50, y: 50 }];
    // Define the circle data with coordinates (900, 900)
    const circle2Data = [{ x: 990, y: 700 }];
    // Create a group element for the circles
    const circlesGroup = svg.append("g");
    // Add the first circle to the group

    circlesGroup
      .append("rect")
      .attr("x", circle1Data[0].x - 10)
      .attr("y", circle1Data[0].y - 10)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "red");
    circlesGroup
      .append("rect")
      .attr("x", circle2Data[0].x - 10)
      .attr("y", circle2Data[0].y - 10)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "red");
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

    const lastDataPoint = data[data.length - 1];
    const x = xScale(lastDataPoint.x);
    const y = yScale(lastDataPoint.y);

    const path = svg.select(".path-line");
    if (path.empty()) {
      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "path-line")
        .attr("stroke", "#8f8f8c")
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-dashoffset", 0)
        .attr("stroke-width", 2)
        .attr("d", line);
    } else {
      path.datum(data).attr("d", line);
    }

    const uamInfo = svg.select(".path-uamInfo");
    if (uamInfo.empty()) {
      svg
        .append("circle")
        .attr("class", "path-uamInfo")
        .attr("cx", xScale(data[data.length - 1].x))
        .attr("cy", yScale(data[data.length - 1].y))
        .attr("r", 10)
        .attr("fill", "#8f8f8c");
    } else {
      uamInfo.attr("cx", x).attr("cy", y);
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
