from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..models.box_model import BoxModel
from ..schemas.box_schemas import CreateBoxRequest, BoxResponse


router = APIRouter(
    prefix="/boxes", 
    tags=["boxes"]
)


@router.get(
    "",
    summary="Get all boxes",
    response_model=list[BoxResponse]
)
async def get_all_boxes(db: Session = Depends(get_db)):
    boxes = db.query(BoxModel).all()
    return boxes


@router.get(
    "/{box_id}",
    summary="Get box",
    response_model=BoxResponse
)
async def get_box(box_id: int, db: Session = Depends(get_db)):
    box = db.query(BoxModel).filter(BoxModel.id == box_id).first()
    if box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    
    return box


@router.post(
    "",
    summary="Create box",
    response_model=BoxResponse,
    status_code=201
)
async def create_box(new_box: CreateBoxRequest, db: Session = Depends(get_db)):
    print(new_box)
    db_box = BoxModel(
        name=new_box.name,
        length=new_box.length,
        width=new_box.width,
        height=new_box.height,
        label=new_box.label,
        weight=new_box.weight
    )
    db.add(db_box)
    db.commit()
    db.refresh(db_box)

    return db_box


@router.put(
    "/{box_id}",
    summary="Update box",
    response_model=BoxResponse
)
async def update_box(
    box_id: int,
    updated_box: CreateBoxRequest,
    db: Session = Depends(get_db)
):
    box = db.query(BoxModel).filter(BoxModel.id == box_id).first()
    if box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    
    box.name = updated_box.name
    box.length = updated_box.length
    box.width = updated_box.width
    box.height = updated_box.height
    box.label = updated_box.label
    box.weight = updated_box.weight
    
    db.commit()
    db.refresh(box)
    return box


@router.delete(
    "/{box_id}",
    summary="Delete box",
    status_code=204
)
async def delete_box(box_id: int, db: Session = Depends(get_db)):
    box = db.query(BoxModel).filter(BoxModel.id == box_id).first()
    if box is None:
        raise HTTPException(status_code=404, detail="Box not found")
    
    db.delete(box)
    db.commit()
