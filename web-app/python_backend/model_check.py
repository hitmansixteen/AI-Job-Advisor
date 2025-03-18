import google.generativeai as genai

genai.configure(api_key="AIzaSyBa2Xy7rLUiDXTr1w6VuWhPMR-lYH6GYYI")

# List available models
for model in genai.list_models():
    print(model.name)