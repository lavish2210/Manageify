import requests
from dotenv import load_dotenv
import os

# ------------- BASIC SETUP --------------
load_dotenv()
USERNAME = os.getenv('USER_NAME')
PASSWORD = os.getenv('PASSWORD')
payload = {
    "username": f"{USERNAME}",
    "password": f"{PASSWORD}"
}
session_requests = requests.session()
# -----------------------------------------

# ------------- LOGIN LOGIC ---------------
login_url = "https://students.iitmandi.ac.in/moodle/login/index.php"
result = session_requests.post(
    login_url,
    data=payload,
    headers=dict(referer=login_url)
)
# ----------------------------------------


# --------- CALENDAR DATA FETCH LOGIC --------
# https://students.iitmandi.ac.in/moodle/calendar/view.php?view=month&course=1&time=1643653800
october_calendar_url = "https://students.iitmandi.ac.in/moodle/calendar/view.php?view=month&course=1&time=1633026600"
result = session_requests.get(october_calendar_url)

x = result.content
with open('result.txt', 'w') as file:
    file.write(str(x))
# ---------------------------------------------


# dashboard_url = 'https://students.iitmandi.ac.in/moodle/my/'
# result = session_requests.get(
# 	dashboard_url,
# 	headers = dict(referer = dashboard_url)
# )
