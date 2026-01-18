

from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session

from app.database.config import get_db
from app.services.semantic_search import search_transcript 

router = APIRouter()

@router.get("/search")
def search_videos(
    q: str = Query(..., min_length=2),   # User's search text
    video_id: str = None,                # Optional: Filter by specific video
    db: Session = Depends(get_db)
):
    """
    Semantic Search Endpoint.
    Returns segments that match the *meaning* of the query.
    """
    if not q:
        return []
        
    results = search_transcript(db, q, video_id)
    return results