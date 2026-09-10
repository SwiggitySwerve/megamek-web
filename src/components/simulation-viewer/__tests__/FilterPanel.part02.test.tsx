import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

import type {
  IFilterPanelProps,
  IFilterDefinition,
} from '@/components/simulation-viewer/types';

import { FilterPanel } from '../FilterPanel';

const severityFilter: IFilterDefinition = {
  id: 'severity',
  label: 'Severity',
  options: ['critical', 'warning', 'info'],
  optionLabels: { critical: 'Critical', warning: 'Warning', info: 'Info' },
};

const typeFilter: IFilterDefinition = {
  id: 'type',
  label: 'Anomaly Type',
  options: ['heat-suicide', 'passive-unit', 'no-progress'],
  optionLabels: {
    'heat-suicide': 'Heat Suicide',
    'passive-unit': 'Passive Unit',
    'no-progress': 'No Progress',
  },
};

const defaultProps: IFilterPanelProps = {
  filters: [severityFilter, typeFilter],
  activeFilters: {},
  onFilterChange: jest.fn(),
};

const activeProps: IFilterPanelProps = {
  ...defaultProps,
  activeFilters: {
    severity: ['critical', 'warning'],
    type: ['heat-suicide'],
  },
};

describe('FilterPanel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  describe('Search', () => {
    it('does not render search input when enableSearch is false', () => {
      render(<FilterPanel {...defaultProps} />);

      expect(
        screen.queryByTestId('filter-search-input'),
      ).not.toBeInTheDocument();
    });

    it('renders search input when enableSearch is true', () => {
      render(<FilterPanel {...defaultProps} enableSearch />);

      expect(screen.getByTestId('filter-search-input')).toBeInTheDocument();
    });

    it('shows search query value in input', () => {
      render(<FilterPanel {...defaultProps} enableSearch searchQuery="test" />);

      expect(screen.getByTestId('filter-search-input')).toHaveValue('test');
    });

    it('debounces search callback by 300ms', () => {
      const onSearchChange = jest.fn();
      render(
        <FilterPanel
          {...defaultProps}
          enableSearch
          onSearchChange={onSearchChange}
        />,
      );

      fireEvent.change(screen.getByTestId('filter-search-input'), {
        target: { value: 'heat' },
      });

      expect(onSearchChange).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(onSearchChange).toHaveBeenCalledWith('heat');
    });

    it('resets debounce timer on subsequent input', () => {
      const onSearchChange = jest.fn();
      render(
        <FilterPanel
          {...defaultProps}
          enableSearch
          onSearchChange={onSearchChange}
        />,
      );

      fireEvent.change(screen.getByTestId('filter-search-input'), {
        target: { value: 'he' },
      });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      fireEvent.change(screen.getByTestId('filter-search-input'), {
        target: { value: 'heat' },
      });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(onSearchChange).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(onSearchChange).toHaveBeenCalledTimes(1);
      expect(onSearchChange).toHaveBeenCalledWith('heat');
    });

    it('does not call onSearchChange when enableSearch is false', () => {
      const onSearchChange = jest.fn();
      render(
        <FilterPanel
          {...defaultProps}
          enableSearch={false}
          onSearchChange={onSearchChange}
        />,
      );

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(onSearchChange).not.toHaveBeenCalled();
    });

    it('has accessible aria-label on search input', () => {
      render(<FilterPanel {...defaultProps} enableSearch />);

      expect(screen.getByTestId('filter-search-input')).toHaveAttribute(
        'aria-label',
        'Search filters',
      );
    });
  });

  describe('Keyboard Navigation', () => {
    it('checkboxes are accessible via keyboard (native checkbox behavior)', () => {
      render(<FilterPanel {...defaultProps} />);

      const checkbox = screen.getByTestId('checkbox-severity-critical');
      expect(checkbox.tagName).toBe('INPUT');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('Clear All button is keyboard focusable', () => {
      render(<FilterPanel {...activeProps} />);

      const clearBtn = screen.getByTestId('clear-all-button');
      expect(clearBtn.tagName).toBe('BUTTON');
      expect(clearBtn).toHaveAttribute('type', 'button');
    });

    it('badge close buttons are keyboard focusable', () => {
      render(<FilterPanel {...activeProps} />);

      const closeBtn = screen.getByTestId('badge-close-severity-critical');
      expect(closeBtn.tagName).toBe('BUTTON');
      expect(closeBtn).toHaveAttribute('type', 'button');
    });

    it('summary elements have aria-label for screen readers', () => {
      render(<FilterPanel {...defaultProps} />);

      expect(screen.getByTestId('filter-summary-severity')).toHaveAttribute(
        'aria-label',
        'Severity filter section',
      );
      expect(screen.getByTestId('filter-summary-type')).toHaveAttribute(
        'aria-label',
        'Anomaly Type filter section',
      );
    });

    it('badge close buttons have accessible aria-label', () => {
      render(<FilterPanel {...activeProps} />);

      expect(
        screen.getByTestId('badge-close-severity-critical'),
      ).toHaveAttribute('aria-label', 'Remove Critical filter');
    });
  });

  describe('Semantic palette', () => {
    it('uses the semantic surface token on the container', () => {
      render(<FilterPanel {...defaultProps} />);

      expect(screen.getByTestId('filter-panel')).toHaveClass('bg-surface-base');
    });

    it('uses the semantic border token on the container', () => {
      render(<FilterPanel {...defaultProps} />);

      expect(screen.getByTestId('filter-panel')).toHaveClass(
        'border-border-theme-subtle',
      );
    });

    it('uses the semantic secondary-text token on the header', () => {
      render(<FilterPanel {...defaultProps} />);

      const header = screen.getByTestId('filter-header').querySelector('h3');
      expect(header).toHaveClass('text-text-theme-secondary');
    });

    it('uses semantic accent tokens on active badges', () => {
      render(<FilterPanel {...activeProps} />);

      const badge = screen.getByTestId('badge-severity-critical');
      expect(badge).toHaveClass('bg-accent-muted');
      expect(badge).toHaveClass('text-accent');
    });

    it('uses semantic surface, text, and border tokens on search input', () => {
      render(<FilterPanel {...defaultProps} enableSearch />);

      const input = screen.getByTestId('filter-search-input');
      expect(input).toHaveClass('bg-surface-base');
      expect(input).toHaveClass('text-text-theme-primary');
      expect(input).toHaveClass('border-border-theme-subtle');
    });

    it('has dark mode classes on Clear All button', () => {
      render(<FilterPanel {...activeProps} />);

      expect(screen.getByTestId('clear-all-button')).toHaveClass(
        'dark:text-red-400',
      );
    });
  });

  describe('Responsive', () => {
    it('uses details elements for collapsible sections', () => {
      render(<FilterPanel {...defaultProps} />);

      const section = screen.getByTestId('filter-section-severity');
      expect(section.tagName).toBe('DETAILS');
    });

    it('uses summary elements for section headers', () => {
      render(<FilterPanel {...defaultProps} />);

      const summary = screen.getByTestId('filter-summary-severity');
      expect(summary.tagName).toBe('SUMMARY');
    });

    it('details can be toggled via click on summary', () => {
      render(<FilterPanel {...defaultProps} />);

      const details = screen.getByTestId('filter-section-severity');
      const summary = screen.getByTestId('filter-summary-severity');

      expect(details).toHaveAttribute('open');
      fireEvent.click(summary);
      expect(details).not.toHaveAttribute('open');
    });
  });

  describe('Edge Cases', () => {
    it('renders empty state when no filters provided', () => {
      render(<FilterPanel {...defaultProps} filters={[]} />);

      expect(screen.getByTestId('empty-filters-message')).toHaveTextContent(
        'No filters available',
      );
    });

    it('renders single filter correctly', () => {
      render(<FilterPanel {...defaultProps} filters={[severityFilter]} />);

      expect(screen.getByTestId('filter-section-severity')).toBeInTheDocument();
      expect(
        screen.queryByTestId('filter-section-type'),
      ).not.toBeInTheDocument();
    });

    it('handles activeFilters with keys not matching any filter definition', () => {
      render(
        <FilterPanel
          {...defaultProps}
          activeFilters={{ unknown: ['value'] }}
        />,
      );

      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      expect(screen.queryByTestId('active-badges')).not.toBeInTheDocument();
    });

    it('handles filter with empty options array', () => {
      const emptyFilter: IFilterDefinition = {
        id: 'empty',
        label: 'Empty',
        options: [],
      };
      render(<FilterPanel {...defaultProps} filters={[emptyFilter]} />);

      expect(screen.getByTestId('filter-section-empty')).toBeInTheDocument();
      expect(screen.getByTestId('filter-options-empty')).toBeInTheDocument();
    });

    it('syncs local search when searchQuery prop changes', () => {
      const { rerender } = render(
        <FilterPanel {...defaultProps} enableSearch searchQuery="initial" />,
      );

      expect(screen.getByTestId('filter-search-input')).toHaveValue('initial');

      rerender(
        <FilterPanel {...defaultProps} enableSearch searchQuery="updated" />,
      );

      expect(screen.getByTestId('filter-search-input')).toHaveValue('updated');
    });
  });

  describe('Styling', () => {
    it('uses semantic container classes', () => {
      render(<FilterPanel {...defaultProps} />);

      const panel = screen.getByTestId('filter-panel');
      expect(panel).toHaveClass('bg-surface-base');
      expect(panel).toHaveClass('rounded-lg');
      expect(panel).toHaveClass('p-4');
      expect(panel).toHaveClass('border');
      expect(panel).toHaveClass('border-border-theme-subtle');
    });

    it('uses semantic badge styling classes', () => {
      render(<FilterPanel {...activeProps} />);

      const badge = screen.getByTestId('badge-severity-critical');
      expect(badge).toHaveClass('bg-accent-muted');
      expect(badge).toHaveClass('text-accent');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveClass('px-3');
      expect(badge).toHaveClass('py-1');
      expect(badge).toHaveClass('text-sm');
      expect(badge).toHaveClass('font-medium');
    });

    it('has correct search input styling', () => {
      render(<FilterPanel {...defaultProps} enableSearch />);

      const input = screen.getByTestId('filter-search-input');
      expect(input).toHaveClass('w-full');
      expect(input).toHaveClass('px-4');
      expect(input).toHaveClass('py-2');
      expect(input).toHaveClass('rounded-md');
      expect(input).toHaveClass('focus:ring-2');
      expect(input).toHaveClass('focus:ring-accent');
    });

    it('has correct Clear All button styling', () => {
      render(<FilterPanel {...activeProps} />);

      const btn = screen.getByTestId('clear-all-button');
      expect(btn).toHaveClass('text-sm');
      expect(btn).toHaveClass('text-red-600');
      expect(btn).toHaveClass('hover:underline');
      expect(btn).toHaveClass('focus:ring-2');
      expect(btn).toHaveClass('focus:ring-accent');
    });

    it('has correct checkbox styling', () => {
      render(<FilterPanel {...defaultProps} />);

      const checkbox = screen.getByTestId('checkbox-severity-critical');
      expect(checkbox).toHaveClass('accent-accent');
      expect(checkbox).toHaveClass('h-4');
      expect(checkbox).toHaveClass('w-4');
    });
  });
});
