import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

const Altitude = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([120, 120]);
  const [flag, setFlag] = useState(false);

  const updateData = (flag) => {
    console.log(flag);
    if (flag) {
      console.log(1);
      setData([150, 150]);
    } else {
      console.log(2);
      setData([10, 10]);
    }
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

    // Remove existing line

    // Draw new line chart

    svg
      .append("path")
      .datum(data)
      .attr("class", "line-path")
      .attr("d", line)
      .attr("stroke", "none")
      .attr("fill", "none");
  }, []);

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

    // Remove existing line
    svg.select(".line-path").remove(); // 셀렉할 때 .을 클래스 이름 앞에 붙여야함

    // Draw new line chart
    let color = "black";
    if (flag) {
      color = "red";
    }

    svg
      .append("path")
      .datum(data)
      .attr("class", "line-path")
      .attr("d", line)
      .attr("stroke", color)
      .attr("stroke-width", 5)
      .attr("fill", "none");
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
