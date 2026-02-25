"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  'hsl(217, 91%, 60%)', // Primary Blue
  'hsl(217, 91%, 40%)', // Darker Blue
  'hsl(217, 91%, 80%)', // Lighter Blue
  'hsl(215, 25%, 25%)', // Slate
];

const CategoryChart = ({ data }: CategoryChartProps) => {
  return (
    <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden h-full">
      <CardHeader className="border-b border-white/5 px-8 py-6">
        <CardTitle className="text-xl font-bold">Service Focus</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(222, 47%, 6%)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;