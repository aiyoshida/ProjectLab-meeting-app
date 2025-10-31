from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    sub = Column(String, primary_key=True, index=True)
    username = Column(String, nullable=False)
    gmail = Column(String, nullable=False)
    timezone = Column(String, nullable=False)
    picture = Column(String, nullable=True)


class Contact(Base):
    __tablename__ = "contacts"
    # id of the contact itself. just for index.
    id = Column(Integer, primary_key=True, index=True)
    # this user's sub FK from user
    user_sub = Column(String, ForeignKey("users.sub"), nullable=False)
    # user_sub's friend's sub
    friend_of_this_user_sub = Column(String, ForeignKey("users.sub"), nullable=False)
    # Connects contact and user tables.
    actual_user = relationship(
        # Connect to User table
        "User",
        # show which FK to connect inside contact table.
        foreign_keys=[user_sub],
        # from User.contact_profiles, can access to
        backref="contact_profiles",
    )
    owner_user = relationship(
        "User", foreign_keys=[friend_of_this_user_sub], backref="my_contacts"
    )


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    timezone = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    creator_user_sub = Column(String, ForeignKey("users.sub"))
    slot_duration = Column(String, nullable=False)
    finalized = Column(Boolean, default=False)
    all_voted = Column(Boolean, default=False)
    url = Column(String, nullable=True)
    creator = relationship("User", backref="meetings")
    finalized_voted_date_id = Column(Integer, ForeignKey("voted_dates.id"), nullable=True)
    

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    user_id = Column(String, ForeignKey("users.sub"))
    voted = Column(Boolean, default=False)
    creator = Column(Boolean, default=False)
    meeting = relationship("Meeting", backref="participants")
    user = relationship("User", backref="participations")


class VotedDate(Base):
    __tablename__ = "voted_dates"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    starting_time = Column(DateTime, nullable=False)
    ending_time = Column(DateTime, nullable=False)

    meeting = relationship("Meeting", foreign_keys=[meeting_id], backref="voted_dates")


class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.sub"))
    voted_date_id = Column(Integer, ForeignKey("voted_dates.id"))
    meeting_id = Column(Integer, ForeignKey("meetings.id"))

    user = relationship("User", backref="votes")
    voted_date = relationship("VotedDate", backref="votes")
    meeting = relationship("Meeting", backref="votes")
