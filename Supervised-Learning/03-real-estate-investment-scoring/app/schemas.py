from pydantic import BaseModel, Field
from enum import Enum

# ---- Categorical Fields Ke Liye Fixed Options (Enums) ----

class KitchenQualEnum(str, Enum):
    Ex = "Ex"
    Gd = "Gd"
    TA = "TA"
    Fa = "Fa"
    Po = "Po"

class BsmtQualEnum(str, Enum):
    Ex = "Ex"
    Gd = "Gd"
    TA = "TA"
    Fa = "Fa"
    Po = "Po"
    NoBasement = "None"

class GarageTypeEnum(str, Enum):
    Attchd = "Attchd"
    Detchd = "Detchd"
    BuiltIn = "BuiltIn"
    Basment = "Basment"
    CarPort = "CarPort"
    TwoTypes = "2Types"
    NoGarage = "None"

class NeighborhoodEnum(str, Enum):
    NAmes = "NAmes"
    CollgCr = "CollgCr"
    OldTown = "OldTown"
    Edwards = "Edwards"
    Somerst = "Somerst"
    Gilbert = "Gilbert"
    NridgHt = "NridgHt"
    Sawyer = "Sawyer"
    NWAmes = "NWAmes"
    SawyerW = "SawyerW"
    BrkSide = "BrkSide"
    Crawfor = "Crawfor"
    Mitchel = "Mitchel"
    NoRidge = "NoRidge"
    Timber = "Timber"
    IDOTRR = "IDOTRR"
    ClearCr = "ClearCr"
    StoneBr = "StoneBr"
    SWISU = "SWISU"
    MeadowV = "MeadowV"
    Blmngtn = "Blmngtn"
    BrDale = "BrDale"
    Veenker = "Veenker"
    NPkVill = "NPkVill"
    Blueste = "Blueste"


# ---- Main Request Schema (User Kya Bhejega) ----

class PropertyInput(BaseModel):
    overall_qual: int = Field(..., ge=1, le=10, description="Overall material and finish quality (1-10)")
    gr_liv_area: float = Field(..., gt=0, description="Above ground living area (sq ft)")
    overall_cond: int = Field(..., ge=1, le=10, description="Overall condition rating (1-10)")
    garage_cars: int = Field(..., ge=0, le=4, description="Garage capacity (number of cars)")
    year_built: int = Field(..., ge=1870, le=2025, description="Year the house was built")
    year_remod_add: int = Field(..., ge=1870, le=2025, description="Year of last remodel")
    tot_rms_abv_grd: int = Field(..., ge=2, le=14, description="Total rooms above grade")
    full_bath: int = Field(..., ge=0, le=4, description="Number of full bathrooms")
    fireplaces: int = Field(..., ge=0, le=3, description="Number of fireplaces")
    kitchen_qual: KitchenQualEnum
    bsmt_qual: BsmtQualEnum
    neighborhood: NeighborhoodEnum
    garage_type: GarageTypeEnum
    lot_area: float = Field(..., gt=0, description="Lot size (sq ft)")
    listed_price: float = Field(..., gt=0, description="Current listed/asking price of the property")


# ---- Response Schema (API Kya Wapas Karegi) ----

class PredictionResponse(BaseModel):
    predicted_price: float
    listed_price: float
    investment_score: float
    verdict: str