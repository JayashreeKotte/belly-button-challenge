const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Create an init function
function init() {


    //Fetch the json object and console log it 
    d3.json(url).then(function (data) {
        console.log(data);

        //Initialize variable for names key in data
        let names = data.names;

        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");

        // Assign the value of the dropdown menu option to a variable
        // let dataset = dropdownMenu.property("value");

        for (i = 0; i < names.length; i++) {
            dropdownMenu
                .append('option')
                .text(names[i]) // user sees the text 
                .property('value', names[i]) //computer sees the text 

        }
        graphs(names[0]);
        demographic_info(names[0]);
    });

};

function demographic_info(patient_id) {

    // Fetch the json object and console log it
    d3.json(url).then(function (data) {

        let resultArray = data.metadata.filter(sampleObj => sampleObj.id == patient_id);

        // Initialize the metadata to be displayed to a variable 
        let info = resultArray[0];

        // Use D3 to select the div tag for sample metadata
        let sample = d3.select("#sample-metadata");
        sample.html("")
        // Append the first row of metadata as a sample demographic info 
        // sample.append(info);
        for (let i in info) {
            sample
                .append("table")
                .text(`${i}: ${info[i]}`)
                .property('value', i)

        }

    });
}

function graphs(patient_id) {

    // Fetch the json object and console log it
    d3.json(url).then(function (data) {
        console.log(data);

        let resultArray = data.samples.filter(sampleObj => sampleObj.id == patient_id);


        // Initialize the metadata to be displayed to a variable 
        let info = resultArray[0];

        let otu_ids = info.otu_ids;
        let otu_labels = info.otu_labels;
        let sample_values = info.sample_values;

        let barData = [
            {
                y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);

        let bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];


        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
};

function optionChanged(id) {
    demographic_info(id)
    graphs(id)
}
init();







