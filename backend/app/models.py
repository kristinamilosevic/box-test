from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Box(Base):
    __tablename__ = "Box"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    length = Column(Float, nullable=False)
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
