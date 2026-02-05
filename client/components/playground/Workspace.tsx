
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableBlock } from './SortableBlock';
import { BLOCKS, BlockType } from '../../data/playground/blockTypes';
import { ProgramBlock } from '../../utils/playground/interpreter';

interface Props {
  program: ProgramBlock[];
  onValueChange: (id: string, val: number | string) => void;
  onRemoveBlock: (id: string) => void;
  activeBlockId?: string;
}


export const Workspace: React.FC<Props> = ({ program, onValueChange, onRemoveBlock, activeBlockId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'workspace-droppable',
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        w-full h-full min-h-[500px] overflow-y-auto p-8 transition-colors duration-300
        ${isOver ? 'bg-indigo-50/50' : 'bg-transparent'}
      `}
    >
      <SortableContext items={program.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 min-h-[300px] pb-32">
          {program.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 select-none">
              <div className="w-24 h-24 rounded-3xl bg-slate-100 border-4 border-slate-200 border-dashed mb-4 flex items-center justify-center">
                <span className="text-4xl opacity-50">🧩</span>
              </div>
              <p className="text-lg font-bold">Your Program Area</p>
              <p className="text-sm text-slate-400/80 mt-1 max-w-xs text-center">
                Drag blocks from the palette on the left to start building!
              </p>
            </div>
          ) : (
            (() => {
              let indent = 0;
              return program.map((block) => {
                const blockDef = BLOCKS[block.type as BlockType];

                // Calculate render indentation for THIS block
                let renderIndent = indent;
                if (blockDef.isContainerEnd || block.type === 'ELSE') {
                  renderIndent = Math.max(0, indent - 1);
                }

                // Render block
                const node = (
                  <SortableBlock
                    key={block.id}
                    id={block.id}
                    blockDef={blockDef}
                    value={block.value}
                    onValueChange={(val) => onValueChange(block.id, val)}
                    isActive={block.id === activeBlockId}
                    indent={renderIndent}
                  />
                );

                // Update indentation for NEXT block
                if (blockDef.isContainer) {
                  indent++;
                } else if (blockDef.isContainerEnd) {
                  indent = Math.max(0, indent - 1);
                }
                // ELSE/ELSE_IF doesn't change indent (it stays indented for internal content), 
                // but the ELSE block itself is outdented (handled by renderIndent)

                return node;
              });
            })()
          )}
        </div>
      </SortableContext>
    </div>
  );
};
