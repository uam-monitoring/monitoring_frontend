import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const Altitude = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([120, 120]);
  const [flag, setFlag] = useState(false);

  const updateData = (flag) => {
    const minValue = 100;
    const maxValue = 220;
    const newVal =
      Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    setData([newVal, newVal]);
  };

  useEffect(() => {
    const svg = d3.select(chartRef.current);

    // Set up scales
    const yScale = d3
      .scaleLinear()
      .domain([0, 350])
      .range([window.innerHeight, 0]);

    // Set up line
    const line = d3
      .line()
      .x((d, i) => i * (window.innerWidth / (data.length - 1)))
      .y((d) => yScale(d));

    // // Remove existing line
    // svg.select(".line-path").remove(); // 셀렉할 때 .을 클래스 이름 앞에 붙여야함

    // Draw or update the y-axis

    let yAxis = svg.select(".y-axis");
    if (yAxis.empty()) {
      yAxis = svg.append("g").attr("class", "y-axis");
    }
    yAxis
      .call(d3.axisLeft(yScale).tickValues([100, 200, 300]).tickSize(0))
      .style("font-size", "16px");
    yAxis.attr("transform", "translate(40,0)"); // adjust the position as needed

    // Draw new line chart
    // Select the existing path element
    const path = svg.select(".line-path");

    // If the path element doesn't exist yet, create it
    if (path.empty()) {
      svg
        .append("path")
        .datum(data)
        .attr("class", "line-path")
        .attr("id", "line-path")
        .attr("stroke-width", 10)
        .attr("stroke", "#8f8f8c")
        .attr("fill", "none");
      // Add a text element with a textPath that references the path
      svg
        .append("text")
        .append("textPath")
        .attr("href", "#line-path") // the ID of the path element
        .attr("startOffset", "5%")
        .attr("text-anchor", "start")
        .attr("font-size", "1rem")
        .attr("fill", "#ffffff")
        .attr("dy", "30px")
        .text("UAM 123");
    } else {
      // Animate the path element to the new data points
      path.datum(data).transition().duration(1000).attr("d", line);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlag((prev) => !prev);
      updateData(flag);
    }, 1000);
    return () => clearInterval(interval);
  }, [flag]);

  return (
    <svg
      ref={chartRef}
      width={window.innerWidth * 0.15}
      height={window.innerHeight}
    />
  );
};

export default Altitude;
