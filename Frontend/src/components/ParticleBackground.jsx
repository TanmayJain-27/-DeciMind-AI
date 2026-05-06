import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function ParticleBackground() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: {
            value: "#020617", // deep dark blue
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            repulse: { distance: 120 },
            push: { quantity: 4 },
          },
        },
        particles: {
          color: {
            value: ["#38bdf8", "#22c55e", "#facc15"],
          },
          links: {
            enable: true,
            color: "#94a3b8",
            distance: 150,
            opacity: 0.3,
          },
          move: {
            enable: true,
            speed: 1.2,
          },
          number: {
            value: 70,
            density: {
              enable: true,
              area: 800,
            },
          },
          opacity: {
            value: 0.6,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 4 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}

export default ParticleBackground;