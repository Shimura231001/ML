from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torchvision import models, transforms
from PIL import Image
import scipy.io
import io
import os

app = Flask(__name__)
CORS(app)

# モデルとラベル読み込み
meta = scipy.io.loadmat('./model/cars_meta.mat')
class_names = [c[0] for c in meta['class_names'][0]]

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = models.efficientnet_b2(weights=None)
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, 196)
model.load_state_dict(torch.load('./model/efficientnetb2_car_model.pth', map_location=device))
model = model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file found'}), 400

    image = Image.open(request.files['file'].stream).convert('RGB')
    input_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_tensor)
        pred_id = torch.argmax(output, dim=1).item()
        pred_class = class_names[pred_id]

    return jsonify({'class_id': pred_id, 'class_name': pred_class})

@app.route('/')
def home():
    return 'Flask API is running.'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)