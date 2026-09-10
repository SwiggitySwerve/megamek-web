import React, { useEffect, useState } from 'react';

import { logger } from '@/utils/logger';

interface CategoryNavigationProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/meta/categories');
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }
        const data = (await response.json()) as string[];
        setCategories(data);
      } catch (err) {
        logger.error(err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading categories...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <nav className="bg-surface-raised h-full w-full p-4 md:w-64">
      <h3 className="mb-2 text-lg font-semibold">Unit Categories</h3>
      <ul>
        {/* Option to select all/clear filter */}
        <li key="all-categories" className="mb-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full rounded px-2 py-1 text-left ${
              selectedCategory === null
                ? 'bg-accent text-on-accent'
                : 'hover:bg-surface-raised'
            }`}
          >
            All Units
          </button>
        </li>
        {categories.map((category) => (
          <li key={category} className="mb-1">
            <button
              onClick={() => onSelectCategory(category)}
              className={`w-full rounded px-2 py-1 text-left ${
                selectedCategory === category
                  ? 'bg-accent text-on-accent'
                  : 'hover:bg-surface-raised'
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNavigation;
