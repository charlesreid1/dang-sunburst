This is a donut chart with buttons enabling you to pick different
categories of data. This chart is intended to demonstrate how to fold up 
high dimensional data into a JSON container that ca be served up and 
easily filtered with D3.

<br />
<br />

This data shows statistics about death records from the United States in 
2014, in particular the ratio of males to females whose death records 
were tagged with these particular ICD 10 codes. The ICD 10 codes indicate
circumstances present at time of death, though not necessarily 
the cause of death. 

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

