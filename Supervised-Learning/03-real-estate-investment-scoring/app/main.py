import joblib
import numpy as np
import pandas as pd
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from app.database import engine, Base, SessionLocal
from app.models import PredictionHistory
from app.schemas import PropertyInput, PredictionResponse

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title= "Real Estate Investment Scoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models and defaults load once when the server starts.
model = joblib.load("model/best_pipeline.pkl")
defaults = joblib.load("model/feature_defaults.pkl")

# Create the table when the app starts if it does not exist.
Base.metadata.create_all(bind = engine)


# Database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Real Estate Investment Scoring API is running!"}

@app.post("/predict", response_model=PredictionResponse)
def predict_price(property_data: PropertyInput, db: Session = Depends(get_db)):

    input_dict = defaults.copy()

    input_dict["OverallQual"] = property_data.overall_qual
    input_dict["GrLivArea"] = property_data.gr_liv_area
    input_dict["OverallCond"] = property_data.overall_cond
    input_dict["GarageCars"] = property_data.garage_cars
    input_dict["YearBuilt"] = property_data.year_built
    input_dict["YearRemodAdd"] = property_data.year_remod_add
    input_dict["TotRmsAbvGrd"] = property_data.tot_rms_abv_grd
    input_dict["FullBath"] = property_data.full_bath
    input_dict["Fireplaces"] = property_data.fireplaces
    input_dict["KitchenQual"] = property_data.kitchen_qual.value
    input_dict["BsmtQual"] = property_data.bsmt_qual.value
    input_dict["Neighborhood"] = property_data.neighborhood.value
    input_dict["GarageType"] = property_data.garage_type.value
    input_dict["LotArea"] = property_data.lot_area

    # Step 2: Ek single-row DataFrame banao (Pipeline isi format mein input leta hai)
    input_df = pd.DataFrame([input_dict])

    # Step 3: Prediction karo (log scale mein aayegi)
    predicted_log_price = model.predict(input_df)[0]

    # Step 4: Wapas normal dollar price mein convert karo
    predicted_price = float(np.expm1(predicted_log_price))

    # Step 5: Investment Score calculate karo
    listed_price = property_data.listed_price
    investment_score = ((predicted_price - listed_price) / listed_price) * 100

    # Step 6: Verdict decide karo
    if investment_score > 5:
        verdict = "Undervalued - Good Deal"
    elif investment_score < -5:
        verdict = "Overpriced"
    else:
        verdict = "Fair Price"

    # Step 7: Database mein save karo
    record = PredictionHistory(
        overall_qual=property_data.overall_qual,
        gr_liv_area=property_data.gr_liv_area,
        overall_cond=property_data.overall_cond,
        garage_cars=property_data.garage_cars,
        year_built=property_data.year_built,
        year_remod_add=property_data.year_remod_add,
        tot_rms_abv_grd=property_data.tot_rms_abv_grd,
        full_bath=property_data.full_bath,
        fireplaces=property_data.fireplaces,
        kitchen_qual=property_data.kitchen_qual.value,
        bsmt_qual=property_data.bsmt_qual.value,
        neighborhood=property_data.neighborhood.value,
        garage_type=property_data.garage_type.value,
        lot_area=property_data.lot_area,
        listed_price=listed_price,
        predicted_price=predicted_price,
        investment_score=investment_score,
        verdict=verdict,
    )
    db.add(record)
    db.commit()

    # Step 8: Response wapas bhejo
    return PredictionResponse(
        predicted_price=round(predicted_price, 2),
        listed_price=listed_price,
        investment_score=round(investment_score, 2),
        verdict=verdict,
    )

from typing import List

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    records = db.query(PredictionHistory).order_by(PredictionHistory.id.desc()).limit(50).all()
    return records