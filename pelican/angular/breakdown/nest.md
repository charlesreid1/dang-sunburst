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

The Python code used to generate these samples is given below.

The first portion of the code creates two histograms with 10 and 100 
bins, respectively. Because the bin sizes are consistent, and sunburst charts
only visualize relative differences (due to the normalization of 360 degrees),
the bin locations do not matter so much as the counts in each bin.

These two bins still have to be turned into a nested JSON structure
to be displayed in a sunburst chart. The second portion of the code 
parses the two bin count vectors and constructs the JSON structure:

<br />
<script src="https://gist.github.com/charlesreid1/355041fcf72eb209d33e.js"></script>

This JSON data structure is assembled and exported by Python,
and is readable as a JavaScript Object (the JSO of JSON).
The structure of JSON data required to construct a sunburst 
is given below. The frequency key "freq" is used to 
determine the size of the arcs.

<pre style="font-size: 8px;">
{
    "name": "root"
    "freq": 1.0,
    "children": [
        {
            "name": "Blue Bin 1"
            "freq": 0.1012,
            "children": [
                {
                    "freq": 0.002,
                    "name": "Blue Bin 1, Green Bin 1"
                },
                {
                    "freq": 0.0037000000000000002,
                    "name": "Blue Bin 1, Green Bin 2"
                },
                {
                    "freq": 0.0068999999999999999,
                    "name": "Blue Bin 1, Green Bin 3"
                },
                {
                    "freq": 0.0082000000000000007,
                    "name": "Blue Bin 1, Green Bin 4"
                },
                {
                    "freq": 0.0085000000000000006,
                    "name": "Blue Bin 1, Green Bin 5"
                },
                {
                    "freq": 0.011599999999999999,
                    "name": "Blue Bin 1, Green Bin 6"
                },
                {
                    "freq": 0.0143,
                    "name": "Blue Bin 1, Green Bin 7"
                },
                {
                    "freq": 0.0129,
                    "name": "Blue Bin 1, Green Bin 8"
                },
                {
                    "freq": 0.015599999999999999,
                    "name": "Blue Bin 1, Green Bin 9"
                },
                {
                    "freq": 0.017500000000000002,
                    "name": "Blue Bin 1, Green Bin 10"
                }
        }, 
        {
            "name": "Blue Bin 2"
            "freq": 0.22839999999999999,
            "children": [
                {
                    "freq": 0.015299999999999999,
                    "name": "Blue Bin 2, Green Bin 11"
                },
                {
                    "freq": 0.019699999999999999,
                    "name": "Blue Bin 2, Green Bin 12"
                },

                

                [...]


            ]
        }
}
</pre>

