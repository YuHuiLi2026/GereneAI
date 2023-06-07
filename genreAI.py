from sklearn.datasets import fetch_20newsgroups  # dataset
from sklearn.feature_extraction.text import CountVectorizer  # tool to count words in dataset
from sklearn.feature_extraction.text import TfidfTransformer  # tool to configure dataset for machine learning
from sklearn.pipeline import Pipeline
from sklearn.linear_model import SGDClassifier  # SVM Classifier

class genreAI:

  def __init__(self, types):
    self.dataset_train = fetch_20newsgroups(subset='train', categories=types, shuffle=True, random_state=42)
    self.pipeline = Pipeline([
                      ('vect', CountVectorizer()),  # Word Count
                      ('tfidf', TfidfTransformer()),  # Word Frequency
                      ('clf', 
                SGDClassifier(loss='hinge',penalty='l2',alpha=1e-3,random_state=42,max_iter=5,tol=None)),])
    self.train_model()
    
  def train_model(self):
    self.pipeline.fit(self.dataset_train.data, self.dataset_train.target)
    

  def recommend(self, input):
    sentence = [input]
    a = self.pipeline.predict(sentence)
    num = a[0]
    genre = self.dataset_train.target_names[num]
    return genre
