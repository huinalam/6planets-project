//              **웹폰트 설정**


WebFontConfig = {
    google: { families: ['Noto+Sans::latin'] }
};
(function () {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();




//              **전역변수 설정**


var margin = { top: 5, right: 5, bottom: 5, left: 5 },   //Column div1,2의 width와 그 안에 들어갈 svg width
    outerWidth1 = 580;
outerWidth2 = 350;
outerHeight = 720;
chart_height = 650; //svg안에 차트가 그려질 영역의 높이와 yScale의 range
width1 = outerWidth1 - margin.left - margin.right;
width2 = outerWidth2 - margin.left - margin.right;
height = outerHeight - margin.top - margin.bottom;

var timeline = {},   // The timeline data를 포함,label,axis시각적 요소까지 포함하는 timeline객첵 
    dataCon = {},       // Container for the data 각 item(사건)들의 시간,트랙,순서를 저장하는 객체
    components = [], // All the components of the timeline for redrawing
    bandGap = 10,    // Arbitray gap between to consecutive bands
    band = {}; //band object

bandY = 10,       // Y-Position of the next band
bandNum = 0;     // Count of bands for ids

var tracks = [];
var yScale;
var xScale_band; //bargrapch xScale_band;
var xScale_r;
var xScale_d;

var axis1; //axis함수에서 사용된 axis변
var yAxis1;

//chapter selecor를 그리기위한 날짜
var chapter_date = [
    { start: parseDate("2011-01-01"), end: parseDate("2011-06-01") },
    { start: parseDate("2011-05-01"), end: parseDate("2012-07-01") },
    { start: parseDate("2012-01-01"), end: parseDate("2013-01-01") },
    { start: parseDate("2013-01-01"), end: parseDate("2013-04-30") },
    { start: parseDate("2013-04-30"), end: parseDate("2013-09-30") },
    { start: parseDate("2013-09-30"), end: parseDate("2014-02-30") },
    { start: parseDate("2014-02-01"), end: parseDate("2014-12-31") },
    { start: parseDate("2014-09-01"), end: parseDate("2015-10-31") },
    { start: parseDate("2015-10-01"), end: parseDate("2015-11-31") }
];

var chapter_selector;

var body = d3.select("body");

var legend_list1 = ["civil_war", "intervention_m", "intervention_p", "agreement", "remarkable"];
var legend_list2 = ["International power", "Assad regime", "Islamic power", "Rebel", "ISIS"];

var main_svg = d3.select(".div_svg").append("svg") // 월별 난민 발생수를 bar chart
                .attr("width", width1)
                .attr("height", height);

var tooltip3 = body.append("div")
    .attr("class", "tooltip_div");


var alpha = 40; //mouseovell시 명암변화

//** 섹션별 position 지정 value ** //

var px_events = 90;
var px_death = 440;
var px_refugees = 290;

var div_line1;
var div_line2;

var chart = main_svg.append("g")                       // 이벤트들의 밴드들이 그룹
        .attr("class", "chart")
        .attr("clip-path", "url(#chart-area)")
        .attr("transform", "translate(20,-30)");


div_line1 = chart.append("line")
               .attr("class", "div_line")
               .attr("x1", px_events)
               .attr("y1", 50)
               .attr("x2", px_events)
               .attr("y2", chart_height - 10);


div_line2 = chart.append("line")
                .attr("class", "div_line")
                .attr("x1", px_death)
                .attr("y1", 50)
                .attr("x2", px_death)
                .attr("y2", chart_height - 10);

div_line3 = chart.append("line")
                .attr("class", "div_line")
                .attr("x1", px_refugees)
                .attr("y1", 50)
                .attr("x2", px_refugees)
                .attr("y2", chart_height - 10);

var line_graph_g = chart.append("g")
                    .attr("transform", "translate(0,0)");



var legend_timeline = chart.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(125,660)");

var legend_type = legend_timeline.append("g");

var legend_who = legend_timeline.append("g")
                    .attr("opacity", 0);

var legend_type_circle = legend_type.selectAll("circle")
                            .data(legend_list1)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return i * 15;
                            })
                            .attr("r", 4)
                            .attr("id", function (d) {
                                if (d == "civil_war") {
                                    return "civil_war";
                                }
                                else if (d == "intervention_m") {
                                    return "intervention_m";
                                }
                                else if (d == "intervention_p") {
                                    return "intervention_p";
                                }
                                else if (d == "agreement") {
                                    return "agreement";
                                }
                                else if (d == "remarkable") {
                                    return "remarkable";
                                }
                            });

var legend_type_text = legend_type.selectAll("text")
                                .data(legend_list1)
                                .enter()
                                .append("text")
                                .attr("x", 10)
                                .attr("y", function (d, i) {
                                    return i * 15 + 3;
                                })
                                .attr("id", "legend")
                                .text(function (d) {
                                    if (d == "civil_war") {
                                        return "Battle";
                                    }
                                    else if (d == "intervention_m") {
                                        return "Military Intervention";
                                    }
                                    else if (d == "intervention_p") {
                                        return "Political Intervention";
                                    }
                                    else if (d == "agreement") {
                                        return "Agreement";
                                    }
                                    else if (d == "remarkable") {
                                        return "Remarkable Event";
                                    }

                                });

var legend_who_circle = legend_who.selectAll("circle")
                            .data(legend_list2)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return i * 15;
                            })
                            .attr("r", 5)
                            .attr("id", function (d) {
                                if (d == "International power") {
                                    return "int";
                                }
                                else if (d == "Assad regime") {
                                    return "assad";
                                }
                                else if (d == "Islamic power") {
                                    return "islamic";
                                }
                                else if (d == "Rebel") {
                                    return "rebel";
                                }
                                else if (d == "ISIS") {
                                    return "isis";
                                }
                            });

var legend_who_text = legend_who.selectAll("text")
                                .data(legend_list2)
                                .enter()
                                .append("text")
                                .attr("x", 10)
                                .attr("y", function (d, i) {
                                    return i * 15 + 3;
                                })
                                .attr("id", "legend")
                                .text(function (d) {
                                    return d;
                                });

//---------------------------------------------------------------------------
//
// data
//

timeline.data = function (items) {

    var today = new Date(),
        yearMills = 31622400000,
        instantOffset = 100 * yearMills;

    dataCon.items = items;

    function showItems(n) {
        var count = 0; n = n || 10;

        dataCon.items.forEach(function (d) {
            count++;
            if (count > n) return;
        })
    }

    function compareAscending(item1, item2) {
        // Every item must have two fields; 'start' and 'end'.
        var result = item1.start - item2.start;
        // earlier first
        if (result < 0) { return -1; }
        if (result > 0) { return 1; }
        //longer furst
        result = item2.end - item1.end;
        if (result < 0) { return 1; }
        if (result > 0) { return -1; }
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

    function calculateTracks(items, sortOrder, timeOrder) {
        var i, track;

        sortOrder = sortOrder || "descending";
        timeOrder = timeOrder || "backward";

        function sortBackward() {
            //older items end deeper
            items.forEach(function (item) {
                for (i = 0, track = 0; i < tracks.length; i++, track++) {
                    if (item.end < tracks[i]) {
                        break;
                    }
                }

                item.track = track;
                tracks[track] = item.end
            });
        }

        function sortForward() {
            // younger items end deeper

            items.forEach(function (item) {
                for (i = 0; i < tracks.length; i++) {
                    if (item.start > tracks[i]) {

                        break;
                    }
                }


                item.track = i;//i=track

                if (item.instant) {

                    var month = item.start.getMonth();
                    item.end = new Date(item.start);
                    item.end.setMonth(month + 2);
                    //item.start.setMonth(month-1);

                }
                tracks[i] = item.end;//각 트랙의 마지막 아이템의 
            });
        }

        if (sortOrder === "ascending")
            dataCon.items.sort(compareAscending);
        else
            dataCon.items.sort(compareDescending);

        if (timeOrder === "forward")
            sortForward();
        else
            sortBackward();
    }

    // Convert yearStrings into dates
    dataCon.items.forEach(function (item) {
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
        if (item.end > today) { item.end = today };
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
        date = new Date(-1, 6, 1);
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
    var month = date.getMonth() + 1;
    var day = date.getDate();

    return year + "." + month + "." + day;
}

//draw band
timeline.setScale = function () {

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

    xScale_band = function (track) {
        return band.trackOffset + (track % (dataCon.nTracks)) * band.trackWidth;
    };
};

timeline.band = function () {

    band.g = chart.append("g")
            .attr("id", "mainBand")
            .attr("transform", "translate(" + px_events + ",0)")
            .attr("opacity", 0);

    var items = band.g.selectAll("svg")
                .data(dataCon.items)
                .enter().append("svg")
                .attr("y", function (d) {
                    return d.instant ? yScale(d.start) - 5 : yScale(d.start) - 5
                })
                .attr("x", function (d) {
                    return d.instant ? xScale_band(d.track) : xScale_band(d.track)
                })
                .attr("height", function (d) {
                    return d.instant ? band.itemWidth : (yScale(d.end) - yScale(d.start))
                })
                .attr("width", band.itemWidth)
                .attr("class", function (d) { return d.instant ? "instant" : "interval" })
                .attr("id", function (d) {
                    if (d.type == "civil_war") {
                        return "civil_war";
                    }
                    else if (d.type == "intervention_m") {
                        return "intervention_m";
                    }
                    else if (d.type == "intervention_p") {
                        return "intervention_p";
                    }
                    else if (d.type == "agreement") {
                        return "agreement";
                    }
                    else if (d.type == "remarkable") {
                        return "remarkable";
                    }
                    else {
                        return "etc";
                    }
                })
                .text(function (d) {
                    return d.label;
                })

    items.on("mouseover", function (d) {

        var xPosition = parseFloat(d3.select(this).attr("x")) + 200;
        var yPosition = parseFloat(d3.select(this).attr("y")) + 150;

        tooltip3
        .style("visibility", "visible")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .attr("id", function () {
            return d.type;
        })
        .html(function () {
            if (d.instant) {
                return "Title: " + d.label + "<br>" + "Date: " + toFullDate(d.start) + "<br>" + "Content: " + d.description;
            }
            else {
                return "Title: " + d.label + "<br>" + "Date: " + toFullDate(d.start) + "-" + toFullDate(d.end) + "<br>" + "Content: " + d.description;
            }

        });
    })
        .on("mouseout", function (d) {
            tooltip3
              .style("visibility", "hidden");
        });



    var intervals = d3.select("#mainBand").selectAll(".interval");
    intervals.append("rect")
            .attr("width", "80%")
            .attr("height", "80%")
            .attr("rx", 1)
            .attr("ry", 1)
            .on("mouseover", function (d) {

                var rgb = d3.rgb(d3.select(this).style("fill"));

                rgb.r += alpha;
                rgb.g += alpha;
                rgb.b += alpha;

                d3.select(this).style("fill", rgb);
            })
            .on("mouseout", function (d) {

                var rgb = d3.rgb(d3.select(this).style("fill"));

                rgb.r -= alpha;
                rgb.g -= alpha;
                rgb.b -= alpha;

                d3.select(this).style("fill", rgb);
            })





    var instants = d3.select("#mainBand").selectAll(".instant");
    instants.append("rect")
            .attr("width", "80%")
            .attr("height", "80%")
            .attr("rx", 1)
            .attr("ry", 1)
            .on("mouseover", function (d) {

                var rgb = d3.rgb(d3.select(this).style("fill"));

                rgb.r += alpha;
                rgb.g += alpha;
                rgb.b += alpha;

                d3.select(this).style("fill", rgb);
            })
            .on("mouseout", function (d) {

                var rgb = d3.rgb(d3.select(this).style("fill"));

                rgb.r -= alpha;
                rgb.g -= alpha;
                rgb.b -= alpha;

                d3.select(this).style("fill", rgb);
            })
}


//----------------------------------------------------------------------
//
// xAxis
//

timeline.yAxis = function () {

    var datelist = [1];

    for (var i = 0; i < 5; i++) {
        for (var j = 1; j < 7; j++) {
            datelist.push("201" + i + "-" + j * 2 + "-01");
        }
    }

    axis1 = d3.svg.axis()
    .scale(yScale)
    .orient("right")
    .tickSize(width1 - 100, 0)
    .ticks(12)
    .tickValues([parseDate("2011-01-01"), parseDate("2011-07-01"), parseDate("2012-01-01"), parseDate("2012-07-01"), parseDate("2013-01-01"), parseDate("2013-07-01"), parseDate("2014-01-01"), parseDate("2014-07-01"), parseDate("2015-01-01"), parseDate("2015-07-01"), parseDate("2015-11-01")])
    .tickFormat(function (d) { return toYear_Month(d); });

    yAxis1 = chart.append("g")
    .attr("class", "axis")
    .attr("id", "date_axis")
    .attr("transform", "translate(50,0)")
    .call(axis1)
    .call(customAxis)
    .select("path");

    d3.select("#date_axis").selectAll(".tick")
          .append("circle")
          .attr("cx", 1)
          .attr("cy", 0)
          .attr("r", 2)
          .attr("fill", "#dddddd");

}
function customAxis(g) {
    g.selectAll("text")
        .attr("x", -50)
        .attr("dy", 3);
}

d3.csv("timeline6.csv", function (d) {

    d3.csv("MartyrsCount.csv", function (data) {  // 난민 누적수

        data.forEach(function (item) {

            item.date = parseDate(item.date);
            item.ac_num = +item.ac_num;
            item.num = +item.num;
        });


        var min = 0;
        var max = d3.max(data, function (d) { return d.num });

        xScale_d = d3.scale.linear()
            .range([0, 80])
            .domain([min, 6000]);

        var xAxis = d3.svg.axis()
                 .scale(xScale_d)
                 .orient("top")
                 .ticks(4)
                 .tickValues([0, 3000, 6000])
                 .tickFormat(d3.format("s"))
                 .tickSize(6, 0);


        var point_group = line_graph_g.append("g")
                            .attr("transform", "translate(" + px_death + ",0)")
                            .selectAll("circle")
                            .data(data)
                            .enter();

        point_group.append("circle")
                    .attr("id", "death")
                    .attr("r", "3")
                    .attr("cx", function (d) {
                        return xScale_d(d.num);
                    })
                    .attr("cy", function (d) {
                        return yScale(d.date);
                    });

        var line_group = line_graph_g.append("g")
                            .attr("transform", "translate(" + px_death + ",0)")
                            .selectAll("line")
                            .data(data)
                            .enter();

        line_group.append("line")
            .attr("class", "line_d")
            .attr("x1", 0)
            .attr("y1", function (d) {
                return yScale(d.date);
            })
            .attr("x2", function (d) {
                return xScale_d(d.num);
            })
            .attr("y2", function (d) {
                return yScale(d.date);
            });

        var line = d3.svg.line()
                    .x(function (d) { return xScale_d(d.num); })
                    .y(function (d) { return yScale(d.date); })


        line_graph_g.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + px_death + ",50)")
                .call(xAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("dy", ".71em");
    });


    d3.csv("chartMonth_ac.csv", function (data) {  // 난민 누적수

        data.forEach(function (item) {

            item.date = parseDate(item.date);
            item.ac_num = +item.ac_num;
            item.num = +item.num;
        });


        var min = 0;
        var max = d3.max(data, function (d) { return d.num });

        xScale_r = d3.scale.linear()
            .range([150, 0])
            .domain([min, 250000]);

        var xAxis = d3.svg.axis()
                 .scale(xScale_r)
                 .orient("top")
                 .ticks(4)
                 .tickValues([0, 125000, 250000])
                 .tickFormat(d3.format("s"))
                 .tickSize(6, 0);


        var point_group = line_graph_g.append("g")
                            .attr("transform", "translate(" + px_refugees + ",0)")
                            .selectAll("circle")
                            .data(data)
                            .enter();

        point_group.append("circle")
                    .attr("id", "refugee")
                    .attr("r", "3")
                    .attr("cx", function (d) {
                        return xScale_r(d.num);
                    })
                    .attr("cy", function (d) {
                        return yScale(d.date);
                    });

        var line_group = line_graph_g.append("g")
                            .attr("transform", "translate(" + px_refugees + ",0)")
                            .selectAll("line")
                            .data(data)
                            .enter();

        line_group.append("line")
            .attr("class", "line_r")
            .attr("x1", 150)
            .attr("y1", function (d) {
                return yScale(d.date);
            })
            .attr("x2", function (d) {
                return xScale_r(d.num);
            })
            .attr("y2", function (d) {
                return yScale(d.date);
            });

        var line = d3.svg.line()
                    .x(function (d) { return xScale_d(d.num); })
                    .y(function (d) { return yScale(d.date); })


        line_graph_g.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + px_refugees + ",50)")
                .call(xAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("dy", ".71em");
    });

    d3.csv("frequency.csv", function (data) {

        data.forEach(function (item) {
            item.date = parseDate(item.date);
            item.interventionM = +item.interventionM;
            item.interventionP = +item.interventionP;
            item.civiWar = +item.civiWar;
            item.remarkable = +item.remarkable;

        });

        var frequency = chart.append("g")
                            .attr("class", "frequency")
                            .attr("transform", "translate(90,0)");

        var civil_war_g = frequency.append("g")
                            .attr("transform", "translate(33,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return yScale(d.date);
                            })
                            .attr("r", function (d) {
                                return d.civilWar * 2;
                            })
                            .attr("id", "death");

        var interventionP_g = frequency.append("g")
                            .attr("transform", "translate(66,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return yScale(d.date);
                            })
                            .attr("r", function (d) {
                                return d.interventionP * 2;
                            })
                            .attr("id", "intervention_p");

        var interventionM_g = frequency.append("g")
                            .attr("transform", "translate(99,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return yScale(d.date);
                            })
                            .attr("r", function (d) {
                                return d.interventionM * 2;
                            })
                            .attr("id", "intervention_m");

        var remarkable_g = frequency.append("g")
                            .attr("transform", "translate(132,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return yScale(d.date);
                            })
                            .attr("r", function (d) {
                                return d.remarkable * 2;
                            })
                            .attr("id", "remarkable");

        var agreement_g = frequency.append("g")
                            .attr("transform", "translate(165,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return yScale(d.date);
                            })
                            .attr("r", function (d) {
                                return d.agreement * 2;
                            })
                            .attr("id", "agreement");

    });

    d3.csv("involved2.csv", function (data) {

        data.forEach(function (item) {

            item.date = parseDate(item.date);
            item.Iran = +item.Iran;
            item.Assad = +item.Assad;
            item.UN = +item.UN;
            item.Rebel = +item.Rebel;
            item.Russia = +item.Russia;
            item.Hezbollah = +item.Hezbollah;
            item.Kurds = +item.Kurds;
            item.ISIS = +item.ISIS;
            item.US = +item.US;
            item.Saudi = +item.Saudi;
            item.Turkey = +item.Turkey;

        });

        var involved_g = chart.append("g")
                            .attr("class", "involved")
                            .attr("transform", "translate(90,0)")
                            .attr("opacity", 0);

        var Assad_g = involved_g.append("g")
                            .attr("transform", "translate(33,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return yScale(d.date);
                            })
                            .attr("r", function (d) {
                                return d.Assad * 2;
                            })
                            .attr("id", "assad");

        var Rebel_g = involved_g.append("g")
                            .attr("transform", "translate(66,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return yScale(d.date);
                            })
                            .attr("r", function (d) {
                                return d.Rebel * 2;
                            })
                            .attr("id", "rebel");

        var Islamic_g = involved_g.append("g")
                            .attr("transform", "translate(99,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return yScale(d.date);
                            })
                            .attr("r", function (d) {
                                return (d.Iran + d.Hezbollah + d.Kurds + d.Saudi + d.Turkey) * 2;
                            })
                            .attr("id", "islamic");

        var Int_g = involved_g.append("g")
                            .attr("transform", "translate(132,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return yScale(d.date);
                            })
                            .attr("r", function (d) {
                                return (d.UN + d.Russia + d.US) * 2;
                            })
                            .attr("id", "int");

        var isis_g = involved_g.append("g")
                            .attr("transform", "translate(165,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", 0)
                            .attr("cy", function (d, i) {
                                return yScale(d.date);
                            })
                            .attr("r", function (d) {
                                return d.ISIS * 2;
                            })
                            .attr("id", "isis");

        chapter_selector = chart.append("g")
                        .attr("transform", "translate(90,0)")
                        .append("svg")
                        .append("rect")
                        .attr("width", 200)
                        .attr("height", function () {
                            console.log(chapter_date[0]);
                            return yScale(chapter_date[0].end) - yScale(chapter_date[0].start);
                        })
                        .attr("x", 0)
                        .attr("y", yScale(chapter_date[0].start))
                        .attr("class", "chapter_selector");


    });

    d3.selectAll("input").on("change", change);

    function change() {
        var radio_checked = this.value;

        if (radio_checked == "type") {
            d3.select(".frequency")
                                   .transition()
                                   .duration(100)
                                   .attr("opacity", 1);

            d3.select(".involved")
                                    .transition()
                                    .duration(100)
                                    .attr("opacity", 0);

            d3.select("#mainBand")
                                    .transition()
                                    .duration(100)
                                    .attr("opacity", 0);

            legend_type.transition()
                       .duration(100)
                       .attr("opacity", 1);

            legend_who.transition()
                       .duration(100)
                       .attr("opacity", 0);

        } else if (radio_checked == "group") {
            d3.select(".frequency")
                                   .transition()
                                   .duration(100)
                                   .attr("opacity", 0);

            d3.select(".involved")
                                    .transition()
                                    .duration(100)
                                    .attr("opacity", 1);

            d3.select("#mainBand")
                                    .transition()
                                    .duration(100)
                                    .attr("opacity", 0);

            legend_type.transition()
                       .duration(100)
                       .attr("opacity", 0);

            legend_who.transition()
                       .duration(100)
                       .attr("opacity", 1);

        } else if (radio_checked == "event") {
            d3.select(".frequency")
                                   .transition()
                                   .duration(100)
                                   .attr("opacity", 0);

            d3.select(".involved")
                                    .transition()
                                    .duration(100)
                                    .attr("opacity", 0);

            d3.select("#mainBand")
                                    .transition()
                                    .duration(100)
                                    .attr("opacity", 1);

            legend_type.transition()
                       .duration(100)
                       .attr("opacity", 1);

            legend_who.transition()
                       .duration(100)
                       .attr("opacity", 0);

        }
    }

    timeline.data(d);
    timeline.setScale();
    timeline.yAxis();
    timeline.band();

});


// 타임라인에서 좌표가 옮겨지게 만들기 위한 코드
$(document).ready(function () {
    $("#nav").on("activate.bs.scrollspy", function () {
        var currentItem = $(".nav li.active > a").text();

        // 숫자로 잘라낸다
        var baseLength = "Time-Line-Topic".length;
        var number = currentItem.substr(baseLength);

        // 숫자로 변환
        number = parseInt(number);

        // 숫자가 아닐 경우, 예외처리. 0으로 만듦
        if (isNaN(number)) {
            number = 0;
        }
        // 값 확인
        //console.log(number);
        console.log(currentItem);


        // if문 없이 바로 숫자값으로 실행하도록 변경
        chapter_selector.transition()
                        .duration(1000)
                        .ease("elastic")
                        .attr("height", function () {
                            return yScale(chapter_date[number].end) - yScale(chapter_date[number].start);
                        })
                        .attr("y", yScale(chapter_date[number].start))
                        // 왼쪽 시간축의 길이가 120이므로, 이를 뺌
                        .attr("width", width1 - 140)
        ;
        // 화면상에 디버깅을 위한 코드
        $("#info").empty().html("현재 선택 - " + currentItem);

        for (var i = 0; i < 9; i++) {
            if (i == number) {
                d3.select("#t" + i).transition()
                                .duration(2500)
                                .style("opacity", 1);
            }
            else {
                d3.select("#t" + i).transition()
                               .duration(2500)
                               .style("opacity", 0);
            }
        }


    });
});