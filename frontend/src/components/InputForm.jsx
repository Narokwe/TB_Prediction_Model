import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const featureLabels = [
  "Estimated number of people living with HIV_median",
  "Estimated number of people living with HIV_min",
  "Estimated number of people living with HIV_max",
  "Estimated ART coverage among people living with HIV (%)_median",
  "Estimated ART coverage among people living with HIV (%)_min",
  "Estimated ART coverage among people living with HIV (%)_max",
  "rep_meth",
  "new_sp_coh",
  "new_sp_cur",
  "new_sp_cmplt",
  "new_sp_died",
  "new_sp_fail",
  "new_sp_def",
  "c_new_sp_tsr",
  "new_snep_coh",
  "new_snep_cmplt",
  "new_snep_died",
  "new_snep_fail",
  "new_snep_def",
  "c_new_snep_tsr",
  "ret_coh",
  "ret_cur",
  "ret_cmplt",
  "ret_died",
  "ret_fail",
  "ret_def",
  "hiv_new_sp_coh",
  "hiv_new_sp_cur",
  "hiv_new_sp_cmplt",
  "hiv_new_sp_died",
  "hiv_new_sp_fail",
  "hiv_new_sp_def",
  "hiv_new_snep_coh",
  "hiv_new_snep_cmplt",
  "hiv_new_snep_died",
  "hiv_new_snep_fail",
  "hiv_new_snep_def",
  "hiv_ret_coh",
  "hiv_ret_cur",
  "hiv_ret_cmplt",
  "hiv_ret_died",
  "hiv_ret_fail",
  "hiv_ret_def",
  "rel_with_new_flg",
  "newrel_coh",
  "newrel_succ",
  "newrel_fail",
  "newrel_died",
  "newrel_lost",
  "c_new_tsr",
  "ret_nrel_coh",
  "ret_nrel_succ",
  "ret_nrel_fail",
  "ret_nrel_died",
  "ret_nrel_lost",
  "c_ret_tsr",
  "tbhiv_coh",
  "tbhiv_succ",
  "tbhiv_fail",
  "tbhiv_died",
  "tbhiv_lost",
  "c_tbhiv_tsr",
  "mdr_coh",
  "mdr_succ",
  "mdr_fail",
  "mdr_died",
  "mdr_lost",
  "xdr_coh",
  "xdr_succ",
  "xdr_fail",
  "xdr_died",
  "xdr_lost"
];

export default function InputForm({ onPrediction }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(
    Object.fromEntries(featureLabels.map(label => [label, ""]))
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to make predictions");
    
    // Validate all fields are filled
    const emptyFields = featureLabels.filter(label => !formData[label]);
    if (emptyFields.length > 0) {
      alert(`Please fill all fields. Missing: ${emptyFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    try {
      const features = featureLabels.map(label => parseFloat(formData[label]));
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/predict`,
        { features },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      onPrediction(res.data.prediction);
    } catch (err) {
      alert(err.response?.data?.message || "Prediction failed");
      console.error("Prediction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Group features into sections for better organization
  const featureGroups = [
    {
      title: "HIV Estimates",
      features: featureLabels.slice(0, 6)
    },
    {
      title: "TB Treatment Outcomes",
      features: featureLabels.slice(6, 26)
    },
    {
      title: "HIV/TB Co-infection",
      features: featureLabels.slice(26, 42)
    },
    {
      title: "Retreatment & Drug Resistance",
      features: featureLabels.slice(42)
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800">TB/HIV Treatment Coverage Prediction</h2>
      
      {featureGroups.map((group, groupIdx) => (
        <div key={groupIdx} className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-700 border-b pb-2">
            {group.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.features.map((label) => (
              <div key={label} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {label.replace(/_/g, ' ').replace(/(%)/g, '$1')}
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData[label]}
                  onChange={(e) => setFormData({...formData, [label]: e.target.value})}
                  required
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : "Predict ART Coverage"}
        </button>
      </div>
    </form>
  );
}