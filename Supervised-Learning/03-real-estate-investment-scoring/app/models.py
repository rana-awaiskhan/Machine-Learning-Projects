from sqlalchemy import Column , Integer , Float , DateTime , String
from datetime import datetime
from app.database import Base

class PredictionHistory(Base):
    __tablename__ = "Prediction History"

    id = Column(Integer , primary_key= True , index= True)
    timestamp = Column(DateTime , default= datetime.utcnow)

    # User Input Features (14 features jo form se aayenge)
    overall_qual = Column(Integer)
    gr_liv_area = Column(Float)
    overall_cond = Column(Integer)
    garage_cars = Column(Integer)
    year_built = Column(Integer)
    year_remod_add = Column(Integer)
    tot_rms_abv_grd = Column(Integer)
    full_bath = Column(Integer)
    fireplaces = Column(Integer)
    kitchen_qual = Column(String(10))
    bsmt_qual = Column(String(10))
    neighborhood = Column(String(20))
    garage_type = Column(String(20))
    lot_area = Column(Float)
    listed_price = Column(Float)


    # Output
    predicted_price = Column(Float)
    investment_score = Column("Investment_score", Float)
    verdict = Column(String(50))

    