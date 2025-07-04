FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

# ポートの公開
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]

# コンテナ起動時にapp.pyを実行
CMD ["python", "app.py"]