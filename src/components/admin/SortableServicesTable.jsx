'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Edit, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteButton from '@/components/admin/DeleteButton';
import { toast } from 'sonner';

function SortableRow({ service }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative'
  };

  return (
    <tr ref={setNodeRef} style={style} className={`hover:bg-gray-50 transition ${isDragging ? 'bg-blue-50 shadow-lg' : ''} bg-white`}>
      <td className="p-4 w-12 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <GripVertical className="w-5 h-5 text-gray-400" />
      </td>
      <td className="p-4 font-medium text-gray-900">{service.nameEn}</td>
      <td className="p-4">
        {service.isDraft ? <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">DRAFT</span> : <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">PUBLISHED</span>}
      </td>
      <td className="p-4 text-gray-600">Rs {service.basePrice?.toLocaleString() || 'Custom'}</td>
      <td className="p-4 flex justify-end space-x-3 items-center">
        <Link href={`/admin/services/${service.id}/edit`} className="text-gray-400 hover:text-blue-600 transition"><Edit className="w-5 h-5" /></Link>
        <DeleteButton id={service.id} title={service.nameEn} endpoint={`/api/admin/services/${service.id}`} />
      </td>
    </tr>
  );
}

export default function SortableServicesTable({ initialServices }) {
  const [services, setServices] = useState(initialServices);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = services.findIndex(s => s.id === active.id);
      const newIndex = services.findIndex(s => s.id === over.id);
      const newOrder = arrayMove(services, oldIndex, newIndex);
      setServices(newOrder);

      const items = newOrder.map((s, idx) => ({ id: s.id, sortOrder: idx }));

      try {
        const res = await fetch('/api/admin/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'SERVICE', items })
        });
        if (!res.ok) throw new Error('Failed to save new order');
        toast.success('Order saved');
      } catch (err) {
        toast.error('Failed to save order');
        setServices(initialServices);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b">
              <th className="p-4 w-12"></th>
              <th className="p-4 font-semibold">Service Name</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Base Price</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <tbody className="divide-y divide-gray-100 relative">
              <SortableContext items={services.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {services.length > 0 ? services.map(svc => (
                  <SortableRow key={svc.id} service={svc} />
                )) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No services found.</td>
                  </tr>
                )}
              </SortableContext>
            </tbody>
          </DndContext>
        </table>
      </div>
    </div>
  );
}
