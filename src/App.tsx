import React, { useRef, useState } from "react";
import {
  FaLocationArrow,
  FaLocationDot,
} from "react-icons/fa6";
import {
  MdLocationOff,
  MdOutlineMyLocation,
} from "react-icons/md";
import { RiUserLocationLine } from "react-icons/ri";
import {
  HiArrowSmDown,
  HiOutlineChevronDoubleDown,
} from "react-icons/hi";
import { FcDown } from "react-icons/fc";

const MapView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState({
    isDragging: false,
    position: { x: 0, y: 0 },
    scale: 1,
    showDiv: false,
    divPosition: { x: 0, y: 0 },
    icons: [] as { x: number; y: number; icon: JSX.Element }[],
  });
  const startPosition = useRef({ x: 0, y: 0 });

  const updateState = (newState: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...newState }));

  const handleMouseDown = (e: React.MouseEvent) => {
    updateState({ isDragging: true });
    startPosition.current = {
      x: e.clientX - state.position.x,
      y: e.clientY - state.position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!state.isDragging) return;
    const newX = e.clientX - startPosition.current.x;
    const newY = e.clientY - startPosition.current.y;
    updateState({ position: { x: newX, y: newY } });
  };

  const handleMouseUp = () => updateState({ isDragging: false });

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - state.position.x) / state.scale;
    const clickY = (e.clientY - rect.top - state.position.y) / state.scale;
    updateState({ divPosition: { x: clickX, y: clickY }, showDiv: true });
  };

  const handleWheel = (e: React.WheelEvent) => {
    const newScale = e.deltaY < 0
      ? Math.min(state.scale + 0.1, 3)
      : Math.max(state.scale - 0.1, 0.5);
    updateState({ scale: newScale });
  };

  const handleIconClick = (icon: JSX.Element) => {
    updateState({
      icons: [...state.icons, { x: state.divPosition.x, y: state.divPosition.y, icon }],
      showDiv: false,
    });
  };

  const iconsList = [
    { icon: <FaLocationDot />, key: "location-dot" },
    { icon: <FaLocationArrow />, key: "location-arrow" },
    { icon: <MdOutlineMyLocation />, key: "my-location" },
    { icon: <RiUserLocationLine />, key: "user-location" },
    { icon: <MdLocationOff />, key: "location-off" },
    { icon: <HiArrowSmDown />, key: "arrow-down" },
    { icon: <HiOutlineChevronDoubleDown />, key: "double-arrow-down" },
    { icon: <FcDown />, key: "down-icon" },
  ];

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-hidden relative cursor-grab"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
    >
      <img
        src="../public/ddd.png"
        alt="Map"
        className="absolute top-0 left-0 origin-top-left"
        style={{
          transform: `translate(${state.position.x}px, ${state.position.y}px) scale(${state.scale})`,
        }}
      />

      {state.showDiv && (
        <div
          className="absolute w-20 bg-white/90 border border-gray-300 rounded-lg shadow-md p-2 z-50"
          style={{
            left: `${state.divPosition.x * state.scale + state.position.x}px`,
            top: `${state.divPosition.y * state.scale + state.position.y}px`,
          }}
        >
          <ul className="list-none m-0 p-0">
            {iconsList.map(({ icon, key }) => (
              <li
                key={key}
                className="flex items-center justify-center p-1 mb-1 text-xs bg-gray-100 rounded transition-colors hover:bg-gray-200 cursor-pointer"
                onClick={() => handleIconClick(icon)}
              >
                {icon}
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.icons.map((icon, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-orange-600 bg-white/80 border border-orange-500 rounded-full p-1 shadow-md transition-transform hover:scale-110 hover:bg-orange-600 hover:text-white"
          style={{
            left: `${icon.x * state.scale + state.position.x}px`,
            top: `${icon.y * state.scale + state.position.y}px`,
          }}
        >
          {icon.icon}
        </div>
      ))}
    </div>
  );
};

export default MapView;
