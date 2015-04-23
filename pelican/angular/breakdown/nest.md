The sunburst chart on this page displays a breakdown of 
a single dimension at multiple levels.

<br />
<br />

A data set of random samples from a Weibull distribution was 
assembled. This single vector x was then binned into 
10 and 100 bins, respectively. The bins were nested,
and form the sunburst diagram to the left.

<br />
<br />

Each of the blue bars represents a partition in the inner radian, or ring,
while each of the green bars represents a partition in the outer radian, or ring.

<br />
<img src="{{ SITEURL }}/images/twohist.png" />
<br />

The Python code used to generate these samples is given below:

<pre>
import seaborn as sns
from numpy.random import weibull

Nsamples = 1e4

# generate a weibull distribution
k=2
x = weibull(k,(Nsamples,))

partition1, binlocs1, _ = hist(x,10);
partition2, binlocs2, _ = hist(x,100);
</pre>

These two bins still have to be turned into a nested JSON structure
to be displayed in a sunburst chart, however. Here is the code 
to parse the two vectors and construct the JSON structure:

<pre>
# Now dump this to a JSON file
import json

tree = {}
tree['name'] = 'root'
tree['freq'] = sum(partition1[:])/Nsamples

children = []
for c1 in range(len(partition1)):
    child = {}
    child['name'] = 'X%d'%(c1+1)
    child['freq'] = partition1[c1]/Nsamples

    grandchildren = []
    for c2 in range(len(partition2)):
        if c2<((c1+1)*10):
            grandchild = {}
            grandchild['name'] = 'X%d-%d'%(c1+1,c2+1)
            grandchild['freq'] = partition2[c2]/Nsamples
            grandchildren.append(grandchild)
    
    child['children'] = grandchildren
    children.append(child)

tree['children'] = children

with open('sunburst_nest_tree.json','w') as f:
    json.dump(tree,f,sort_keys=True,indent=4,separators=(',', ': '))

print "Done printing nested tree JSON to file."
</pre>


