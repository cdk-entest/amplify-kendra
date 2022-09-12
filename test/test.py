import requests
import json

url = "https://a3qc77koo0.execute-api.us-east-1.amazonaws.com/dev/items"
query = "Amplify Hosting?"

resp = requests.get(
    url=f"{url}/query?query={query}"
)

items = resp.json()['ResultItems']

for item in items:
    print(item["DocumentId"])

for item in items:
    print(item["DocumentTitle"])