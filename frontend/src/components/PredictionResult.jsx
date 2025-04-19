export default function PredictionResult({ result }) {
    if (result === null || result === undefined) return null;
  
    // Determine risk levels based on ART coverage percentage
    const getRiskLevel = (percentage) => {
      if (percentage < 30) return { 
        level: "Critical Risk", 
        color: "bg-red-100 border-red-300 text-red-800",
        icon: "🛑",
        action: "Immediate intervention required"
      };
      if (percentage < 50) return {
        level: "High Risk",
        color: "bg-orange-100 border-orange-300 text-orange-800",
        icon: "⚠️",
        action: "Needs urgent improvement"
      };
      if (percentage < 75) return {
        level: "Moderate Risk",
        color: "bg-yellow-100 border-yellow-300 text-yellow-800",
        icon: "🔸",
        action: "Recommended improvements"
      };
      return {
        level: "Low Risk",
        color: "bg-green-100 border-green-300 text-green-800",
        icon: "✅",
        action: "Meeting WHO targets"
      };
    };
  
    const { level, color, icon, action } = getRiskLevel(result);
  
    return (
      <div className={`mt-8 p-6 border rounded-lg max-w-4xl mx-auto ${color}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">ART Coverage Prediction</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-4xl font-bold mr-3">
                {result.toFixed(1)}%
              </span>
              <span className="text-lg">
                {icon} {level}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">WHO Target: ≥75%</p>
            <p className="text-sm mt-1">{action}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Interpretation Guidance:</h4>
          <ul className="text-sm space-y-1">
            <li>• &lt;30%: Critical public health concern</li>
            <li>• 30-49%: High priority for intervention</li>
            <li>• 50-74%: Needs improvement</li>
            <li>• ≥75%: Meeting global targets</li>
          </ul>
        </div>
      </div>
    );
  }