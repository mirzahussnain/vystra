from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database.config import get_db
from ..database.models import User
from ..dependencies import require_ai_quota
from ..services.semantic_search import search_transcript

router = APIRouter()


@router.get("/search")
def search_videos(
    q: str = Query(..., min_length=3),  # User's search text
    video_id: str = None,
    user: User = Depends(require_ai_quota),  # Optional: Filter by specific video
    db: Session = Depends(get_db),
):
    """
    Semantic Search: Finds video segments matching the meaning of the query.
    Cost: 1 AI Credit.
    """
    if len(q.strip()) < 3:
        raise HTTPException(400, "Query too short")

    results = search_transcript(db, q, user,video_id)
    return results
