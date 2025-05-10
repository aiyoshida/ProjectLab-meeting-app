from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    gmail = Column(String, nullable=False)
    timezone = Column(String, nullable=False)


class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    gmail = Column(String, nullable=False)
    timezone = Column(String, nullable=False)


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)  # 主キー（自動で増えるID）
    title = Column(String, nullable=False)  # タイトル（必須）
    created_at = Column(
        DateTime, default=datetime.utcnow
    )  # 作成日時（デフォルトで今の時刻）
    creator_user_id = Column(
        Integer, ForeignKey("users.id")
    )  # 作成者のUser ID（外部キー）
    finalized = Column(Boolean, default=False)  # 日程が確定済みか（初期値False）
    all_voted = Column(Boolean, default=False)  # 全員投票済みか（初期値False）
    url = Column(String, nullable=True)
    creator = relationship("User", backref="meetings")


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)  # 主キー
    meeting_id = Column(Integer, ForeignKey("meetings.id"))  # Meeting との外部キー
    contact_id = Column(Integer, ForeignKey("contacts.id"))  # Contact との外部キー
    voted = Column(Boolean, default=False)  # 投票済みか（初期値 False）
    meeting = relationship("Meeting", backref="participants")
    contact = relationship("Contact", backref="participations")


class VotedDate(Base):
    __tablename__ = "voted_dates"

    id = Column(Integer, primary_key=True, index=True)  # 主キー（自動で連番）
    meeting_id = Column(Integer, ForeignKey("meetings.id"))  # 外部キー：どの会議か
    starting_time = Column(DateTime, nullable=False)  # 開始時刻
    ending_time = Column(DateTime, nullable=False)  # 終了時刻

    # Optional：Meetingオブジェクトにアクセスする場合
    meeting = relationship("Meeting", backref="voted_dates")
