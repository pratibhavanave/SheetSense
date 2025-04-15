from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

UPLOAD_DIR = "server/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

last_uploaded_file = None  # We'll update this each time a file is uploaded

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    global last_uploaded_file
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())
    last_uploaded_file = file_location
    return {"message": "File uploaded successfully!"}


@app.get("/summary")
def get_summary():
    if not last_uploaded_file or not os.path.exists(last_uploaded_file):
        return {"error": "No uploaded file found."}

    df = pd.read_csv(last_uploaded_file)

    # Assuming CSV has these columns: OrderID, Revenue, Category
    total_orders = len(df)
    total_revenue = int(df["Revenue"].sum())

    category_counts = df["Category"].value_counts().to_dict()
    top_category = max(category_counts, key=category_counts.get)

    category_distribution = [
        {"name": name, "value": int(value)} for name, value in category_counts.items()
    ]

    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "top_category": top_category,
        "category_distribution": category_distribution,
    }
