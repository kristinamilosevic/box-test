from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

from .database import Base, engine, SessionLocal
from . import models, schemas

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/boxes", response_model=schemas.Box)
def create_box(box: schemas.BoxCreate, db: Session = Depends(get_db)):
    db_box = models.Box(**box.dict())
    db.add(db_box)
    db.commit()
    db.refresh(db_box)
    return db_box

@app.get("/boxes", response_model=list[schemas.Box])
def list_boxes(db: Session = Depends(get_db)):
    return db.query(models.Box).all()
