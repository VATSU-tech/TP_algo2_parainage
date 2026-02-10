import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type GraphClient = {
  id: number;
  name: string;
};

type GraphRelation = {
  id: number;
  parrainId: number;
  filleulId: number;
};

type Graph3DProps = {
  clients: GraphClient[];
  relations: GraphRelation[];
  selectedId: number;
  directIds: number[];
  indirectIds: number[];
};

export default function Graph3D({
  clients,
  relations,
  selectedId,
  directIds,
  indirectIds,
}: Graph3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const positions = useMemo(() => {
    const map = new Map<number, { x: number; y: number; z: number }>();
    const layers = 3;
    const baseRadius = 7;
    clients.forEach((client, index) => {
      const layer = index % layers;
      const angle = (index / clients.length) * Math.PI * 2 - Math.PI / 2;
      const radius = baseRadius + layer * 2.2;
      const y = (layer - 1) * 2.4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      map.set(client.id, { x, y, z });
    });
    return map;
  }, [clients]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ffffff");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 8, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(6, 10, 8);
    scene.add(directional);

    const group = new THREE.Group();

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xc9c0b6 });
    relations.forEach((relation) => {
      const from = positions.get(relation.parrainId);
      const to = positions.get(relation.filleulId);
      if (!from || !to) return;

      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(from.x, from.y, from.z),
        new THREE.Vector3(to.x, to.y, to.z),
      ]);
      const line = new THREE.Line(geometry, lineMaterial);
      group.add(line);
    });

    const sphereGeometry = new THREE.SphereGeometry(0.6, 24, 24);
    clients.forEach((client) => {
      const pos = positions.get(client.id);
      if (!pos) return;
      let color = "#f5efe6";
      if (client.id === selectedId) color = "#ff6b4a";
      else if (directIds.includes(client.id)) color = "#2e7d6e";
      else if (indirectIds.includes(client.id)) color = "#6a5acd";

      const material = new THREE.MeshStandardMaterial({ color });
      const sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.set(pos.x, pos.y, pos.z);
      group.add(sphere);
    });

    scene.add(group);

    let frameId = 0;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      scene.clear();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [clients, relations, selectedId, directIds, indirectIds, positions]);

  return <div className="graph-3d" ref={containerRef} />;
}
