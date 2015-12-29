define(["lib/d3.min"], function(d3) {
    var cursorChanged = null;
    var initialize = function(initParams) {
        cursorChanged = initParams.onCursorChanged;
    };
    // Generate series of 1's & 0's from array of durations
    var genFakeData = function(arr, curVal) {
        // Default params
        curVal = typeof curVal !== 'undefined' ? curVal : 1;
        // Computation
        var data = [];
        for(var i = 0; i < arr.length; ++i) {
            for(var len = 0; len < arr[i]; ++len) {
                data.push(curVal);
            }
            curVal = curVal == 1 ? 0 : 1;
        }
        return data;
    };
    // Setup
    //TODO: hook up to actual frequency
    var frequency = 1000000; //1MHZ
    // Compute from frequency
    var period = 1.0 / frequency;
    // Visuals
    var margin = {top: 40, right: 30, bottom: 30, left: 50},
        width  = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var x = d3.scale.linear()
        .range([0, width]);
    var linePadding = 10;
    var lineHeight = height / 16 - linePadding;
    var y = d3.scale.linear()
        .range([lineHeight, 0]);
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
    var colors = d3.scale.category20()
        .domain(d3.range(16));
    var line = d3.svg.line()
        .defined(function(d, i) {
            i = x(i * period);
            return i >= 0 && i <= width;
        })
        .x(function(d, i) { return x(i*period); })
        .y(function(d) { return y(d); });
    // Step Fxn
    line.interpolate('step-after');
    var drag = d3.behavior.drag()
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, Infinity])
        .on("zoom", zoomed);

    // Generate fake data
    var steppers = [
        [100, 300, 10, 20, 200, 70],
        [100, 200, 100, 150, 150],
        [200, 300, 200],
        [120, 140, 40, 400],
        [100, 300, 10, 20, 200, 70],
        [100, 200, 100, 150, 150],
        [200, 300, 200],
        [120, 140, 40, 400],
        [100, 300, 10, 20, 200, 70],
        [100, 200, 100, 150, 150],
        [200, 300, 200],
        [120, 140, 40, 400],
        [100, 300, 10, 20, 200, 70],
        [100, 200, 100, 150, 150],
        [200, 300, 200],
        [120, 140, 40, 400]];
    var allData = {};
    for(var i = 0; i < steppers.length; ++i) {
        allData[i] = genFakeData(steppers[i]);
    }
    var updateSteppers = [
        [300, 100, 30, 130, 140],
        [50, 150, 90, 160, 150],
        [100, 400, 100, 100],
        [120, 180, 400],
        [300, 100, 30, 130, 140],
        [50, 150, 90, 160, 150],
        [100, 400, 100, 100],
        [120, 180, 400],
        [300, 100, 30, 130, 140],
        [50, 150, 90, 160, 150],
        [100, 400, 100, 100],
        [120, 180, 400],
        [300, 100, 30, 130, 140],
        [50, 150, 90, 160, 150],
        [100, 400, 100, 100],
        [120, 180, 400],
        ];
    var updateData = {};
    for(var i = 0; i < updateSteppers.length; ++i) {
        updateData[i] = genFakeData(updateSteppers[i]);
    }

    // SVG Creation / update
    var svg = d3.select("#digitalin-graph-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // Axes
    var xAxisGraph = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")");

    // Cursors
    // Side: -1 = left, +1 = right
    var genCursor = function(id, xStart, rectXOffset) {
        var cursor = svg.append("g")
            .attr("class", "cursor")
            .attr("id", id)
            .attr("transform", "translate(" + xStart + "," + (margin.top + height) + ")")
            .attr("x", xStart - margin.left);
        cursor.append("line")
            .attr("class", "cursor-line")
            .attr("y2", -(height + margin.top/2));
        cursor.append("rect")
            .attr("x", rectXOffset)
            .attr("y", -(height + margin.top))
            .attr("width", margin.top/2)
            .attr("height", margin.top);
        cursor.call(drag);
        return cursor;
    };
    var lCursor = genCursor("lCursor", margin.left, -(margin.top/2 -1));
    var rCursor = genCursor("rCursor", margin.left + width, -1);

    // Lines
    var lineContainer = svg.append("g")
        .attr("id", "lineContainer");

    // Legend
    var legend = svg.append("g")
        .attr("id", "legend");

    // Update lines w/o new data ie) zoom
    var reloadLines = function() {
        // Axis update
        xAxisGraph.call(xAxis);
        // Get Lines
        lineContainer.selectAll("g")
            .select("path")
            .attr("d", function(d) { return line(d.value); });
    };

    // Update lines w/ new data ie) fetch
    // Data takes form of dictionary, channel is key and data array is value
    // DataFreq is the frequency of the incoming data
    var updateLines = function(data, dataFreq) {
        // Default value
        dataFreq = typeof dataFreq !== 'undefined' ? dataFreq : 1000.0;
        // Assign global period
        period = 1.0 / dataFreq;

        data = d3.entries(data); //Turn into array of key and value
        for(var i = 0; i < data.length; ++i) {
            data[i].key = parseInt(data[i].key);
        }
        // Setup domain
        x.domain([
                d3.min(data, function(c) { return d3.min(c.value, function(d, i) { return i*period; }); }),
                d3.max(data, function(c) { return d3.max(c.value, function(d, i) { return i*period; }); })
                ]);
        svg.call(zoom.x(x));
        y.domain([
                d3.min(data, function(c) { return d3.min(c.value, function(d) { return d; }); }),
                d3.max(data, function(c) { return d3.max(c.value, function(d) { return d; }); })
                ]);
        // Axis update
        xAxisGraph.call(xAxis);
        // Get Lines
        var lines = lineContainer.selectAll("g").data(data);
        // Update only
        // Enter only
        lines.enter()
            .append("g")
            .attr("height", lineHeight)
            .attr("transform", function(d) { return "translate(" + margin.left + "," + (margin.top + d.key*(lineHeight + linePadding)) + ")";})
            .attr("id", function(d) { return "line" + d.key; })
            .append("path")
            .attr("class", "line");
        // Update & enter
        lines.select("path")
            .attr("stroke", function(d) { return colors(d.key); })
            .attr("d", function(d) { return line(d.value); });
        // Exit
        lines.exit().remove();

        // Apply data to legend
        var legendEntries = legend.selectAll("g").data(data);
        // Update only
        // Enter only
        var newLegendEntries = legendEntries.enter()
            .append("g")
            .attr("height", lineHeight)
            .attr("transform", function(d) { return "translate(0," + (margin.top + lineHeight + d.key*(lineHeight + linePadding)) + ")";})
            .attr("id", function(d) { return "legendEntry" + d.key;});
        newLegendEntries.append("text")
            .attr("class", "legendTextEntry")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px");
        // Update & enter
        legendEntries.select("text")
            .text(function(d) { return d.key; })
            .attr("fill", function(d) { return colors(d.key);});
        // Exit
        legendEntries.exit().remove();
    };

    function zoomed() {
        // Bound zoom / pan
        var leftBound = x.range()[0],
            rightBound = -x.range()[1] * (zoom.scale() - 1);
        var curX = zoom.translate()[0],
            curY = zoom.translate()[1];
        curX = Math.min(curX, leftBound);
        curX = Math.max(curX, rightBound);
        zoom.translate([curX, curY]);

        // Redraw
        reloadLines();
        if(cursorChanged) {
            cursorChanged();
        }
    }

    function dragstarted() {
        d3.event.sourceEvent.stopPropagation();
    }
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
    function getCursorX(cursor) {
        return splitD3Transform(cursor).x;
    }
    function boundCursor(cursor, newX) {
        var min = margin.left,
            max = margin.left + width;
        // Bounds check
        if(cursor.id == "rCursor") {
            min = getCursorX(d3.select("#lCursor"));
        } else {
            max = getCursorX(d3.select("#rCursor"));
        }
        newX = Math.min(newX, max);
        newX = Math.max(newX, min);
        return newX;
    }
    function dragged() {
        var eventY = splitD3Transform(d3.select(this)).y;
        var eventX = boundCursor(this, d3.event.x);
        d3.select(this).attr("transform",
                "translate(" + eventX + "," + eventY + ")")
            .attr("x", eventX - margin.left);

        if(cursorChanged) {
            cursorChanged(this.id, x.invert(eventX - margin.left));
        }
    }
    function dragended() {
    }

    updateLines(allData);
    return {
        initialize: initialize,
        updateLines: updateLines,
        updateData: updateData,
        invertX: x.invert,
        formatTime: formatTime
    };
});
