
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryStat } from "@/types";

interface WorkerCategoryChartProps {
  data: CategoryStat[];
}

export function WorkerCategoryChart({ data }: WorkerCategoryChartProps) {
  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#84cc16'];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Workers by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={2}
                dataKey="count"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [`${value} workers`, name]}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((category, index) => (
            <div key={category.category} className="flex items-center text-sm">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span className="truncate">{category.category}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
