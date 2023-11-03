import requests
from time import sleep

def make_request():
	try:
		url='https://google.com'
		headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'
        }
		response = requests.get(url, headers=headers, verify=False, timeout=30)
		parsed = response.json()
		print(parsed)
	except Exception as e:
		print(e)

make_request()
