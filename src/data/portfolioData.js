// ─── PORTFOLIO DATA ───
// Edit this file to update BOTH modes (Normal + Game) simultaneously.
// Drop images into src/assets/ and reference them with imports below.

import imgRoom from '../assets/Screenshot 2026-06-28 003718.png';
import imgStillLife from '../assets/Screenshot 2026-06-28 003727.png';
import imgCar from '../assets/Screenshot 2026-06-28 011952.png';
import imgPC from '../assets/Screenshot 2026-06-28 012759.png';
import imgFan from '../assets/Screenshot 2026-07-08 210156.png';
import imgSculpture from '../assets/Screenshot 2026-07-08 210434.png';
import imgFlappunkStart from '../assets/Screenshot 2026-07-22 230147.png';
import imgFlappunkPlay from '../assets/Screenshot 2026-07-22 230157.png';
import imgAvatar from '../assets/Screenshot 2026-07-29 221901.png';
import imgHero from '../assets/hero.png';

export const portfolioData = {
  name: "Adwait More",
  title: "Game Developer",
  subtitles: [
    "Unity Developer",
    "C# Engineer",
    "Gameplay Programmer",
    "Pixel Art Enthusiast",
    "Indie Game Dev"
  ],
  email: "adwaitmore2009@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/adwait-more28/",
    github: "https://github.com/Adwait-More"
  },
  profileImage: imgAvatar,
  heroIcon: imgHero,
  about: [
    "I'm a 2nd-year Computer Technology student at SES Polytechnic, Solapur — passionate about building games and interactive experiences from the ground up.",
    "My core stack is Unity + C#: gameplay scripting, physics systems, mobile optimization, UI/UX flow, and game loop architecture. I also leverage C++ for foundational OOP and low-level systems programming.",
    "On the art side, I use Blender to create game-ready assets — stylized environments, low-poly props, and character concepts. I'm focused on shipping playable projects and leveling up my game dev craft every day."
  ],
  skills: [
    { name: "Unity" },
    { name: "C#" },
    { name: "Gameplay Programming" },
    { name: "Blender" },
    { name: "C++" },
    { name: "Game Physics" },
    { name: "Pixel Art" },
    { name: "Mobile Game Dev" },
    { name: "UI/UX Design" },
    { name: "3D Modeling" },
    { name: "Video Editing" },
    { name: "Git" },
  ],
  education: [
    {
      institution: "S.E.S Polytechnic Solapur",
      degree: "High School Diploma, Computer Technology",
      date: "Expected July 2025",
      description: "Studying core CS fundamentals: OOP with C++, data structures, systems programming. Applying knowledge in self-directed Unity and Blender projects."
    }
  ],
  projects: [
    {
      id: "project-flappunk",
      title: "FlappPunk",
      description: "A neon-styled flappy bird clone with cyberpunk aesthetics. Built in Unity for mobile with touch controls, scoring system, and vibrant color block obstacles. Features game loop architecture, physics-based movement, and responsive UI.",
      tags: ["Unity", "C#", "Mobile", "Game Dev"],
      image: imgFlappunkPlay,
      secondaryImage: imgFlappunkStart,
      accentColor: "#64ffda",
      link: "https://adwait-more.itch.io/flappunk"
    },
    {
      id: "project-room",
      title: "Isometric Game Environment",
      description: "A detailed isometric bedroom scene crafted in Blender — designed as a game-ready environment. Features baked lighting, modular props, and optimized geometry for real-time rendering in game engines.",
      tags: ["Blender", "Game Art", "Environment", "Isometric"],
      image: imgRoom,
      accentColor: "#c084fc"
    },
    {
      id: "project-car",
      title: "Low-Poly Racing Vehicle",
      description: "A stylized low-poly sports car designed for racing game environments. Clean topology, efficient UV unwrapping, and game-ready asset pipeline built in Blender.",
      tags: ["Blender", "Game Asset", "Low-Poly", "Vehicles"],
      image: imgCar,
      accentColor: "#ef4444"
    },
    {
      id: "project-pc",
      title: "3D PC Build",
      description: "A wireframe/clay render of a gaming PC case showing internal components: fans, GPU, RAM, motherboard layout. Technical modeling exercise for game-ready hardware props.",
      tags: ["Blender", "3D Modeling", "Hardware"],
      image: imgPC,
      accentColor: "#6b7280"
    },
    {
      id: "project-fan",
      title: "3D CPU Cooler",
      description: "A detailed 3D model of a CPU cooling fan with teal LED accents and mesh grille. Modeled with precision geometry and emission materials in Blender, game-ready.",
      tags: ["Blender", "Game Asset", "Hardware"],
      image: imgFan,
      accentColor: "#22d3ee"
    },
    {
      id: "project-stilllife",
      title: "Blender Still Life",
      description: "A photorealistic still life scene with glass renders — two cups with straws on a checkered tablecloth. Demonstrates glass shader work, caustics, and warm studio lighting.",
      tags: ["Blender", "Rendering", "Photorealism"],
      image: imgStillLife,
      accentColor: "#f59e0b"
    },
    {
      id: "project-sculpture",
      title: "Table Fan Prop",
      description: "A table fan modelled with precision and complete with a rig — ready for game engine import with proper pivot points and animation-ready setup.",
      tags: ["Blender", "Game Asset", "Rigging"],
      image: imgSculpture,
      accentColor: "#a78bfa"
    }
  ]
};
