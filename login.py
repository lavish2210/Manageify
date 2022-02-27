import requests, os, time
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs

# ------------- BASIC SETUP --------------
load_dotenv()
USERNAME = os.getenv('USER_NAME')
PASSWORD = os.getenv('PASSWORD')
payload = {
    "username": f"{USERNAME}",
    "password": f"{PASSWORD}"
}
session_requests = requests.session()

# https://students.iitmandi.ac.in/moodle/calendar/view.php?view=month&course=1&time=1643653800
calendar_prefix = "https://students.iitmandi.ac.in/moodle/calendar/view.php?view=month&course=1&time="
thirty_days = 2592000
current_month = time.time()
next_month = current_month+thirty_days
# -----------------------------------------


# ------------- LOGIN LOGIC ---------------
login_url = "https://students.iitmandi.ac.in/moodle/login/index.php"
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
        table = calendar.find_all("td", {"class":'day'})

        events = {}
        for td in table:
            events_new = td.find("ul",{"class":'events-new'})
            if events_new:
                day_tag = td.find("div",{"class":'day'}).find('a')
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
                            a['time'] = parse_qs(urlparse(a['href']).query)['time'][0]
                            a['text'] = li.find('a').string
                            tmp.append(a)

                    events[day[0]] = [day_tag['href'],tmp]
                except:
                    print("ERROR ON LINK FETCHING")
        return events
    except:
        print("HIT YOUR HEAD TO WALL")


print("JULY EVENTS")
july_calendar_url = calendar_prefix + "1625077800"
events = get_month_events(july_calendar_url)
for event in events:
    print(event, end=' -> ')
    print(events[event])
    print()

# print("OCTOBER EVENTS")
# october_calendar_url = calendar_prefix + "1633026600"
# events = get_month_events(october_calendar_url)
# for event in events:
#     print(event, end=' -> ')
#     print(events[event])
#     print()

# print("CURRENT MONTH EVENTS")
# current_month_calendar_url = calendar_prefix+ str(current_month)
# events = get_month_events(current_month_calendar_url)
# for event in events:
#     print(event, end=' -> ')
#     print(events[event])
#     print()

# print("NEXT MONTH EVENTS")
# next_month_calendar_url = calendar_prefix+ str(next_month)
# events = get_month_events(next_month_calendar_url)
# for event in events:
#     print(event, end=' -> ')
#     print(events[event])
#     print()
# ---------------------------------------------
