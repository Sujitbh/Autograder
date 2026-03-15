from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, desc, func
from typing import Annotated, List

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.course import Course
from app.models.message import Message
from app.models.enrollment import Enrollment
from app.schemas.message import MessageCreate, MessageOut, ConversationThreadOut

router = APIRouter(prefix="/messages", tags=["messages"])

DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]

@router.post("/send", response_model=MessageOut)
def send_message(payload: MessageCreate, db: DbSession, user: CurrentUser):
    # Verify receiver exists
    receiver = db.query(User).filter(User.id == payload.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
        
    # Verify course exists if provided
    if payload.course_id is not None:
        course = db.query(Course).filter(Course.id == payload.course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
    message = Message(
        sender_id=user.id,
        receiver_id=payload.receiver_id,
        course_id=payload.course_id,
        assignment_id=payload.assignment_id,
        content=payload.content,
        is_read=False
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    # Reload with relationships
    return db.query(Message).options(
        joinedload(Message.sender),
        joinedload(Message.receiver),
        joinedload(Message.course)
    ).filter(Message.id == message.id).first()

@router.get("/conversations", response_model=List[ConversationThreadOut])
def get_conversations(db: DbSession, user: CurrentUser):
    # Get all messages where user is sender or receiver
    messages = db.query(Message).options(
        joinedload(Message.sender),
        joinedload(Message.receiver),
        joinedload(Message.course)
    ).filter(
        or_(Message.sender_id == user.id, Message.receiver_id == user.id)
    ).order_by(desc(Message.created_at)).all()
    
    threads = {}
    for msg in messages:
        interlocutor_id = msg.receiver_id if msg.sender_id == user.id else msg.sender_id
        
        # Group by interlocutor only
        thread_key = str(interlocutor_id)
        
        if thread_key not in threads:
            threads[thread_key] = {
                "interlocutor": msg.receiver if msg.sender_id == user.id else msg.sender,
                "course": msg.course,
                "last_message": msg,
                "unread_count": 0
            }
            
        if msg.receiver_id == user.id and not msg.is_read:
            threads[thread_key]["unread_count"] += 1
            
    return list(threads.values())

@router.get("/thread/{other_user_id}", response_model=List[MessageOut])
def get_thread(other_user_id: int, db: DbSession, user: CurrentUser):
    messages = db.query(Message).options(
        joinedload(Message.sender),
        joinedload(Message.receiver)
    ).filter(
        or_(
            and_(Message.sender_id == user.id, Message.receiver_id == other_user_id),
            and_(Message.sender_id == other_user_id, Message.receiver_id == user.id)
        )
    ).order_by(Message.created_at).all()
    
    return messages

@router.post("/mark-read", response_model=dict)
def mark_thread_read(other_user_id: int, db: DbSession, user: CurrentUser):
    db.query(Message).filter(
        Message.receiver_id == user.id,
        Message.sender_id == other_user_id,
        Message.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    return {"status": "success"}

@router.get("/contacts", response_model=List[dict])
def get_contacts(db: DbSession, user: CurrentUser):
    # Get course IDs where the user is enrolled
    user_course_ids = db.query(Enrollment.course_id).filter(Enrollment.user_id == user.id).subquery()
    
    # Get all enrollments in those courses, excluding the user themselves
    contacts = db.query(
        User.id, 
        User.name, 
        User.email, 
        Enrollment.role
    ).join(Enrollment, User.id == Enrollment.user_id)\
     .filter(Enrollment.course_id.in_(user_course_ids))\
     .filter(User.id != user.id)\
     .all()
    
    # Deduplicate in Python (a user might be in multiple courses with different roles)
    # Give priority to 'instructor' > 'ta' > 'student'
    contact_dict = {}
    role_priority = {"instructor": 3, "ta": 2, "student": 1}
    
    for c_id, name, email, role in contacts:
        if c_id not in contact_dict or role_priority.get(role, 0) > role_priority.get(contact_dict[c_id]["role"], 0):
            contact_dict[c_id] = {
                "id": c_id,
                "name": name,
                "email": email,
                "role": role
            }
            
    # Sort alphabetically by name, strip role from response
    sorted_contacts = sorted(
        [{"id": v["id"], "name": v["name"], "email": v["email"]} for v in contact_dict.values()],
        key=lambda x: x["name"]
    )
    return sorted_contacts

@router.get("/unread-count", response_model=dict)
def get_unread_count(db: DbSession, user: CurrentUser):
    count = db.query(func.count(Message.id)).filter(
        Message.receiver_id == user.id,
        Message.is_read == False
    ).scalar()
    
    return {"count": count or 0}


@router.delete("/thread/{other_user_id}", response_model=dict)
def delete_thread(other_user_id: int, db: DbSession, user: CurrentUser):
    """Permanently delete all messages in a thread between the current user and another user."""
    db.query(Message).filter(
        or_(
            and_(Message.sender_id == user.id, Message.receiver_id == other_user_id),
            and_(Message.sender_id == other_user_id, Message.receiver_id == user.id)
        )
    ).delete(synchronize_session=False)
    db.commit()
    return {"ok": True}
