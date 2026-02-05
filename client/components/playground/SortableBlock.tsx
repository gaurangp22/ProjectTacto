import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from './Block';
import type { BlockDefinition } from '../../data/playground/blockTypes';

interface Props {
  id: string;
  blockDef: BlockDefinition;
  value?: number | string;
  onValueChange: (id: string, val: number | string) => void;
  isActive?: boolean;
  indent?: number; // New prop
}

export const SortableBlock: React.FC<Props> = ({ id, blockDef, value, onValueChange, isActive = false, indent = 0 }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : 1,
    marginLeft: `${indent * 24}px`, // Apply indentation
    position: 'relative' as const, // Ensure typical CSS properties are explicit
  };

  // Add visual connector line if indented
  const showConnector = indent > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing relative"
    >
      {showConnector && (
        <div
          className="absolute -left-3 top-0 bottom-0 w-0.5 bg-slate-200 rounded-full"
          style={{ left: '-12px' }}
        />
      )}
      <Block id={id} blockDef={blockDef} value={value} onValueChange={onValueChange} isActive={isActive} />
    </div>
  );
};
