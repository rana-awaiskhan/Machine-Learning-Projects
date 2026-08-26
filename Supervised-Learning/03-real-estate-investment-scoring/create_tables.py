from app.database import engine, Base
from app.models import PredictionHistory

Base.metadata.create_all(bind=engine)

print("Table created successfully!")