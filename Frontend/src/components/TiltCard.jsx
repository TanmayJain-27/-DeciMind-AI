import { useRef } from "react";

function TiltCard({ children, onClick }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y - rect.height / 2) / 12;
    const rotateY = (x - rect.width / 2) / 12;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.06)
    `;
  };

  const resetTilt = () => {
    const card = cardRef.current;
    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onClick={onClick}
      className="
        transition-transform duration-200
        backdrop-blur-xl bg-white/40
        border border-white/30
        rounded-3xl shadow-xl
        cursor-pointer
        hover:shadow-2xl
        hover:ring-2 hover:ring-white/40
      "
    >
      {children}
    </div>
  );
}

export default TiltCard;