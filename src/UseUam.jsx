export default function UseUam() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = Math.random(); // alpha component can be any value between 0 and 1
  const color = `rgba(${r}, ${g}, ${b}, ${a})`;
}
