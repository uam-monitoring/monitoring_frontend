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

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    const width = +svg.attr("width");
    const height = +svg.attr("height");

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
        .attr("d", line)
        .transition()
        .duration(500)
        .ease(d3.easeLinear);
    } else {
      path
        .datum(data)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("d", line);
    }

    const rect = svg.select(".path-rect");
    if (rect.empty()) {
      svg
        .append("rect")
        .attr("class", "path-rect")
        .attr("x", data[data.length - 1].x - 5)
        .attr("y", data[data.length - 1].y - 5)
        .attr("width", "1rem")
        .attr("height", "1rem")
        .attr("fill", "#8f8f8c");
    } else {
      rect
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("x", x - 5)
        .attr("y", y - 5);
    }
  };
  console.log(data);
  useEffect(() => {
    drawChart();
  }, [data]);

  useEffect(() => {
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
    ></svg>
  );
};

export default Path;
