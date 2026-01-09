from pydantic import BaseModel, Field
from enum import StrEnum


class BoxLabel(StrEnum):
    NO = "No"
    UP = "Up"
    DOWN = "Down"


class CreateBoxRequest(BaseModel):
    name: str | None = Field(
        default="New Box",  # TODO: add number, e.g. New Box 1, New Box 2, etc.
        description="Name for the box",
        examples=["Big box"]
    )
    length: int = Field(
        description="Length of the box",
        ge=0,
        examples=[200]
    )
    width: int = Field(
        description="Width of the box",
        ge=0,
        examples=[300]
    )
    height: int = Field(
        description="Height of the box",
        ge=0,
        examples=[100]
    )
    label: BoxLabel | None = Field(
        default="No",
        description="Label for the box",
        examples=["Up"]
    )
    weight: float = Field(
        description="Weight of the box",
        ge=0,
        examples=[2.4]
    )


class BoxResponse(BaseModel):
    id: int
    name: str
    length: int
    width: int
    height: int
    label: str
    weight: float

    model_config = { "from_attributes": True }