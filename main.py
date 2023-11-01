from urllib.request import urlopen

def main():
    url = "http://olympus.realpython.org/profiles/aphrodite"
    page = urlopen(url, timeout=20)
    html_bytes = page.read()
    html = html_bytes.decode("utf-8")
    dispaly(html)
main()