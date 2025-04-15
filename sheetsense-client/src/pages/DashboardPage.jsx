import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"];

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch("http://localhost:8000/summary");
      const data = await res.json();
      setSummary(data);
    };

    fetchSummary();
  }, []);

  if (!summary) return <div className="text-center mt-10 text-gray-600">Loading analytics...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Sales Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Key Stats */}
        <div className="space-y-4">
          <div className="text-lg">
            <strong>Total Orders:</strong> {summary.total_orders}
          </div>
          <div className="text-lg">
            <strong>Total Revenue:</strong> ₹{summary.total_revenue}
          </div>
          <div className="text-lg">
            <strong>Top Category:</strong> {summary.top_category}
          </div>
        </div>

        {/* Pie Chart */}
        <div>
          <h3 className="text-md font-semibold mb-2">Sales by Category</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={summary.category_distribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {summary.category_distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
