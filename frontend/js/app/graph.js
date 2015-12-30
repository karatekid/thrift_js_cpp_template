// Adapted from Line Chart example: http://bl.ocks.org/mbostock/3883245
define(["lib/d3.min"], function(d3) {
    // Visuals
    var margin = {top: 40, right: 30, bottom: 30, left: 50},
        width  = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var x = d3.scale.linear()
        .range([0, width]);
    var linePadding = 10;
    var y = d3.scale.linear()
        .range([height, 0]);
    function formatTime(d) {
        var prefix = d3.formatPrefix(d);
        return prefix.scale(d).toFixed(2) + prefix.symbol + 'S';
    }
    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(6)
        .tickFormat(formatTime)
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding(10)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    var line = d3.svg.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d); });

    // SVG Creation / update
    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Axes
    var xAxisGraph = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")");
    var yAxisGraph = svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");

    // Lines
    var lineContainer = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "lineContainer");

    // Update lines w/ new data ie) fetch
    // Data takes form of dictionary, channel is key and data array is value
    // DataFreq is the frequency of the incoming data
    var update = function(data) {
        // Setup domain
        x.domain([
                d3.min(data, function(d, i) { return i; }),
                d3.max(data, function(d, i) { return i; })
                ]);
        y.domain([
                d3.min(data, function(d) { return d; }),
                d3.max(data, function(d) { return d; })
                ]);
        // Axis update
        xAxisGraph.call(xAxis);
        yAxisGraph.call(yAxis);

        // NOTE: Not following d3 methodology of update, enter, exit
        // Get rid of old path
        lineContainer.selectAll("path").remove();
        // Draw new path
        var myLine = lineContainer.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    };

    function splitD3Transform(elt) {
        var transformString = elt.attr("transform");
        var lParenPos = transformString.indexOf("(");
        var commaPos = transformString.indexOf(",");
        var rParenPos = transformString.indexOf(")");
        return {
            x: parseFloat(transformString.slice(lParenPos + 1, commaPos)),
            y: parseFloat(transformString.slice(commaPos + 1, rParenPos))
        };
    }

    return {
        update: update
    };
});
