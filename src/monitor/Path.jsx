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

  const drawVertport = (vertPosition) => {
    const svg = d3.select(svgRef.current);
    const vertGroup = svg.append("g");
    const width = svg.attr("width");
    const height = svg.attr("height");
    const xScale = d3.scaleLinear().domain([0, 1000]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 1000]).range([0, height]);
    vertPosition.map((vertport) => {
      vertGroup
        .append("rect")
        .attr("x", xScale(vertport.x))
        .attr("y", yScale(vertport.y))
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", grayColor);
    });
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
        svg
          .append("text")
          .text(info?.id)
          .attr("class", "path-uamInfoText" + info?.id)
          .attr("x", scale.xScale(data[data.length - 1].x) + 10) // circle 위치에서 x값 + 10
          .attr("y", scale.yScale(data[data.length - 1].y) - 10) // circle 위치에서 y값 - 10
          .attr("fill", "black");
      } else {
        uamInfo
          .attr("cx", scale.xScale(data[data.length - 1].x))
          .attr("cy", scale.yScale(data[data.length - 1].y));
        svg
          .select(".path-uamInfoText" + info?.id)
          .attr("x", scale.xScale(data[data.length - 1].x) + 10) // circle 위치에서 x값 + 10
          .attr("y", scale.yScale(data[data.length - 1].y) - 10);
      }
    });
  };

  const resetZoom = () => {
    const svg = d3.select(svgRef.current);
    svg.call(d3.zoom().on("zoom", null));
    svg.attr("transform", d3.zoomIdentity);
    const zoom = d3.zoom().on("zoom", null);
    const initialTransform = d3.zoomIdentity;
    svg.call(zoom.transform, initialTransform);
    svg.call(zoom);
    drawZoom();
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
    setScale(
      drawVertport([
        { x: 45, y: 45 },
        { x: 300, y: 900 },
        { x: 600, y: 300 },
        { x: 900, y: 700 },
      ])
    );
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
