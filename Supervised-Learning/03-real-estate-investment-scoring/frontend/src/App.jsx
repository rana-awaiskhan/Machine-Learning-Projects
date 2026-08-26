import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

const KITCHEN_QUAL_OPTIONS = ["Ex", "Gd", "TA", "Fa", "Po"];
const BSMT_QUAL_OPTIONS = ["Ex", "Gd", "TA", "Fa", "Po", "None"];
const GARAGE_TYPE_OPTIONS = ["Attchd", "Detchd", "BuiltIn", "Basment", "CarPort", "2Types", "None"];
const NEIGHBORHOOD_OPTIONS = [
  "NAmes", "CollgCr", "OldTown", "Edwards", "Somerst", "Gilbert", "NridgHt",
  "Sawyer", "NWAmes", "SawyerW", "BrkSide", "Crawfor", "Mitchel", "NoRidge",
  "Timber", "IDOTRR", "ClearCr", "StoneBr", "SWISU", "MeadowV", "Blmngtn",
  "BrDale", "Veenker", "NPkVill", "Blueste",
];

const initialFormState = {
  overall_qual: 7,
  gr_liv_area: 1800,
  overall_cond: 5,
  garage_cars: 2,
  year_built: 2005,
  year_remod_add: 2010,
  tot_rms_abv_grd: 7,
  full_bath: 2,
  fireplaces: 1,
  kitchen_qual: "Gd",
  bsmt_qual: "TA",
  neighborhood: "CollgCr",
  garage_type: "Attchd",
  lot_area: 8500,
  listed_price: 215000,
};

function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail ? JSON.stringify(errData.detail) : "Appraisal failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history`);
      const data = await response.json();
      setHistory(data);
      setShowHistory(true);
    } catch (err) {
      setError("Ledger load nahi ho payi");
    }
  };

  const verdictClass = (verdict) => {
    if (verdict?.includes("Undervalued")) return "stamp";
    if (verdict?.includes("Overpriced")) return "stamp bad";
    return "stamp fair";
  };

  const tagClass = (verdict) => {
    if (verdict?.includes("Undervalued")) return "tag good";
    if (verdict?.includes("Overpriced")) return "tag bad";
    return "tag fair";
  };

  return (
    <div className="ledger-body">
      <div className="wrap">
        <div className="top">
          <div>
            <div className="eyebrow">Property Investment Desk</div>
            <h1 className="title">The Appraisal Ledger</h1>
            <p className="subtitle">Enter the particulars below. Receive the appraiser's verdict on fair value.</p>
          </div>
          <div className="doc-no">EST. VALUATION MODEL<br />REAL-TIME APPRAISAL</div>
        </div>

        <div className="layout">
          {/* FORM */}
          <div>
            <div className="section-label">
              <span className="num">I.</span>
              <span className="txt">Particulars of the Property</span>
              <span className="line"></span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="group-eyebrow">Structure</div>
              <div className="field-grid">
                <Field label="Overall Quality (1-10)" name="overall_qual" type="number" value={formData.overall_qual} onChange={handleChange} min={1} max={10} />
                <Field label="Living Area (sq ft)" name="gr_liv_area" type="number" value={formData.gr_liv_area} onChange={handleChange} min={100} />
                <Field label="Total Rooms" name="tot_rms_abv_grd" type="number" value={formData.tot_rms_abv_grd} onChange={handleChange} min={2} max={14} />
                <Field label="Full Bathrooms" name="full_bath" type="number" value={formData.full_bath} onChange={handleChange} min={0} max={4} />
                <Field label="Fireplaces" name="fireplaces" type="number" value={formData.fireplaces} onChange={handleChange} min={0} max={3} />
                <Field label="Garage Cars" name="garage_cars" type="number" value={formData.garage_cars} onChange={handleChange} min={0} max={4} />
                <SelectField label="Garage Type" name="garage_type" value={formData.garage_type} onChange={handleChange} options={GARAGE_TYPE_OPTIONS} full />
              </div>

              <div className="group-eyebrow">Condition &amp; Vintage</div>
              <div className="field-grid">
                <Field label="Overall Condition (1-10)" name="overall_cond" type="number" value={formData.overall_cond} onChange={handleChange} min={1} max={10} />
                <Field label="Year Built" name="year_built" type="number" value={formData.year_built} onChange={handleChange} min={1870} max={2025} />
                <Field label="Year Remodeled" name="year_remod_add" type="number" value={formData.year_remod_add} onChange={handleChange} min={1870} max={2025} />
                <SelectField label="Kitchen Quality" name="kitchen_qual" value={formData.kitchen_qual} onChange={handleChange} options={KITCHEN_QUAL_OPTIONS} />
                <SelectField label="Basement Quality" name="bsmt_qual" value={formData.bsmt_qual} onChange={handleChange} options={BSMT_QUAL_OPTIONS} full />
              </div>

              <div className="group-eyebrow">Location &amp; Lot</div>
              <div className="field-grid">
                <SelectField label="Neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleChange} options={NEIGHBORHOOD_OPTIONS} />
                <Field label="Lot Area (sq ft)" name="lot_area" type="number" value={formData.lot_area} onChange={handleChange} min={100} />
              </div>

              <div className="group-eyebrow">Asking</div>
              <div className="field-grid">
                <Field label="Listed Price ($)" name="listed_price" type="number" value={formData.listed_price} onChange={handleChange} min={1000} full />
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Appraising..." : "Submit for Appraisal"}
              </button>
            </form>
          </div>

          {/* RESULT + HISTORY */}
          <div>
            <div className="section-label">
              <span className="num">II.</span>
              <span className="txt">The Verdict</span>
              <span className="line"></span>
            </div>

            <div className="card">
              {error && <div className="error-box">{error}</div>}

              {!result && !error && (
                <p className="placeholder-text">Fill the particulars and submit — the verdict will be stamped here.</p>
              )}

              {result && (
                <>
                  <div className="ledger-row">
                    <span className="lbl">Listed Price</span>
                    <span className="val">${result.listed_price.toLocaleString()}</span>
                  </div>
                  <div className="ledger-row">
                    <span className="lbl">Appraised Fair Value</span>
                    <span className="val">${result.predicted_price.toLocaleString()}</span>
                  </div>
                  <div className="ledger-row" style={{ borderBottom: "none" }}>
                    <span className="lbl">Variance</span>
                    <span className="val" style={{ color: result.investment_score >= 0 ? "var(--green)" : "var(--brick)" }}>
                      {result.investment_score > 0 ? "+" : ""}{result.investment_score}%
                    </span>
                  </div>
                  <div className="stamp-wrap">
                    <div key={JSON.stringify(result)} className={verdictClass(result.verdict)}>
                      {result.verdict.split(" - ")[0]}
                    </div>
                    <div className="stamp-sub">stamped on submission</div>
                  </div>
                </>
              )}
            </div>

            <div className="section-label" style={{ marginTop: "32px" }}>
              <span className="num">III.</span>
              <span className="txt">Ledger of Past Appraisals</span>
              <span className="line"></span>
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                <span className="refresh" onClick={fetchHistory}>Refresh Ledger</span>
              </div>

              {!showHistory && <p className="placeholder-text">Click "Refresh Ledger" to view past appraisals.</p>}
              {showHistory && history.length === 0 && <p className="placeholder-text">No appraisals recorded yet.</p>}

              {showHistory && history.map((item) => (
                <div className="hist-item" key={item.id}>
                  <div>
                    <div className="name">{item.neighborhood}</div>
                    <div className="price">${item.listed_price.toLocaleString()} listed</div>
                  </div>
                  <span className={tagClass(item.verdict)}>{item.verdict.split(" - ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type, value, onChange, min, max, full }) {
  return (
    <div className={`field ${full ? "full" : ""}`}>
      <label>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} min={min} max={max} required />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, full }) {
  return (
    <div className={`field ${full ? "full" : ""}`}>
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange}>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

export default App;