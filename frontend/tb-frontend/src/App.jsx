import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const initialSampleData = {
  Country: 'Kenya',
  "Reported number of people receiving ART": 1200000,
  "Estimated number of people living with HIV": 1400000,
  "Estimated ART coverage among people living with HIV (%)": 85,
  "Estimated number of people living with HIV_median": 1380000,
  "Estimated number of people living with HIV_min": 1350000,
  "Estimated number of people living with HIV_max": 1450000,
  "Estimated ART coverage among people living with HIV (%)_median": 84.5,
  "Estimated ART coverage among people living with HIV (%)_min": 82,
  "Estimated ART coverage among people living with HIV (%)_max": 86,
  "WHO Region": "AFRO",
  iso2: "KE",
  iso3: "KEN",
  iso_numeric: 404,
  g_whoregion: "AFRO",
  year: 2023,
  rep_meth: 1,
  new_sp_coh: 1000,
  new_sp_cur: 980,
  new_sp_cmplt: 950,
  new_sp_died: 30,
  new_sp_fail: 10,
  new_sp_def: 10,
  c_new_sp_tsr: 95,
  new_snep_coh: 800,
  new_snep_cmplt: 760,
  new_snep_died: 20,
  new_snep_fail: 10,
  new_snep_def: 10,
  c_new_snep_tsr: 95,
  ret_coh: 900,
  ret_cur: 870,
  ret_cmplt: 10,
  ret_died: 10,
  ret_fail: 10,
  ret_def: 950,
  hiv_new_sp_coh: 940,
  hiv_new_sp_cur: 920,
  hiv_new_sp_cmplt: 10,
  hiv_new_sp_died: 5,
  hiv_new_sp_fail: 5,
  hiv_new_snep_coh: 800,
  hiv_new_snep_cmplt: 780,
  hiv_new_snep_died: 10,
  hiv_new_snep_fail: 5,
  hiv_new_snep_def: 5,
  hiv_ret_coh: 700,
  hiv_ret_cur: 680,
  hiv_ret_cmplt: 10,
  hiv_ret_died: 5,
  hiv_ret_fail: 5,
  hiv_ret_def: 1,
  rel_with_new_flg: 500,
  newrel_coh: 450,
  newrel_succ: 20,
  newrel_fail: 10,
  newrel_died: 20,
  newrel_lost: 90,
  c_new_tsr: 450,
  ret_nrel_coh: 420,
  ret_nrel_succ: 10,
  ret_nrel_fail: 10,
  ret_nrel_died: 10,
  ret_nrel_lost: 90,
  c_ret_tsr: 400,
  tbhiv_coh: 370,
  tbhiv_succ: 10,
  tbhiv_fail: 10,
  tbhiv_died: 10,
  tbhiv_lost: 85,
  c_tbhiv_tsr: 300,
  mdr_coh: 270,
  mdr_succ: 10,
  mdr_fail: 10,
  mdr_died: 10,
  mdr_lost: 5,
  xdr_coh: 0,
  xdr_succ: 0,
  xdr_fail: 0,
  xdr_died: 0,
  xdr_lost: 0,
  "Unnamed: 72": 0
};

const App = () => {
  const [formData, setFormData] = useState(initialSampleData);
  const [prediction, setPrediction] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [csvResult, setCsvResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://tbpredictionmodel-production.up.railway.app/predict", formData);
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCSVUpload = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      complete: async (results) => {
        try {
          const res = await axios.post("https://tbpredictionmodel-production.up.railway.app/batch_predict", results.data);
          setCsvResult(res.data);
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const exportCSV = () => {
    const blob = new Blob([Papa.unparse(csvResult)], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'tb_predictions.csv');
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">TB Prediction Interface</h1>
        <button onClick={toggleDarkMode} className="px-3 py-1 bg-indigo-500 text-white rounded">Toggle Dark Mode</button>
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setFormData(initialSampleData)} className="px-4 py-2 bg-green-500 text-white rounded">Auto-fill Sample</button>
        <input type="file" accept=".csv" onChange={handleCSVUpload} className="border p-2" />
        {csvResult && <button onClick={exportCSV} className="px-4 py-2 bg-blue-500 text-white rounded">Download Predictions</button>}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(initialSampleData).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1" title={key}>{key}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm"
            />
          </div>
        ))}
        <button type="submit" className="col-span-full px-4 py-2 bg-purple-600 text-white rounded">Predict</button>
      </form>

      {prediction && (
        <div className="mt-6 p-4 border rounded bg-green-100 text-green-900">
          <h2 className="text-lg font-semibold">Prediction:</h2>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
