from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    username = Column(String, nullable=False)
    gmail = Column(String, nullable=False)
    timezone = Column(String, nullable=False)
    picture = Column(String, nullable=True)


class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    friend_of_this_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    actual_user = relationship(
        "User", foreign_keys=[user_id], backref="contact_profiles"
    )
    owner_user = relationship(
        "User", foreign_keys=[friend_of_this_user_id], backref="my_contacts"
    )


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    timezone = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    creator_user_id = Column(Integer, ForeignKey("users.id"))
    finalized = Column(Boolean, default=False)
    all_voted = Column(Boolean, default=False)
    url = Column(String, nullable=True)
    creator = relationship("User", backref="meetings")


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    voted = Column(Boolean, default=False)
    meeting = relationship("Meeting", backref="participants")
    user = relationship("User", backref="participations")


class VotedDate(Base):
    __tablename__ = "voted_dates"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    starting_time = Column(DateTime, nullable=False)
    ending_time = Column(DateTime, nullable=False)

    meeting = relationship("Meeting", backref="voted_dates")


class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    voted_date_id = Column(Integer, ForeignKey("voted_dates.id"))
    meeting_id = Column(Integer, ForeignKey("meetings.id"))

    user = relationship("User", backref="votes")
    voted_date = relationship("VotedDate", backref="votes")
    meeting = relationship("Meeting", backref="votes")
