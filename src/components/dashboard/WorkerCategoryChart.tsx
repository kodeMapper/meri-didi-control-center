
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { ServiceType } from "@/types";

interface CategoryData {
  category: ServiceType;
  count: number;
  percentage: number;
}

interface WorkerCategoryChartProps {
  data: CategoryData[];
}

const COLORS = {
  Cleaning: "#FFDA61",
  Cooking: "#ea384c",
  Sweeping: "#1EAEDB",
  Driving: "#4CAF50",
  Landscaping: "#9C27B0",
  Unknown: "#607D8B",
};

const CustomBar = (props: any) => {
  const { x, y, width, height, category } = props;
  const color = COLORS[category as keyof typeof COLORS] || COLORS.Unknown;
  
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      rx={4}
      ry={4}
    />
  );
};

export function WorkerCategoryChart({ data }: WorkerCategoryChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Workers by Category</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              width={80}
              tick={{ fontSize: 14 }}
            />
            <Tooltip
              formatter={(value: number) => [`${value} workers`, "Count"]}
              labelFormatter={(value) => `Category: ${value}`}
            />
            <Bar
              dataKey="count"
              fill="#FFDA61"
              barSize={12}
              shape={<CustomBar />}
              isAnimationActive={true}
            >
              <LabelList
                dataKey="count"
                position="right"
                formatter={(value: number) => value}
                style={{ fontWeight: 500 }}
              />
              <LabelList
                dataKey="percentage"
                position="right"
                offset={40}
                formatter={(value: number) => `${value}%`}
                style={{ fill: "#888", fontWeight: 400 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
