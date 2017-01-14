Use the controls on this sunburst chart to dynamically 
push and pop new sections on the sunburst chart.

<br/>
<br/>

Click push/pop to add/remove categories to the sunburst chart.
Click on any of the outer slices of the charts to bring up an interactive
slider control for the size of the slice.

<br/>
<br/>

The D3 sunburst chart is bound to underlying JSON data, which has the following format:

<pre style="font-size: 8px;">
{
    "name": "root",
    "children": [
        {
            "name": "A",
            "children": [
                {
                    "magnitude": 20,
                    "name": "AW"
                },
                {
                    "magnitude": 5,
                    "name": "AX"
                },
                {
                    "magnitude": 10,
                    "name": "AY"
                },
                {
                    "magnitude": 50,
                    "name": "AZ"
                }
            ]
        },
        [...]
</pre>

This tree structure is rendered into the sunchart shown on the left 
by D3. Clicking push adds a new node to "root".

