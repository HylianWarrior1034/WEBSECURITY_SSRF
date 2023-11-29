from random import randint
import json
fileList = open("websites.txt")
lines = fileList.readlines()
fileData = []
for line in lines:
    data = {}
    data["numberOfRequests"] = randint(1, 10000)
    data["url"] = line
    data["requestBody"] = {}
    fileData.append(data)
json_file = json.dumps(fileData)
print(json_file)