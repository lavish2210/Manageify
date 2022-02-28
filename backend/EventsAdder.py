import requests
import os
import time
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs
from calendarAPI import *
import sys

# ------------- BASIC SETUP --------------
load_dotenv()
USERNAME = os.getenv('USER_NAME')
PASSWORD = os.getenv('PASSWORD')
CALENDAR_PORT = int(os.getenv('CALENDAR_PORT'))
payload = {
    "username": f"{USERNAME}",
    "password": f"{PASSWORD}"
}
session_requests = requests.session()
calendar = accessCalendar(CALENDAR_PORT)

# https://students.iitmandi.ac.in/moodle/calendar/view.php?view=month&course=1&time=1643653800
calendar_prefix = "https://students.iitmandi.ac.in/moodle/calendar/view.php?view=month&course=1&time="
thirty_days = 2592000
current_month = time.time()
next_month = current_month+thirty_days
login_url = "https://students.iitmandi.ac.in/moodle/login/index.php"
# -----------------------------------------


# ------------- LOGIN LOGIC ---------------
result = session_requests.post(
    login_url,
    data=payload,
    headers=dict(referer=login_url)
)
# dashboard_url = 'https://students.iitmandi.ac.in/moodle/my/'
# result = session_requests.get(
# 	dashboard_url,
# 	headers = dict(referer = dashboard_url)
# )
# ----------------------------------------


# --------- CALENDAR DATA FETCH LOGIC --------
def get_month_events(url):
    try:
        raw_data = session_requests.get(url)
        soup = BeautifulSoup(raw_data.content, 'html5lib')
        calendar = soup.find("div", {"class": "maincalendar"})
        table = calendar.find_all("td", {"class": 'day'})

        events = {}
        for td in table:
            events_new = td.find("ul", {"class": 'events-new'})
            if events_new:
                day_tag = td.find("div", {"class": 'day'}).find('a')
                try:
                    day = [day_tag.string, day_tag['href']]
                except:
                    print("ERROR ON DATE")

                try:
                    tmp = []
                    if events_new:
                        for li in events_new:
                            a = {}
                            a['href'] = li.find('a')['href']
                            a['time'] = parse_qs(urlparse(a['href']).query)[
                                'time'][0]
                            a['text'] = li.find('a').string
                            tmp.append(a)

                    events[day[0]] = [day_tag['href'], tmp]
                except:
                    print("ERROR ON LINK FETCHING")
        return events
    except:
        print("HIT YOUR HEAD TO WALL")

# getUpcomingEvents(calendar, 10)

def addData(calendar, url):
    print("Adding All Events for url =", url)
    data = get_month_events(url)
    for date in data:
        addAllEvents(calendar, data[date])

if len(sys.argv) == 4:
    description = sys.argv[1]
    startTime = sys.argv[2]
    endTime = sys.argv[3]
    startTime = startTime+":00+05:30"
    endTime = endTime+":00+05:30"
    addEvent(calendar, description, startTime, endTime)
elif len(sys.argv) == 1:
    # july_calendar_url = calendar_prefix + "1625077800"
    # addData(calendar, july_calendar_url)

    current_month_calendar_url = calendar_prefix+ str(current_month)
    addData(calendar, current_month_calendar_url)

    next_month_calendar_url = calendar_prefix+ str(next_month)
    addData(calendar, next_month_calendar_url)
os.remove('token.json')
# ---------------------------------------------
