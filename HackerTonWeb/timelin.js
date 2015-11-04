   //---------------------------------------------------------------------------
    //
    // data
    //

    timeline.data = function(items){

        var today = new Date(),
            yearMills = 31622400000,
            instantOffset = 100* yearMills;

        dataCon.items = items;

        function showItems(n){
            var count = 0; n=n || 10;
            
            dataCon.items.forEach(function (d){
                count++;
                if(count > n) return;
                
            })
        }

        function compareAscending(item1, item2){
            // Every item must have two fields; 'start' and 'end'.
            var result = item1.start - item2.start;
            // earlier first
            if(result <0){ return -1;}
            if(result >0){ return 1;}
            //longer furst
            result = item2.end - item1.end;
            if(result <0) {return 1;}
            if(result >0) {return -1;}
            return 0;
        }
        function compareDescending(item1, item2) {
            // Every item must have two fields: 'start' and 'end'.
            var result = item1.start - item2.start;
            // later first
            if (result < 0) { return 1; }
            if (result > 0) { return -1; }
            // shorter first
            result = item2.end - item1.end;
            if (result < 0) { return 1; }
            if (result > 0) { return -1; }
            return 0;
        }

        function calculateTracks(items, sortOrder, timeOrder){
            var i,track;

            sortOrder = sortOrder || "descending";
            timeOrder = timeOrder || "backward";

            function sortBackward(){
                //older items end deeper
                items.forEach(function (item){
                    for(i=0, track=0; i<tracks.length; i++, track++){
                        if(item.end < tracks[i]){ 
                         break; }
                    }
            
                    item.track = track;
                    tracks[track] = item.end
                });
            }
            function sortForward() {
                // younger items end deeper
                
                items.forEach(function (item) {
                    for (i = 0; i < tracks.length; i++) {
                        if (item.start > tracks[i]) {  //
                            //console.log("i= " +i+ ", track= " + track);
                            break; }
                    }
                    //console.log("tracks.length: "+ tracks.length);

                    item.track = i;//i=track
                    
                    if(item.instant){
                        
                        var month = item.start.getMonth();
                        item.end = new Date(item.start);
                        item.end.setMonth(month+2);
                        //item.start.setMonth(month-1);
                        
                    }
                    tracks[i] = item.end;//각 트랙의 마지막 아이템의 
                });
            }

            if(sortOrder ==="ascending")
                dataCon.items.sort(compareAscending);
            else
                dataCon.items.sort(compareDescending);

            if(timeOrder ==="forward")
                sortForward();
            else
                sortBackward();
        }

        // Convert yearStrings into dates
        dataCon.items.forEach(function (item){
            item.start = parseDate(item.start);
            if (item.end == "") {
                
                //console.log("2 item.end: " + item.end);
                item.end = new Date(item.start.getFullYear() + instantOffset);
                //console.log("3 item.end: " + item.end);
                item.instant = true;
            } else {
                //console.log("4 item.end: " + item.end);
                item.end = parseDate(item.end);
                item.instant = false;
            }
            // The timeline never reaches into the future.
            // This is an arbitrary decision.
            // Comment out, if dates in the future should be allowed.
            if (item.end > today) { item.end = today};
        });

        //calculateTracks(data.items);
        // Show patterns
        //calculateTracks(data.items, "ascending", "backward");
        //calculateTracks(data.items, "descending", "forward");
        // Show real data
        //calculateTracks(dataCon.items, "descending", "backward");
        calculateTracks(dataCon.items, "ascending", "forward");
        dataCon.nTracks = tracks.length;
        dataCon.minDate = d3.min(dataCon.items, function (d) { return d.start; });
        dataCon.minDate = parseDate("2010-12-01");
        dataCon.maxDate = parseDate("2015-12-01");
        

        return timeline;

    };

    function parseDate(dateString) {
        // 'dateString' must either conform to the ISO date format YYYY-MM-DD
        // or be a full year without month and day.
        // AD years may not contain letters, only digits '0'-'9'!
        // Invalid AD years: '10 AD', '1234 AD', '500 CE', '300 n.Chr.'
        // Valid AD years: '1', '99', '2013'
        // BC years must contain letters or negative numbers!
        // Valid BC years: '1 BC', '-1', '12 BCE', '10 v.Chr.', '-384'
        // A dateString of '0' will be converted to '1 BC'.
        // Because JavaScript can't define AD years between 0..99,
        // these years require a special treatment.

        var format = d3.time.format("%Y-%m-%d"),
            date,
            year;

        date = format.parse(dateString);
        if (date !== null) return date;

        // BC yearStrings are not numbers!
        if (isNaN(dateString)) { // Handle BC year
            // Remove non-digits, convert to negative number
            year = -(dateString.replace(/[^0-9]/g, ""));
        } else { // Handle AD year
            // Convert to positive number
            year = +dateString;
        }
        if (year < 0 || year > 99) { // 'Normal' dates
            date = new Date(year, 6, 1);
        } else if (year == 0) { // Year 0 is '1 BC'
            date = new Date (-1, 6, 1);
        } else { // Create arbitrary year and then set the correct year
            // For full years, I chose to set the date to mid year (1st of July).
            date = new Date(year, 6, 1);
            date.setUTCFullYear(("0000" + year).slice(-4));
        }

        
        // Finally create the date
        return date;
    }

    function toYear_Month(date) {
      
      
        var year = date.getFullYear();
        var month = date.getMonth();

        
            month += 1;
            return year + "." + month;
        
        
    }
    function toFullDate(date) {
       
        var year = date.getFullYear();
        var month = date.getMonth() +1;
        var day = date.getDate();

        return year + "." + month + "." + day;
    }

//draw band
timeline.setScale = function(){

    band.x = 0;
    band.y = bandY;
    band.w = width1;
    band.h = height * (0.82 || 1);
    band.trackOffset = 10;
    band.trackWidth = Math.min((band.h - band.trackOffset) / dataCon.nTracks, 12);
    band.itemWidth = band.trackWidth * 0.6;
    band.instantWidth = 100;

    yScale = d3.time.scale()
            .domain([dataCon.minDate, dataCon.maxDate])
            .range([40, chart_height]);

    xScale_band = function(track){
        return band.trackOffset + (track%(dataCon.nTracks)) * band.trackWidth;
    };
};

timeline.band = function(){

    band.g = chart.append("g")
            .attr("id", "mainBand")
            .attr("transform", "translate("+px_events+",0)");

    var items = band.g.selectAll("svg")
                .data(dataCon.items)
                .enter().append("svg")
                .attr("y",function (d){
                    return d.instant ? yScale(d.start)-5 : yScale(d.start)-5})
                .attr("x",function (d){
                    return d.instant ? xScale_band(d.track) : xScale_band(d.track)})
                .attr("height", function (d){ 
                    return d.instant ? band.itemWidth : (yScale(d.end) - yScale(d.start))
                })
                .attr("width", band.itemWidth)
                .attr("class", function (d){return d.instant ? "instant" : "interval"})
                .attr("id", function (d){
                    if(d.type=="civil_war"){
                        return "civil_war";
                    }
                    else if(d.type=="intervention_m"){
                        return "intervention_m";
                    }
                    else if(d.type=="intervention_p"){
                        return "intervention_p";
                    }
                    else if(d.type=="agreement"){
                        return "agreement";
                    }
                    else if(d.type=="remarkable"){
                        return "remarkable";
                    }
                     else{
                        return "etc";
                    }
                })
                .text(function(d){
                    return d.label;
                })

                items.on("mouseover",function(d){
                    
                    var xPosition = parseFloat(d3.select(this).attr("x")) + 200;
                    var yPosition = parseFloat(d3.select(this).attr("y")) + 150;
                
                    tooltip3
                    .style("visibility","visible")
                    .style("left", xPosition +"px")
                    .style("top", yPosition + "px")
                    .attr("id",function(){
                            return d.type;
                    })
                    .html(function(){
                        if(d.instant){
                            console.log(d.instant);
                           return "Title: " + d.label + "<br>" +"Date: " + toFullDate(d.start)  + "<br>"+ "Content: " +d.description;
                            }
                        else{
                            return "Title: " + d.label + "<br>" +"Date: " + toFullDate(d.start) + "-" + toFullDate(d.end)+ "<br>"+ "Content: " +d.description;
                            }

                        });
                    })
                    .on("mouseout",function(d){
                        tooltip3
                          .style("visibility","hidden");
                    });

             

    var intervals = d3.select("#mainBand").selectAll(".interval");
        intervals.append("rect")
                .attr("width","80%")
                .attr("height","80%")
                .attr("rx",1)
                .attr("ry",1)
                .on("mouseover",function(d){
                    
                    var rgb =  d3.rgb(d3.select(this).style("fill"));
                    
                    rgb.r +=alpha;
                    rgb.g +=alpha;
                    rgb.b +=alpha;
                  
                    d3.select(this).style("fill",rgb);
                })
                .on("mouseout",function(d){
                    
                    var rgb =  d3.rgb(d3.select(this).style("fill"));
                    
                    rgb.r -=alpha;
                    rgb.g -=alpha;
                    rgb.b -=alpha;
                  
                    d3.select(this).style("fill",rgb);
                })




                
    var instants = d3.select("#mainBand").selectAll(".instant");
        instants.append("rect")
                .attr("width","80%")
                .attr("height","80%")
                .attr("rx", 1)
                .attr("ry", 1)
                .on("mouseover",function(d){
                    
                    var rgb =  d3.rgb(d3.select(this).style("fill"));
                    
                    rgb.r +=alpha;
                    rgb.g +=alpha;
                    rgb.b +=alpha;
                  
                    d3.select(this).style("fill",rgb);
                })
                .on("mouseout",function(d){
                    
                    var rgb =  d3.rgb(d3.select(this).style("fill"));
                    
                    rgb.r -=alpha;
                    rgb.g -=alpha;
                    rgb.b -=alpha;
                  
                    d3.select(this).style("fill",rgb);
                })
}


//----------------------------------------------------------------------
    //
    // xAxis
    //

timeline.yAxis = function(){

        var datelist =[1];

        for(var i=0; i<5; i++){
            for(var j=1; j<7; j++){
                datelist.push("201" + i + "-" + j*2 +"-01");
                console.log(datelist);
            }
        }

        axis1 = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .tickSize(width1-100,0)
        .ticks(12)
        .tickValues([parseDate("2011-01-01"),parseDate("2011-07-01"),parseDate("2012-01-01"),parseDate("2012-07-01"),parseDate("2013-01-01"),parseDate("2013-07-01"),parseDate("2014-01-01"),parseDate("2014-07-01"),parseDate("2015-01-01"),parseDate("2015-07-01"),parseDate("2015-11-01")])
        .tickFormat(function(d){ return toYear_Month(d);});

        yAxis1 = chart.append("g")
        .attr("class", "axis")
        .attr("id", "date_axis")
        .attr("transform", "translate(50,0)")
        .call(axis1)
        .call(customAxis)
        .select("path");

        d3.select("#date_axis").selectAll(".tick")
              .append("circle")
              .attr("cx",1)
              .attr("cy",0)
              .attr("r",2)
              .attr("fill","#dddddd");

}