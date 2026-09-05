"""
conversation_service.py
CRUD helpers for Conversation and Message models.
"""
from sqlalchemy.orm import Session

from models.conversation import Conversation, Message


# ── Conversation ──────────────────────────────────────────────────────────────

def create_conversation(db: Session, user_id: int, title: str | None = None) -> Conversation:
    """Create and persist a new conversation for the given user."""
    convo = Conversation(user_id=user_id, title=title)
    db.add(convo)
    db.commit()
    db.refresh(convo)
    return convo


def get_conversation(db: Session, conversation_id: int, user_id: int) -> Conversation | None:
    """Return a conversation only if it belongs to the given user."""
    return (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
        .first()
    )


def list_conversations(db: Session, user_id: int) -> list[Conversation]:
    """Return all conversations for the given user, newest first."""
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.created_at.desc())
        .all()
    )


def update_conversation_title(
    db: Session, conversation_id: int, user_id: int, title: str
) -> Conversation | None:
    """Rename a conversation title. Returns None if not found / not owned."""
    convo = get_conversation(db, conversation_id, user_id)
    if convo is None:
        return None
    convo.title = title
    db.commit()
    db.refresh(convo)
    return convo


def delete_conversation(db: Session, conversation_id: int, user_id: int) -> bool:
    """Delete a conversation. Returns True if deleted, False if not found."""
    convo = get_conversation(db, conversation_id, user_id)
    if convo is None:
        return False
    db.delete(convo)
    db.commit()
    return True


# ── Messages ──────────────────────────────────────────────────────────────────

def add_message(
    db: Session,
    conversation_id: int,
    role: str,
    content: str,
) -> Message:
    """Append a message to a conversation and return it."""
    msg = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def get_messages(db: Session, conversation_id: int) -> list[Message]:
    """Return all messages for a conversation, ordered oldest-first."""
    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )
