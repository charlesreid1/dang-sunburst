import csv
import json

"""
n-gram data from here: http://norvig.com/mayzner.html
"""

ds = []

############################
# read file

# do this once and only once.
# get it out of the way.
with open('ngrams2.csv','r') as f:

    reader = csv.reader(f)

    for i,row in enumerate(reader):

        if i==0:
            continue

        d = {}
        
        c1 = row[0][0]
        c2 = row[0][1]

        d['bigram'] = row[0]
        d['letter1'] = c1
        d['letter2'] = c2
        d['total'] = row[1]
        
        ds.append(d)


#################################
# construct root node of sunburst hierarchy
root = {}
root['letter'] = 'root'
root['level'] = 0


#################################
# construct level 1 of sunburst hierarchy

# get unique letters for level 1
letter1list = []
for d in ds:
    c1 = d['letter1']
    if c1 not in letter1list:
        letter1list.append(c1)

root_children = []
# construct level 1 dicts
for letter in letter1list:
    d1 = {}
    d1['letter'] = letter
    d1['letter1'] = letter
    d1['level'] = 1
    root_children.append(d1)

root['children'] = root_children


#################################
# construct level 2 of sunburst hierarchy

for child in root['children']:
    letter = child['letter']
    
    grandchildren = []
    for d in ds:
        if(d['letter1']==letter):
            grandchild = {}
            grandchild['letter1'] = d['letter1']
            grandchild['letter'] = d['bigram']
            grandchild['level'] = 2
            grandchild['total'] = d['total']
            grandchildren.append(grandchild)

    child['children'] = grandchildren



with open('bigrams.json','w') as f:
    json.dump(root,f,sort_keys=True, indent=4, separators=(',', ': '))



