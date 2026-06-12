import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ConfirmModal from '../src/components/ui/ConfirmModal';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  };
});

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
  DialogDescription: ({ children }) => <div>{children}</div>,
  DialogFooter: ({ children }) => <div>{children}</div>,
}));

describe('ConfirmModal Component', () => {
  afterEach(cleanup);

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmModal isOpen={false} onClose={() => {}} onConfirm={() => {}} title="Test Title" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when isOpen is true', () => {
    render(
      <ConfirmModal 
        isOpen={true} 
        onClose={() => {}} 
        onConfirm={() => {}} 
        title="Delete Item" 
        description="Are you sure?" 
      />
    );
    expect(screen.getByText('Delete Item')).toBeDefined();
    expect(screen.getByText('Are you sure?')).toBeDefined();
  });

  it('calls onClose when Cancel button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <ConfirmModal isOpen={true} onClose={handleClose} onConfirm={() => {}} title="Test" />
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Confirm button is clicked', () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmModal 
        isOpen={true} 
        onClose={() => {}} 
        onConfirm={handleConfirm} 
        title="Test" 
        confirmText="Yes, delete it" 
      />
    );
    fireEvent.click(screen.getByText('Yes, delete it'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
