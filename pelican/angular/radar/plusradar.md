This chart uses a radar chart that's defined as a single, standalone Javacsript object,
which expects data in a particular structure. Some settings cannot be changed and are implemented as is,
while other options can be configured using a dictionary. 

<br />
<br />

The radar chart is connected to data about the month of death, 
organized in a hierarchical way, similar to the organization for 
the bar and donut charts. The difference is that this time, 
the pre-defined RadarChart object was used, which expected 
particular data labels. 

<br/>
<br/>

Here is how the data looks for this example:

<pre style="font-size: 8px;">
[
    {   "className": "S324", 
        "axes": [
                    {"value": 1, "axis": "January"}, 
                    {"value": 0, "axis": "February"}, 

                    ...

                    {"value": 0, "axis": "December"}
                ]
    },
    {   "className": "S328", 
        "axes": [
                    {"value": 1, "axis": "January"}, 
                    {"value": 1, "axis": "February"}, 

                    ...

                    {"value": 2, "axis": "December"}
                ]
    },
    {   "className": "Y15", 
        "axes": [
                    {"value": 3, "axis": "January"}, 
                    {"value": 2, "axis": "February"}, 

                    ...

                    {"value": 1, "axis": "December"}
                ]
    }
]
</pre>


