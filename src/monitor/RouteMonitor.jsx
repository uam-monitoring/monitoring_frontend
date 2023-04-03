import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const Circles = () => {
  const [dataset, setDataset] = useState(generateDataset());
  const ref = useRef();

  useEffect(() => {
    const svgElement = d3.select(ref.current);
    svgElement
      .selectAll("circle")
      .data(dataset)
      .join("circle")
      .attr("cx", (d) => d[0])
      .attr("cy", (d) => d[1])
      .attr("r", 3);
  }, [dataset]);

  useInterval(() => {
    const newDataset = generateDataset();
    setDataset(newDataset);
  }, 2000);

  return <svg viewBox="0 0 100 50" ref={ref} />;
};

export default function RouteMonitor() {
  return <Circles />;
}
