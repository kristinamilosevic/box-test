from sqlalchemy import Column, Integer, String, Float
from ..db.database import Base


class BoxModel(Base):
    __tablename__ = "boxes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    length = Column(Integer, nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    label = Column(String, default="No")
    weight = Column(Float, nullable=False)
