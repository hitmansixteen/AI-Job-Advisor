import google.generativeai as genai

genai.configure(api_key="AIzaSyBAi53P9imOY4P0BCGN4G6XczBKVrJcBp8")

# List available models
for model in genai.list_models():
    print(model.name)