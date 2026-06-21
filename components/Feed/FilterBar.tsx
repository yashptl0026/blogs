"use client";

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="flex justify-center md:justify-start items-center border-b border-editorial-border py-4 overflow-x-auto scrollbar-none">
      <nav className="flex gap-8 text-[10px] font-bold tracking-widest text-editorial-muted whitespace-nowrap">
        {categories.map((category) => {
          const isActive = activeCategory.toUpperCase() === category.toUpperCase();
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`pb-4 relative transition-colors duration-300 hover:text-editorial-text uppercase ${
                isActive ? "text-editorial-text" : "text-editorial-muted"
              }`}
            >
              <span>{category}</span>
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-editorial-accent" 
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
