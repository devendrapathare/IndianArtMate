import nltk
from nltk.tokenize import word_tokenize
import nltk.data
print(nltk.data.find('tokenizers/punkt'))
nltk.download('punkt_tab')

nltk.data.path.append(r"C:/Users/91702/AppData/Roaming/nltk_data/tokenizers/punkt") 
# nltk.data.path.append(r"C:/Users/91702/AppData/Roaming/nltk_data") 

print(word_tokenize("This is a test sentence."))
