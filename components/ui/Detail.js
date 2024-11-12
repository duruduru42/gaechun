'use client'

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const [data, setData] = useState(null);
  const supabase = createClient();

  useEffect(() => {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('box-id', data.box.id);

        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setData(data[0]);
        }
      };

      fetchData();
  }, []);

  return (
    <div>
      <h1>Categories</h1>
      <div>
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            style={{ margin: '5px', padding: '10px' }}
          >
            {category}
          </button>
        ))}
      </div>
      <div>
        <h2>{selectedCategory ? `Items in ${selectedCategory}` : 'Select a category'}</h2>
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
