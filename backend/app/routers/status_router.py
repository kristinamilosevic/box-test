from fastapi import APIRouter
from fastapi.responses import JSONResponse


router = APIRouter(
    prefix="/status",
    tags=["status"]
)


@router.get(
    "",
    description="Check if server is running",
    summary="Server status"
)
async def server_status():
    return JSONResponse(
        content={ "status": "ok" },
        status_code=200
    )