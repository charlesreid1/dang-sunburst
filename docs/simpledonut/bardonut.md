This chart demonstrates linking a donut chart with a bar chart, 
so that a single controller filters data on both. 
It also effectively implements the "folding up" technique
demonstrated with the Donut Picker chart.

<br />
<br />

The data visualized are death records from the United States in 2014. 
Death records are anonymized and classified by many variables, 
including gender and manner of death, and released to the public.
Statistics about these variables are counted up for different ICD 10 codes,
which indicate various circumstances present at death, and visualized above.

<br/>
<br/>

Here, we bundle bar and donut plot data together by ICD 10 code.
When the user picks an ICD 10 code using buttons, we filter the data
plotted by the bar and donut plots.

<pre style="font-size: 8px;">
[
    {
        "code": "T510"},
        "donut": 
            [
                {"value": 17, "label": "M"}, 
                {"value": 4, "label": "F"}
            ],
        "bar": 
            [
                {"value": 10, "label": "Accident"}, 
                {"value": 0, "label": "Suicide"},
                {"value": 0, "label": "Homicide"},
                {"value": 3, "label": "Natural"}
            ]
    },
    {
        "code": "Y14"},
        "donut": 
            [
                {"value": 1, "label": "M"}, 
                {"value": 3, "label": "F"}
            ],
        "bar": 
            [
                {"value": 4, "label": "Accident"}, 
                {"value": 2, "label": "Suicide"},
                {"value": 0, "label": "Homicide"},
                {"value": 2, "label": "Natural"}
            ]
    },
    
    ...
]
</pre>

Once we filter on "code", we get the "donut" array, and pass it to the D3 pie chart object,
which renders the d ata structure into the donut chart on the left. Likewise, the "bar" array
is sent to the bar chart and visualized accordingly.
