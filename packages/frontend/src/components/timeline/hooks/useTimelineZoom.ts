/**
 * useTimelineZoom Hook
 *
 * Custom hook for managing zoom and pan functionality in the timeline viewer.
 * Uses D3.js zoom behavior for smooth interactions.
 */

import { useEffect, useRef, useState, RefObject } from 'react';
import * as d3 from 'd3';

export interface ZoomTransform {
  k: number; // scale factor
  x: number; // x translation
  y: number; // y translation
}

export interface UseTimelineZoomOptions {
  containerRef: RefObject<HTMLDivElement>;
  minZoom?: number;
  maxZoom?: number;
  onZoomChange?: (transform: ZoomTransform) => void;
}

export interface UseTimelineZoomReturn {
  zoom: d3.ZoomBehavior<HTMLDivElement, unknown> | null;
  transform: ZoomTransform;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
}

/**
 * Custom hook for timeline zoom and pan functionality
 */
export const useTimelineZoom = ({
  containerRef,
  minZoom = 0.5,
  maxZoom = 5,
  onZoomChange,
}: UseTimelineZoomOptions): UseTimelineZoomReturn => {
  const [transform, setTransform] = useState<ZoomTransform>({ k: 1, x: 0, y: 0 });
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<HTMLDivElement, unknown> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = d3.select(containerRef.current);

    // Create zoom behavior
    const zoomBehavior = d3
      .zoom<HTMLDivElement, unknown>()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', (event) => {
        const newTransform: ZoomTransform = {
          k: event.transform.k,
          x: event.transform.x,
          y: event.transform.y,
        };
        setTransform(newTransform);
        if (onZoomChange) {
          onZoomChange(newTransform);
        }
      });

    // Apply zoom behavior to container
    container.call(zoomBehavior);

    zoomBehaviorRef.current = zoomBehavior;

    // Cleanup
    return () => {
      container.on('.zoom', null);
    };
  }, [containerRef, minZoom, maxZoom, onZoomChange]);

  const handleZoomIn = () => {
    if (!containerRef.current || !zoomBehaviorRef.current) return;

    const container = d3.select(containerRef.current);
    container.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!containerRef.current || !zoomBehaviorRef.current) return;

    const container = d3.select(containerRef.current);
    container.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
  };

  const handleResetZoom = () => {
    if (!containerRef.current || !zoomBehaviorRef.current) return;

    const container = d3.select(containerRef.current);
    container
      .transition()
      .duration(300)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  return {
    zoom: zoomBehaviorRef.current,
    transform,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
  };
};
