/**
 * Tests for Sidebar component
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '@/components/common/Sidebar';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, legacyBehavior }: { children: React.ReactNode; href: string; legacyBehavior?: boolean }) => {
    if (legacyBehavior) {
      return React.cloneElement(children as React.ReactElement, { href });
    }
    return <a href={href}>{children}</a>;
  };
});

describe('Sidebar', () => {
  const defaultProps = {
    isCollapsed: false,
    setIsCollapsed: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render sidebar', () => {
      render(<Sidebar {...defaultProps} />);

      expect(screen.getByText('BattleTech')).toBeInTheDocument();
    });

    it('should render navigation items', () => {
      render(<Sidebar {...defaultProps} />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Units')).toBeInTheDocument();
      expect(screen.getByText('Equipment')).toBeInTheDocument();
      expect(screen.getByText('Compendium')).toBeInTheDocument();
      expect(screen.getByText('Customizer')).toBeInTheDocument();
      expect(screen.getByText('Compare')).toBeInTheDocument();
    });

    it('should display version when expanded', () => {
      render(<Sidebar {...defaultProps} isCollapsed={false} />);

      expect(screen.getByText('Editor v0.1.0')).toBeInTheDocument();
    });
  });

  describe('Collapsed state', () => {
    it('should hide title when collapsed', () => {
      render(<Sidebar {...defaultProps} isCollapsed={true} />);

      expect(screen.queryByText('BattleTech')).not.toBeInTheDocument();
    });

    it('should hide nav labels when collapsed', () => {
      render(<Sidebar {...defaultProps} isCollapsed={true} />);

      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Units')).not.toBeInTheDocument();
    });

    it('should hide version when collapsed', () => {
      render(<Sidebar {...defaultProps} isCollapsed={true} />);

      expect(screen.queryByText('Editor v0.1.0')).not.toBeInTheDocument();
    });

    it('should have narrow width when collapsed', () => {
      const { container } = render(<Sidebar {...defaultProps} isCollapsed={true} />);

      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar).toHaveClass('w-20');
    });

    it('should have wide width when expanded', () => {
      const { container } = render(<Sidebar {...defaultProps} isCollapsed={false} />);

      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar).toHaveClass('w-64');
    });
  });

  describe('Toggle functionality', () => {
    it('should call setIsCollapsed when toggle button clicked', () => {
      const setIsCollapsed = jest.fn();
      render(<Sidebar {...defaultProps} isCollapsed={false} setIsCollapsed={setIsCollapsed} />);

      const toggleButton = screen.getByRole('button', { name: /collapse sidebar/i });
      fireEvent.click(toggleButton);

      expect(setIsCollapsed).toHaveBeenCalledWith(true);
    });

    it('should expand when toggle clicked while collapsed', () => {
      const setIsCollapsed = jest.fn();
      render(<Sidebar {...defaultProps} isCollapsed={true} setIsCollapsed={setIsCollapsed} />);

      const toggleButton = screen.getByRole('button', { name: /expand sidebar/i });
      fireEvent.click(toggleButton);

      expect(setIsCollapsed).toHaveBeenCalledWith(false);
    });
  });

  describe('Navigation links', () => {
    it('should have correct href for Dashboard', () => {
      render(<Sidebar {...defaultProps} />);

      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveAttribute('href', '/');
    });

    it('should have correct href for Units', () => {
      render(<Sidebar {...defaultProps} />);

      const unitsLink = screen.getByText('Units').closest('a');
      expect(unitsLink).toHaveAttribute('href', '/units');
    });

    it('should have correct href for Equipment', () => {
      render(<Sidebar {...defaultProps} />);

      const equipmentLink = screen.getByText('Equipment').closest('a');
      expect(equipmentLink).toHaveAttribute('href', '/equipment');
    });

    it('should have correct href for Compendium', () => {
      render(<Sidebar {...defaultProps} />);

      const compendiumLink = screen.getByText('Compendium').closest('a');
      expect(compendiumLink).toHaveAttribute('href', '/compendium');
    });

    it('should have correct href for Customizer', () => {
      render(<Sidebar {...defaultProps} />);

      const customizerLink = screen.getByText('Customizer').closest('a');
      expect(customizerLink).toHaveAttribute('href', '/customizer');
    });

    it('should have correct href for Compare', () => {
      render(<Sidebar {...defaultProps} />);

      const compareLink = screen.getByText('Compare').closest('a');
      expect(compareLink).toHaveAttribute('href', '/compare');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible toggle button label when expanded', () => {
      render(<Sidebar {...defaultProps} isCollapsed={false} />);

      expect(screen.getByRole('button', { name: /collapse sidebar/i })).toBeInTheDocument();
    });

    it('should have accessible toggle button label when collapsed', () => {
      render(<Sidebar {...defaultProps} isCollapsed={true} />);

      expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have dark background', () => {
      const { container } = render(<Sidebar {...defaultProps} />);

      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar).toHaveClass('bg-gray-800');
    });

    it('should be fixed positioned', () => {
      const { container } = render(<Sidebar {...defaultProps} />);

      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar).toHaveClass('fixed');
    });

    it('should have transition classes', () => {
      const { container } = render(<Sidebar {...defaultProps} />);

      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar).toHaveClass('transition-all');
    });
  });
});

