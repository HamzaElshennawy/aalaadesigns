"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

type SubCategory = {
  id: number;
  name: string;
};

type Category = {
  id: number;
  name: string;
  subCategories: SubCategory[];
};

type CategoriesContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined
);

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const cachedCategories = localStorage.getItem("categories_cache");

      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
      } else {
        const response = await fetch("/api/products/categories");
        const data = await response.json();

        setCategories(data);
        localStorage.setItem("categories_cache", JSON.stringify(data));
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);

  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }

  return context;
}
