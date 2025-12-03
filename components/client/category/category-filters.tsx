"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number | null; // null means no upper limit
}

interface CategoryFiltersProps {
  showDiscount?: boolean;
  onPriceChange?: (selectedRanges: PriceRange[]) => void;
  productCounts?: Record<string, number>; // Optional: show count per range
}

export function CategoryFilters({
  showDiscount = false,
  onPriceChange,
  productCounts,
}: CategoryFiltersProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    size: true,
    color: true,
    discount: showDiscount,
  });

  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  const priceRanges: PriceRange[] = [
    { id: "price1", label: "Under $25", min: 0, max: 25 },
    { id: "price2", label: "$25 - $50", min: 25, max: 50 },
    { id: "price3", label: "$50 - $100", min: 50, max: 100 },
    { id: "price4", label: "$100 - $200", min: 100, max: 200 },
    { id: "price5", label: "$200+", min: 200, max: null },
  ];

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (rangeId: string) => {
    const newSelectedRanges = selectedPriceRanges.includes(rangeId)
      ? selectedPriceRanges.filter((id) => id !== rangeId)
      : [...selectedPriceRanges, rangeId];

    setSelectedPriceRanges(newSelectedRanges);

    // Call the callback with the selected ranges
    if (onPriceChange) {
      const selected = priceRanges.filter((range) =>
        newSelectedRanges.includes(range.id)
      );
      onPriceChange(selected);
    }
  };

  const handleClearAll = () => {
    setSelectedPriceRanges([]);
    if (onPriceChange) {
      onPriceChange([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Filters</h2>
        <button 
          className="text-sm text-primary hover:underline"
          onClick={handleClearAll}
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full py-2 font-medium"
          onClick={() => toggleSection("categories")}
        >
          Categories
          {openSections.categories ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
        {openSections.categories && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="tops"
                className="rounded text-primary focus:ring-primary mr-2"
              />
              <label htmlFor="tops" className="text-sm">
                Tops
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bottoms"
                className="rounded text-primary focus:ring-primary mr-2"
              />
              <label htmlFor="bottoms" className="text-sm">
                Bottoms
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="dresses"
                className="rounded text-primary focus:ring-primary mr-2"
              />
              <label htmlFor="dresses" className="text-sm">
                Dresses
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="outerwear"
                className="rounded text-primary focus:ring-primary mr-2"
              />
              <label htmlFor="outerwear" className="text-sm">
                Outerwear
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full py-2 font-medium"
          onClick={() => toggleSection("price")}
        >
          Price Range
          {openSections.price ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
        {openSections.price && (
          <div className="mt-2 space-y-2">
            {priceRanges.map((range) => (
              <div key={range.id} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <input
                    type="checkbox"
                    id={range.id}
                    checked={selectedPriceRanges.includes(range.id)}
                    onChange={() => handlePriceChange(range.id)}
                    className="rounded text-primary focus:ring-primary mr-2 cursor-pointer"
                  />
                  <label htmlFor={range.id} className="text-sm cursor-pointer">
                    {range.label}
                  </label>
                </div>
                {productCounts && productCounts[range.id] !== undefined && (
                  <span className="text-xs text-muted-foreground ml-2">
                    ({productCounts[range.id]})
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Size */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full py-2 font-medium"
          onClick={() => toggleSection("size")}
        >
          Size
          {openSections.size ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
        {openSections.size && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map((size) => (
              <button
                key={size}
                className="border rounded-md py-1 px-2 text-sm hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color */}
      <div className="border-b pb-4">
        <button
          className="flex justify-between items-center w-full py-2 font-medium"
          onClick={() => toggleSection("color")}
        >
          Color
          {openSections.color ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
        {openSections.color && (
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { name: "Black", color: "bg-black" },
              { name: "White", color: "bg-white border" },
              { name: "Gray", color: "bg-gray-400" },
              { name: "Red", color: "bg-red-500" },
              { name: "Blue", color: "bg-blue-500" },
              { name: "Green", color: "bg-green-500" },
              { name: "Yellow", color: "bg-yellow-400" },
              { name: "Purple", color: "bg-purple-500" },
              { name: "Pink", color: "bg-pink-400" },
              { name: "Brown", color: "bg-amber-800" },
            ].map((colorOption) => (
              <button
                key={colorOption.name}
                className="w-8 h-8 rounded-full flex items-center justify-center group"
                title={colorOption.name}
              >
                <span
                  className={`w-6 h-6 rounded-full ${colorOption.color} group-hover:ring-2 ring-offset-2 ring-primary transition-all`}
                ></span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Discount - Only show if showDiscount is true */}
      {showDiscount && (
        <div className="border-b pb-4">
          <button
            className="flex justify-between items-center w-full py-2 font-medium"
            onClick={() => toggleSection("discount")}
          >
            Discount
            {openSections.discount ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {openSections.discount && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="discount1"
                  className="rounded text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="discount1" className="text-sm">
                  10% Off or More
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="discount2"
                  className="rounded text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="discount2" className="text-sm">
                  20% Off or More
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="discount3"
                  className="rounded text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="discount3" className="text-sm">
                  30% Off or More
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="discount4"
                  className="rounded text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="discount4" className="text-sm">
                  50% Off or More
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="discount5"
                  className="rounded text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="discount5" className="text-sm">
                  70% Off or More
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
