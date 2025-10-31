from ics import Calendar, Event


# reference: https://icspy.readthedocs.io/en/stable/
# TODO: implement Google invitation
def ics_creator(title: str, starting_time: str, ending_time: str):
    c = Calendar()
    c.method = "REQUEST"
    
    e = Event()
    e.name = title
    e.begin = starting_time
    e.end = ending_time
    # e.organizer = f"mailto:{organizer_email}"
    # e.attendees = [f"mailto:{email}" for email in attendees_emails]
    # add event
    c.events.add(e)
    c.events
    # Get iCalendar format text
    ics = c.serialize()

    return ics
