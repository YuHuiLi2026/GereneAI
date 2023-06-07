from genreAI import genreAI
from flask import Flask, request
from flask_cors import CORS
import json
from web_scraper import getArticleText

app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def homepage():
  return "This is the homepage"

@app.route('/resource')
def resource():
  return "This is the resource page"

text = "NASA discovers new planet with water"
# @app.route('/recommend')

@app.route('/predict/<predict>')
def predict(predict):
  print("This is from the console/server:", predict)
  result = model.recommend(predict)
  print(result)
  return json.dumps(result)

@app.route('/recommend', methods =['POST'])
def recommend():
  text = request.get_json()
  
  page_content = getArticleText(text)

  print("This is from the console/server:", text)
  result = model.recommend(page_content)
  print(result)
  return json.dumps(result)

@app.route('/name/<myName>')
def greetName(myName):
  return "Hello " + myName

# # Python using the AI
categories = ['alt.atheism', 'soc.religion.christian', 'comp.graphics', 'sci.med','sci.space']
model = genreAI(categories)

app.run(host='0.0.0.0')
