import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
const grayColor = "#8f8f8c";
const HOVER_INFO_Y = 970;
const HOVER_INFO_X = 10;

const Path = ({ uamData }) => {
  const svgRef = useRef(null);
  const [scale, setScale] = useState();
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
    const vert1Data = [{ x: 45, y: 45 }];
    const vert2Data = [{ x: 900, y: 700 }];
    const vertGroup = svg.append("g");
    const width = svg.attr("width");
    const height = svg.attr("height");
    const xScale = d3.scaleLinear().domain([0, 1000]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 1000]).range([0, height]);
    vertGroup
      .append("rect")
      .attr("x", xScale(vert1Data[0].x))
      .attr("y", yScale(vert1Data[0].x))
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", grayColor);
    vertGroup
      .append("rect")
      .attr("x", xScale(vert2Data[0].x))
      .attr("y", yScale(vert2Data[0].x))
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", grayColor);
    return { xScale, yScale };
  };

  const drawZoom = () => {
    const svg = d3.select(svgRef.current);
    const width = svg.attr("width");
    const height = svg.attr("height");
    const zoom = d3
      .zoom()
      .scaleExtent([1, 5])
      .translateExtent([
        [-width * 0.3, -height * 0.3],
        [width * 1.3, height * 1.3],
      ])
      .on("zoom", zoomed);
    svg.call(zoom);
    function zoomed(event) {
      const { transform } = event;
      svg.attr("transform", transform);
    }
  };

  const drawUamPath = () => {
    const svg = d3.select(svgRef.current);
    const line = d3
      .line()
      .x((d) => scale.xScale(d.x))
      .y((d) => scale.yScale(d.y))
      .curve(d3.curveBasis);

    uamData?.map((info) => {
      const path = svg.select(".path-uam" + info?.id);
      if (path.empty()) {
        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("class", "path-uam")
          .attr("stroke", info?.color)
          .attr("stroke-dasharray", "5,5")
          .attr("stroke-dashoffset", 0)
          .attr("stroke-width", 2)
          .attr(
            "d",
            line.x((d) => scale.xScale(d.x)).y((d) => scale.yScale(d.y)) // yScale 적용
          );
      } else {
        path.datum(data).attr(
          "d",
          line.x((d) => scale.xScale(d.x)).y((d) => scale.yScale(d.y)) // yScale 적용
        );
      }

      const uamInfo = svg.select(".path-uamInfo" + info?.id);
      if (uamInfo.empty()) {
        svg
          .append("circle")
          .attr("class", "path-uamInfo" + info?.id)
          .attr("cx", scale.xScale(data[data.length - 1].x))
          .attr("cy", scale.yScale(data[data.length - 1].y))
          .attr("r", 5)
          .attr("fill", info?.color)
          .on("mouseover", function () {
            svg
              .append("text")
              .attr("class", "path-uamInfoHover" + info?.id)
              .attr("x", scale.xScale(HOVER_INFO_X))
              .attr("y", scale.yScale(HOVER_INFO_Y))
              .attr("fill", "white")
              .text(`ID: ${info?.id} Longitude: Latitude: Altitude: `);
          })
          .on("mouseout", function () {
            svg.selectAll(".path-uamInfoHover" + info?.id).remove();
          });
      } else {
        uamInfo
          .attr("cx", scale.xScale(data[data.length - 1].x))
          .attr("cy", scale.yScale(data[data.length - 1].y));
      }
    });
  };

  const resetZoom = () => {
    const svg = d3.select(svgRef.current);
    svg.attr("transform", d3.zoomIdentity);
  };

  useEffect(() => {
    if (scale) {
      drawUamPath();
    }
  }, [data]);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === 82) {
        resetZoom();
      }
    });
    setScale(drawVertport());
    drawZoom();
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
