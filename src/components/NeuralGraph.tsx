import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface NeuralNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  radius: number;
  label: string;
}

const VOCAB = ['MEM', 'COG', 'SYNP', 'DATA', 'PRC', 'RCL', 'TRNS', 'ID', '0xF', '0x4', 'AXN', 'SYN', 'SYS', 'PLS', 'WAV'];

interface NeuralLink extends d3.SimulationLinkDatum<NeuralNode> {
  source: string | NeuralNode;
  target: string | NeuralNode;
  value: number;
}

interface NeuralGraphProps {
  empathySync: number; // 0 to 100
  dimensions?: { width: number; height: number };
}

export default function NeuralGraph({ empathySync }: NeuralGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous SVG
    d3.select(containerRef.current).selectAll('svg').remove();

    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto; opacity: 0.8; overflow: visible;');

    // Calculate node and link density based on empathy
    const nodeCount = Math.floor(20 + (empathySync / 100) * 40); // 20 to 60 nodes
    const linkProbability = 0.05 + (empathySync / 100) * 0.15;

    // Generate random nodes
    const nodes: NeuralNode[] = Array.from({ length: nodeCount }, (_, i) => ({
      id: `node-${i}`,
      group: Math.floor(Math.random() * 3), // different colors/groups
      radius: Math.random() * 3 + 1, // smaller nodes 1 to 4px
      label: Math.random() > 0.5 ? VOCAB[Math.floor(Math.random() * VOCAB.length)] : '', // only label some nodes
    }));

    // Generate random links
    const links: NeuralLink[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < linkProbability) {
          links.push({
            source: nodes[i].id,
            target: nodes[j].id,
            value: Math.random() * 1.5 + 0.5, // line thickness
          });
        }
      }
    }

    // Force simulation
    // Simulation parameters become tighter/faster as sync increases
    const forceCharge = -30 - (empathySync / 100) * 50;
    const forceLinkDistanceRange = [50, 150 - (empathySync / 100) * 80];

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(() => Math.random() * (forceLinkDistanceRange[1] - forceLinkDistanceRange[0]) + forceLinkDistanceRange[0])
      )
      .force('charge', d3.forceManyBody().strength(forceCharge))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.02 + (empathySync / 100) * 0.05))
      .force("y", d3.forceY(height / 2).strength(0.02 + (empathySync / 100) * 0.05));

    // Groups to render links, nodes, and labels
    const gLinks = svg.append('g');
    const gNodes = svg.append('g');
    const gLabels = svg.append('g');

    const link = gLinks
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(56, 189, 248, 0.2)') // cyan-400 with opacity
      .attr('stroke-opacity', () => 0.2 + (empathySync / 100) * 0.4)
      .attr('stroke-width', (d) => d.value);

    const node = gNodes
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => d.radius)
      // Different shades of blue/cyan based on group
      .attr('fill', (d) => {
        if (d.group === 0) return 'rgba(56, 189, 248, 0.8)'; // cyan-400
        if (d.group === 1) return 'rgba(59, 130, 246, 0.7)'; // blue-500
        return 'rgba(168, 85, 247, 0.6)'; // purple-500
      })
      .attr('filter', 'url(#glow)');

    const labelData = gLabels
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => d.label)
      .attr('font-size', '8px')
      .attr('fill', 'rgba(148, 163, 184, 0.6)') // text-slate-400 equivalent
      .attr('font-family', 'monospace')
      .attr('text-anchor', 'start')
      .attr('dx', (d) => d.radius + 3)
      .attr('dy', '2.5px');

    // Add glowing effect to nodes
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '2.5')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labelData
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // We can also have an interval that slowly restarts alpha for very gentle continuous fluid drift
    const interval = setInterval(() => {
      simulation.alpha(0.1).restart();
    }, 3000);

    // Responsive update
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      svg.attr('viewBox', [0, 0, newWidth, newHeight]);
      simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2))
                .force("x", d3.forceX(newWidth / 2).strength(0.02 + (empathySync / 100) * 0.05))
                .force("y", d3.forceY(newHeight / 2).strength(0.02 + (empathySync / 100) * 0.05));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      simulation.stop();
      window.removeEventListener('resize', handleResize);
    };
  }, [empathySync]);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
}
