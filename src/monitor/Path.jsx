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
  const [vertportInfo, setVertportInfo] = useRecoilState(VertportInfoState);
  const uamDataSet = useRecoilValue(UamDataState);
  const [uamData, setUamData] = useState(uamDataSet);
  const [flag, setFlag] = useState(false);
  const updateData = () => {
    setFlag((prev) => !prev);
  };
  const updatePath = (prev, initVal, lastVal) => {
    let minY = -5;
    let maxY = 0;
    let minX = -5;
    let maxX = 0;
    if (initVal.latitude - lastVal.latitude < 0) {
      minY = 0;
      maxY = 5;
    }
    if (initVal.longitude - lastVal.longitude < 0) {
      minX = 0;
      maxX = 5;
    }
    // console.log(initVal, lastVal);
    if (
      (lastVal.latitude - initVal.latitude > 0) &
      (lastVal.latitude - initVal.latitude < 10)
    ) {
      minY = -1;
      maxY = 1;
    }

    if (prev.length === 0) {
      return [
        {
          x: initVal.longitude,
          y: initVal.latitude,
        },
      ];
    }
    return [
      ...prev,
      {
        x:
          prev[prev.length - 1]?.x +
          Math.floor(Math.random() * (maxX - minX + 1)) +
          minX,
        y:
          prev[prev.length - 1]?.y +
          Math.floor(Math.random() * (maxY - minY + 1)) +
          minY,
      },
    ];
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
        .attr("width", 18)
        .attr("height", 18)
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

    Object?.entries(uamDataSet)?.forEach(([key, value]) => {
      const color = colorPicker(value.Altitude);

      if (value?.FIXM !== "") {
        const data = updatePath(
          uamData[key].ADSB,
          value.FIXM.route[0],
          value.FIXM.route[value.FIXM.route.length - 1]
        );
        const newData = { ...uamData[key], ADSB: data };
        setUamData((prevData) => ({ ...prevData, [key]: newData }));
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
            .attr("r", 7)
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
                    .y((d) => scale.yScale(parseInt(d.latitude)) - 3)
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
  }, [flag]);

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
