'use client';

/**
 * MaterialIcon — thin wrapper for Google Material Symbols Outlined.
 * Usage: <MaterialIcon name="graphic_eq" className="text-3xl" filled />
 */
export default function MaterialIcon({ name, className = '', filled = false, size }) {
  const sizeClass = size ? `text-[${size}px]` : '';
  const fillStyle = filled ? { fontVariationSettings: "'FILL' 1" } : {};
  
  return (
    <span
      className={`material-symbols-outlined ${sizeClass} ${className}`}
      style={fillStyle}
    >
      {name}
    </span>
  );
}
