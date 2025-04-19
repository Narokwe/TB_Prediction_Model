import { useAuth } from "../context/AuthContext";
import { useMemo } from "react";

export default function Charts() {
  const { user } = useAuth();

  // Sample data structure matching your model's features
  const chartData = useMemo(() => ({
    features: [
      "HIV_median", "HIV_min", "HIV_max", 
      "ART_median", "ART_min", "ART_max",
      // ... other features
    ],
    correlations: [
      { feature: "HIV_median", value: 0.82 },
      { feature: "ret_coh", value: 0.76 },
      // ... other correlations
    ],
    trends: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2023, i).toLocaleString('default', { month: 'short' }),
      coverage: 40 + Math.random() * 35
    }))
  }), []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        TB/HIV Program Analytics
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coverage Trends Chart */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Monthly ART Coverage Trends</h3>
          <div className="h-64 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">[Line chart visualization]</p>
              <div className="flex justify-center space-x-4">
                {chartData.trends.slice(0, 3).map((item) => (
                  <div key={item.month} className="text-sm">
                    <p>{item.month}: {item.coverage.toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Correlations */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Key Predictors of ART Coverage</h3>
          <div className="h-64 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">[Bar chart visualization]</p>
              <ul className="text-sm space-y-1">
                {chartData.correlations.slice(0, 5).map((item) => (
                  <li key={item.feature}>
                    • {item.feature}: {item.value.toFixed(2)} correlation
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Program Indicators */}
        <div className="border p-4 rounded-lg lg:col-span-2">
          <h3 className="font-semibold mb-3">Program Performance Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Treatment Success", value: "78%", trend: "↑ 2%" },
              { name: "Lost to Follow-up", value: "12%", trend: "↓ 1%" },
              { name: "Mortality Rate", value: "5%", trend: "→" },
              { name: "New Cases", value: "142", trend: "↑ 8%" }
            ].map((metric) => (
              <div key={metric.name} className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">{metric.name}</p>
                <p className="text-xl font-semibold mt-1">{metric.value}</p>
                <p className={`text-xs mt-1 ${
                  metric.trend.includes('↑') ? 'text-green-600' : 
                  metric.trend.includes('↓') ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.trend} from last quarter
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}