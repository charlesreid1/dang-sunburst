This button-picking donut chart shows how to fold up donut data
that is high-dimensional into a JSON container that can be served up.

<br/>
<br/>

The key is to add one additional layer of hierarchy to the dictionary containing the data:
data for any pie chart consists of a list of dictionaries, as with the static pie chart,
but this time we add one additional layer to the JSON, which is the code.

The user is then able to select different codes using buttons. Clicking those buttons
sets the filter criteria in the visualization controller, and that change is detected
and propagated, so that the pie chart data is updated and the pie chart re-drawn. 

<pre style="font-size: 8px;">
[
    {
        "code": "T510"},
        "donut": 
            [
                {"value": 17, "label": "M"}, 
                {"value": 4, "label": "F"}
            ]
    },
    {
        "code": "Y14"},
        "donut": 
            [
                {"value": 1, "label": "M"}, 
                {"value": 3, "label": "F"}
            ]
    },
    {
        "code": "S328"},
        "donut": 
            [
                {"value": 2, "label": "M"}, 
                {"value": 3, "label": "F"}
            ]
    },
    
    ...
]
</pre>

Once we filter on "code", we get the "donut" array, and pass it to the D3 pie chart object,
which renders the d ata structure into the donut chart on the left.  
