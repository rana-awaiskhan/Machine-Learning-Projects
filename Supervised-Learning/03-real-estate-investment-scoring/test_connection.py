from app.database import engine

try:
    connection = engine.connect()
    print("Connection Successful!")
    connection.close()
except Exception as e:
    print("Connection Failed!", e)
