from pydantic import BaseModel

class BoxBase(BaseModel):
    name: str
    length: float
    width: float
    height: float

class BoxCreate(BoxBase):
    pass

class Box(BoxBase):
    id: int

    class Config:
        from_attributes = True
