f = open("influencer_out_withLocation.txt")

from pymongo import MongoClient
client = MongoClient("mongodb://potplus:ilovecs130@ds115360.mlab.com:15360/pawpawdb")
db = client.pawpawdb
collection = db.withLocation
collection.drop()

header = ["Username","Topic","FullName","Followers","Followees","Posts","Email","Phone","ExternalURL","Business","Business_category","Language","Profile_pic","Biography","Multiclass","Beauty","Cosmetic","Family","Fashion","Fitness","Food","Interior","Nail","Pet","Product","Selfie","Travel","Other","Unclassified","City", "State", "Country"]

for lines in f:
    lst = lines.rstrip().split("\t")
    row={}
    for i in range(len(lst)):
        row[header[i]] = lst[i]
    collection.insert(row)


f.close()