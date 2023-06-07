import requests
from bs4 import BeautifulSoup

def getArticleText(link):
    request = requests.get("https://www.news-medical.net/news/20230505/HIPEC-A-promising-treatment-for-certain-patients-with-Stage-IV-abdominal-cancer.aspx")
    page_content = request.content
#print(page_content)
    soup = BeautifulSoup(page_content, "html5lib")
    all_paragraphs = soup.find_all('p')
    
    total_text = ""
    for paragraph in all_paragraphs:
        text = paragraph.get_text().strip()
        total_text += text + " "
    
    print(total_text)
    return total_text

getArticleText("https://www.news-medical.net/news/20230505/HIPEC-A-promising-treatment-for-certain-patients-with-Stage-IV-abdominal-cancer.aspx")
