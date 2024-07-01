import React, { useState, useRef, useEffect, useCallback } from 'react';

interface VirtualListProps {
  itemHeight: number;
  totalItems: number;
  renderItem: (index: number, style: React.CSSProperties) => React.ReactNode;
  containerHeight: number;
}

const useVirtualList = ({ itemHeight, totalItems, renderItem, containerHeight }: VirtualListProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    totalItems - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight)
  );

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push(
      renderItem(i, {
        height: itemHeight,
        position: 'absolute',
        top: i * itemHeight,
        width: '100%',
      })
    );
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [totalItems]);

  return {
    containerProps: {
      ref: containerRef,
      onScroll: handleScroll,
      style: {
        overflowY: 'auto',
        position: 'relative',
        height: containerHeight,
      },
    },
    totalHeight: totalItems * itemHeight,
    visibleItems,
  };
};

export default useVirtualList;