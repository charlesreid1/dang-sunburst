The sunburst chart on this page displays a distribution of data along two 
independent dimensions, X and Y.

<br />
<br />

To generate this data, random samples were drawn from a joint PDF of two 
random variables, one normally distributed, and one distributed according
to a gamma distribution.

<br />
<br />

I used Python to do this:

<pre>
import numpy as np
from numpy.random import randn
import pandas as pd
from scipy import stats
import matplotlib as mpl
import matplotlib.pyplot as plt
import seaborn as sns

# Generate discrete joint distribution

fig = plt.figure()
ax = fig.add_subplot(111)

x = np.random.normal(3,1,1500)
y = stats.gamma(3).rvs(1500)

H,xedges,yedges = np.histogram2d(y,x,[10,10])
X, Y = np.meshgrid(xedges,yedges)
ax.pcolormesh(X,Y,H)
ax.set_xlim(0.1,10)
ax.set_ylim(0,6)
ax.set_xlabel('X')
ax.set_ylabel('Y')
</pre>

which results in the joint distribution shown in the plot below:

<br />
<img src="{{ SITEURL }}/images/orthogonal_joint_distribution.png" />
<br />

Next, we map the bins of each dimension, X and Y, to a set of variables.
In this case, we generated 10 bins for X and 10 bins for Y.

<br />
<br />

But because the sunburst chart groups things categorically, we are converting
the quantitative X and Y scales to groups according to bins. We arbitrarily 
label the bins, but maintain their order (which is important).

<br />
<br />

The final data is an array that looks like this:

<pre>
{
    'x' : <x bin index>
    'y' : <y bin index>
    'value' : <number of observations in histogram>
}
</pre>

The value is provided by the matrix <code>H</code> of counts per bin, 
returned by <code>np.histogram2d</code>.













