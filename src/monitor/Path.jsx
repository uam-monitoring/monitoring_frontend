import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { getVertports } from "../api";
import { UamDataState, VertportInfoState } from "../atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { colorPicker } from "../utill";

const grayColor = "#8f8f8c";
const HOVER_INFO_Y = 970;
const HOVER_INFO_X = 10;

const Path = () => {
  const svgRef = useRef(null);
  const [scale, setScale] = useState();
  const uamData = useRecoilValue(UamDataState);
  const [vertportInfo, setVertportInfo] = useRecoilState(VertportInfoState);
  const [data, setData] = useState([{ x: 50, y: 50 }]);
  console.log(uamData);
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
    vertPosition?.map((vertport) => {
      vertGroup
        .append("rect")
        .attr("x", xScale(vertport.latitude) - 10)
        .attr("y", yScale(vertport.longitude) - 10)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", grayColor)
        .on("mouseover", function () {
          svg
            .append("text")
            .attr("class", "vert-InfoHover" + vertport?.id)
            .attr("x", xScale(vertport.latitude))
            .attr("y", yScale(vertport.longitude) - 5)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "top")
            .text(vertport?.name);
        })
        .on("mouseout", function () {
          svg.selectAll(".vert-InfoHover" + vertport?.id).remove();
        });
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

    Object?.entries(uamData)?.forEach(([key, value]) => {
      const color = colorPicker(value.Altitude);

      if ((value?.FIXM !== "") & (key == "NGDS001")) {
        const path = svg.select(".path-uam" + key);
        if (path.empty()) {
          svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("class", "path-uam" + key)
            .attr("stroke", color)
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-dashoffset", 0)
            .attr("stroke-width", 2)
            .attr(
              "d",
              line.x((d) => scale.xScale(d.x)).y((d) => scale.yScale(d.y)) // apply yScale
            )
            .on("mouseover", function () {
              svg
                .append("path")
                .datum(value.FIXM.route)
                .attr("class", "Path-UamPredictLine" + key)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2)
                .attr(
                  "d",
                  d3
                    .line()
                    .x((d) => scale.xScale(parseInt(d.longitude)))
                    .y((d) => scale.yScale(parseInt(d.latitude)))
                    .curve(d3.curveCardinal)
                );
            })
            .on("mouseout", function () {
              svg.selectAll(".Path-UamPredictLine" + key).remove();
            });
        } else {
          path
            .datum(data)
            .attr(
              "d",
              line.x((d) => scale.xScale(d.x)).y((d) => scale.yScale(d.y))
            )
            .attr("stroke", color);
        }

        const uamInfo = svg.select(".path-uamInfo" + key);
        if (uamInfo.empty()) {
          svg
            .append("circle")
            .attr("class", "path-uamInfo" + key)
            .attr("cx", scale.xScale(data[data.length - 1].x))
            .attr("cy", scale.yScale(data[data.length - 1].y))
            .attr("r", 9)
            .attr("fill", color)
            .on("mouseover", function () {
              svg
                .append("path")
                .datum(value.FIXM.route)
                .attr("class", "Path-UamPredictLine" + key)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2)
                .attr(
                  "d",
                  d3
                    .line()
                    .x((d) => scale.xScale(parseInt(d.longitude)))
                    .y((d) => scale.yScale(parseInt(d.latitude)) - 9)
                    .curve(d3.curveCardinal)
                );
              svg
                .append("text")
                .attr("class", "path-uamInfoHover" + key)
                .attr("x", scale.xScale(HOVER_INFO_X))
                .attr("y", scale.yScale(HOVER_INFO_Y))
                .attr("fill", "white")
                .text(`ID: ${key} Longitude: Latitude: Altitude: `);
            })
            .on("mouseout", function () {
              svg.selectAll(".Path-UamPredictLine" + key).remove();
              svg.selectAll(".path-uamInfoHover" + key).remove();
            });
          svg
            .append("text")
            .text(key)
            .attr("class", "path-uamInfoText" + key)
            .attr("x", scale.xScale(data[data.length - 1].x)) // circle 위치에서 x값 + 10
            .attr("y", scale.yScale(data[data.length - 1].y)) // circle 위치에서 y값 - 10
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "top");
        } else {
          uamInfo
            .attr("cx", scale.xScale(data[data.length - 1].x))
            .attr("cy", scale.yScale(data[data.length - 1].y))
            .attr("fill", color);
          svg
            .select(".path-uamInfoText" + key)
            .attr("x", scale.xScale(data[data.length - 1].x)) // circle 위치에서 x값 + 10
            .attr("y", scale.yScale(data[data.length - 1].y) - 9)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "top");
        }
      }
    });
  };

  const resetZoom = () => {
    const svg = d3.select(svgRef.current);
    if (svg) {
      svg.attr("transform", d3.zoomIdentity);
      svg.call(d3.zoom().on("zoom", null));
      const zoom = d3.zoom().on("zoom", null);
      svg.call(zoom.transform, d3.zoomIdentity);
      svg.call(zoom);
      drawZoom();
    }
  };

  const findLandUam = () => {
    // vertportInfo();
    // 새 데이터들을 통해 버티포트랑 겹치는지 판단
    // 겹치면 uamData목록에서 삭제
  };

  const deleteUam = (id) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll(".Path-UamPredictLine" + id).remove();
    svg.selectAll(".path-uam" + id).remove();
    svg.selectAll(".path-uamInfo" + id).remove();
  };

  useEffect(() => {
    if (scale) {
      drawUamPath();
    }
  }, [data]);

  useEffect(() => {
    drawZoom();
    getVertports().then(({ data }) => {
      setVertportInfo(data);
      setScale(drawVertport(data));
    });
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === 82) {
        resetZoom();
      }
    });
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
