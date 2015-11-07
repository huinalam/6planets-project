  window.addEventListener('scroll',chapterMove,false);

    function chapterMove(){
        console.log(window.pageYOffest);
}
//웹폰트 추가: Roboto + Slab
	 WebFontConfig = {	
                    google: { families: [ 'Roboto+Slab:100:latin', 'Source+Code+Pro:400,300,200:latin' ] }
                  };
                  (function() {
                    var wf = document.createElement('script');
                    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
                      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
                    wf.type = 'text/javascript';
                    wf.async = 'true';
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(wf, s);
                  })();
    				//** SVG,PATH 설정
    var w=520; //path가 그려질 svg크기
    var h=520;
    var center = [32.8333, 39.9167];		  //지도의 중앙에 위치한 터키 좌표
	var projection = d3.geo.conicConformal().center(center)   //투영법 및 스케인, path translate값 입력
					.clipAngle(180)
					.scale(550)
					.translate([0,h/3 + 100])
					.precision(.1);
	var map_path;			//실제 지도를 그리는 path값
	var map_label;
	var legend;

	var pie_arc;
	var pie_text;


					//**연도 버튼, 국가리스트 배열 설정
	var year = 2004;
    var buttonYears = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014]; //선택될 연도 
    var countryList = ["Egypt", "Iraq", "Jordan", "Lebanon","Turkey","Syria","Italy","France","Greek","United Kingdom", "Sweden", "Germany", "Libya", "Saudi Arabia", "Yemen"]; //이름이 표시될 국가들
    var countryList2 = ["Egypt", "Iraq", "Jordan", "Lebanon","Turkey","Italy","France","Greek","United Kingdom", "Sweden", "Germany", "Libya", "Saudi Arabia", "Yemen"]; //난민 숫자가 표시될 국가들
    

    				//** 전역변수로 갖고 있어야할 data들 또는 인터랙션에 따라 필터링해야 하는 data값들을 저장하는 변수들
    var data1;
    var data2;
    var	popData1; //map 년도 필터링 data 및 바로 전에 필터링된 data
    var preData1;
    var popData2; //pie 년도 필터링 data 및 바로 전에 필터링된 data
    var preData2;
    var map_legend;
    var map_json;
    var map_number;
    var duration =[]; //각 국가의 난민변화수량에 맞게 duration 
    var map_legend_num =[1,10,100,1000,10000,100000,1000000]

    				//** 카토그램 및 파이 그래프에 필요한 색상들
    var c1 = "#338866"; //카토그램 첫번째 색
	var c2 = "#C23355";
	var c3 = "#772222"; //시리아 지도표시
	
	var color = d3.scale.log()
 							.range([c1,c2]);		//카토그램 칼라스케일
 	var alpha = 90;
 
 	var scale_legend = d3.scale.linear()
 							.domain([0,200])
 							.range([0,1500000]);		//레전드바에 칼라매핑을 하기 위한 실제수치변환 스케일


 					
    var svg_map = d3.select(".div_svg1")  //맵이 그려질 svg추가
    				.append("svg")
    				.attr("width",w)
    				.attr("height",h);

    var group = svg_map.append("g")		//맵 path를 묶을 그룹 추가
    					.attr("transform","translate(280,40)")
    					.attr("class","world");

    var path = d3.geo.path().projection(projection);  //path의 프로젝션값 설정 
    
    var buttons = d3.select(".button-selector")
    				.append("div")
    				.attr("class","button-container")
    				.attr("align", "center")
    				.selectAll("p").data(buttonYears)
    				.enter().append("p")
    				.attr("align","center")
    				.text(function(d){ return d;})
    				.attr("class",function(d){
    					if(d==year)
    						return "button selected";
    					else
    						return "button";
    				});

    var pie_width = 240;
    var pie_height = 240;
    var outerRadius = pie_width/2;
    var innerRadius = 60;
     
    var arc = d3.svg.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);

    var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) {return d.value;});

    var pie_svg = d3.select(".div_svg2")		//대륙간 비교 파이차
                    .append("svg")
                    .attr("class","svg2")
                    .attr("width",pie_width)
                    .attr("height",pie_height);

    d3.csv("refugees_changes_per_year.csv", function(data){
		data.forEach(function(d){
          d.refugees_value = +d.refugees_value;
          d.AS_value = +d.AS_value;
          });

		data1 = data;
		
	    color.domain([1, d3.max(data1, function(d){ return d.refugees_value;})]);


        popData1 = data1.filter(function(d) {return d.year == year});

		d3.json("refugees_map2.json", function(json){   	//시라이+중동+아프리카+유럽 포함된 지도. 

		map_json = json;

		for(var i=0; i<popData1.length; i++){
			
			var dataCountry = popData1[i].destination;
			var refugeesValue = popData1[i].refugees_value;
	

			for(var j =0; j<map_json.features.length; j++){
				
				var jsonCountry = json.features[j].properties.name;
				
				if(dataCountry == jsonCountry){
					map_json.features[j].properties.refugeesValue = refugeesValue;
					break;
				}
			}
		}



		map_title = group.append("g")
						 .attr("transform","translate(-280,-15)");

		map_title.append("text")
				 .attr("class","map_title")
				 .attr("x",0)
				 .attr("y",0)
				 .attr("text-anchor","start")
				 .text("Refugees");

		map_title.append("text")
				 .attr("class","map_title")
				 .attr("x",0)
				 .attr("y",25)
				 .attr("text-anchor","start")
				 .text("Map");


		map_path = group.append("g")
						.selectAll("path")
						.data(map_json.features)
						.enter()
		 				.append("path")
						.attr("d",path)
						.attr("class","pp")
						.style("fill", function(d){
							var value = d.properties.refugeesValue;
							value = +value;
							if(d.properties.name == "Syria"){
								return c3;
							}
							if(value){
								return color(value);
							}
							else{
								return c1;
							}
						
						});

		map_label = group.append("g")
							.selectAll("text")
							.data(map_json.features)
							.enter()
							.append("text")
							.attr("class",function(d){
								if(d.properties.name=="Syria"){
									return "syria_label";
								}
								else{
									return "map_label";
								}
							})
							.attr("transform", function(d){
								if(d.properties.name == "Lebanon"){
									return "translate(" + path.centroid(d) +")" + "translate(-35,5)";
								}
								else if(d.properties.name == "Syria"){
									return "translate(" + path.centroid(d) +")";
								}
								else{
									return "translate(" + path.centroid(d) +")" + "translate(0,-5)";
								}	
							})
							.attr("text-anchor","middle")
							.text(function(d){
								for(var i=0; i<countryList.length; i++){
									if(d.properties.name == countryList[i])	
										return d.properties.name;	
								}
								
							})
							.style("fill",function(d,i){
								if(d.properties.name!="Syria"){
								 var value = d.properties.refugeesValue;
								
								 if(value!=0){
								 	 var rgb =  d3.rgb(color(value));
								 }
								 else{
								 	rgb = d3.rgb(c1);
								 }

			                    rgb.r +=alpha;
			                    rgb.g +=alpha;
			                    rgb.b +=alpha;

			                    return rgb;
			                	}else{
			                		return "#eeeeee";
			                	}

							});


		map_number = group.append("g")
							.selectAll("text")
							.data(map_json.features)
							.enter()
							.append("text")
							.attr("class","map_number")
							.attr("transform", function(d){
								if(d.properties.name == "Lebanon"){
									return "translate(" + path.centroid(d) +")" + "translate(-35,17)";
								}
								else{
									return "translate(" + path.centroid(d) +")" + "translate(0,7)";
								}	
							})
							.attr("text-anchor","middle")
							.text(function(d){
								for(var i=0; i<countryList.length; i++){
									if(countryList[i]===d.properties.name){
										return d.properties.refugeesValue;
									}
								}
								
							});
							
				});


		map_legend = group.append("g")
						  .attr("transform","translate(160,40)")
						  .selectAll('g')
						  .data(map_legend_num)
						  .enter()
						  .append("g");
						  
		 map_legend.append("rect").attr("x",0)
								  .attr("y",function(d,i){
								  	return map_legend_num.length*15 - i*15;
								  })
								  .attr("width",15)
								  .attr("height",15)
								  .attr("stroke","#cccccc")
								  .attr("stroke-width",0.5)
								  .attr("fill",function(d){
								  	return color(d);
								  });
								  
					  map_legend.append("text")
					  			  .attr("text-anchor","start")
								  .text(function(d){
								  	return "-" + d3.format(",")(d);
								  })
								  .attr("x",20)
								  .attr("y",function(d,i){
								
								  	return map_legend_num.length*15 - i*15 +10;
								  })
								  .attr("class","map_legend_text");

		

		

	});

d3.csv("refugees_sum_year.csv", function(error, data){

          data.forEach(function(d){
          d.value = +d.value;
          d.year = +d.year;
          });

          data2 = data;
          popData2 = data.filter(function(d) {return d.year == year});
          var sum = popData2[0].value + popData2[1].value;//각 연도 대륙별 합계


          arc_svg = pie_svg
                        .append("g")
                        .attr("transform", "translate(" + outerRadius +","+outerRadius +")");

          pie_arc = arc_svg.append("g")
          					.attr("class","pie_arc");

          pie_text = arc_svg.append("g")
          					.attr("class","pie_text");

          var pie_legend = arc_svg.append("g")
          					.attr("class","pie_legend")
          					.attr("transform","translate(-40,-15)")

          pie_arc.selectAll("path")
          		 .data(pie(popData2))
                 .enter()
                 .append("path")
                  .attr("d",arc)
                  .each(function(d) {this._current = d;})
                  .style("fill", function(d) { if(d.data.div =="sum_mid"){
                         return c1;
                  }else{
                         return c2; 
                  }});

          pie_text.selectAll("text")
          		 .data(pie(popData2))
                 .enter()
                 .append("text")
                 .attr("d",arc)
                 .attr("transform", function(d){
                         return "translate(" + arc.centroid(d) + ")";
                 })
                 .attr("text-anchor", "middle")
                 .attr("class","pie_text")
                 .text(function(d){
                        return d3.format("%")(d.value/sum);
                });


          
          pie_legend.append("rect")
         		 .attr("x",0)
          		 .attr("y",20)
          		 .attr("width",13)
          		 .attr("height",13)
          		 .attr("fill",c1);

          pie_legend.append("rect")
          		 .attr("x",0)
          		 .attr("y",0)
          		 .attr("width",13)
          		 .attr("height",13)
          		 .attr("fill",c2);

          pie_legend.append("text")
          		 .attr("x",15)
          		 .attr("y",10)
          		 .text("EUROPE")
          		 .attr("class","me");

          pie_legend.append("text")
          		 .attr("x",15)
          		 .attr("y",30)
          		 .text("MIDDLE EAST")
          		 .attr("class","dev");

     });


	buttons.on("click", function(d) {
	          d3.select(".selected")
	               .classed("selected", false);
	          d3.select(this)
	               .classed("selected", true);
	          
	          year = d;
	          preData1= popData1; //이전 데이타 저장
	          popData1 = data1.filter(function(d) {return d.year == year}); //새 데이터 갱신

	//---popData 랭킹 정하기
	        for(var i=0;i<popData1.length;i++){
				popData1[i].rank = popData1.length; 
			}

			for(var i=0;i<popData1.length;i++){
				for(var j=0;j<popData1.length;j++){
					if(popData1[i].refugees_value>popData1[j].refugees_value){
						popData1[i].rank -= 1;
					}
				}
			}

	//---popData에 매칭되는 값을 map_json에 입력하

	        for(var i=0; i<popData1.length; i++){
				
				var dataCountry = popData1[i].destination;
				var refugeesValue = popData1[i].refugees_value;
			
				for(var j =0; j<map_json.features.length; j++){
					
					var jsonCountry = map_json.features[j].properties.name;
					
					if(dataCountry == jsonCountry){
						map_json.features[j].properties.refugeesValue = refugeesValue;
						break;
					}
				}

			}

			map_number.data(map_json.features)
	    			  .transition()
	    			  .delay(function(d,i){
	    				return i*30;
	    			   })
	    			  .duration(function(d,i){
	 
	    				currentNum = +this.textContent;
	    			  	duration[i] = Math.abs(currentNum - d.properties.refugeesValue)/500;
	    			  	if(duration[i]<200){
	    			  		duration[i] = 200;
	    			  	}
	    			  	return duration[i];
	    				
	    			})
	    			  .ease("exp")
	    			  .tween("text", function(d){
		    			  	for(var i=0;i<countryList2.length;i++){
		    			  		if(d.properties.name == countryList2[i]){
				    			  	var currentNum = +this.textContent;
				    			  	var j = d3.interpolateRound(currentNum, d.properties.refugeesValue);

				    			    return function(t){
				    			    	this.textContent = j(t);
				    			    };
				    			}
	    					}
	    			  });


	    	map_path.data(map_json.features)
	    			.transition()
	    			.delay(function(d,i){
	    				return i*30;
	    			})
	    			.duration(function(d,i){
	    				return duration[i];
	    			})
	    			.ease("exp")
	    			.style("fill", function(d){
					var value = d.properties.refugeesValue;
						value = +value;
						if(d.properties.name == "Syria"){
							return c3;
						}
						if(value){
							return color(value);
						}
						else{
							return c1;
						}
					});


	    	map_label.data(map_json.features)
					.transition()
					.delay(function(d,i){
	    				return i*30;
	    			})
					.duration(function(d,i){
	    				return duration[i];
	    			})
					.ease("exp")
					.style("fill",function(d,i){
						if(d.properties.name!="Syria"){
								 var value = d.properties.refugeesValue;
								 
								 if(value!=0){
								 	 var rgb =  d3.rgb(color(value));
								 }
								 else{
								 	rgb = d3.rgb(c1);
								 }

			                    rgb.r +=alpha;
			                    rgb.g +=alpha;
			                    rgb.b +=alpha;

			                    return rgb;
			                	}else{
			                		return "#eeeeee";
			                	}

					});

	    	


	     popData2 = data2.filter(function(d) {return d.year == year});
	     var sum = popData2[0].value + popData2[1].value;//각 연도 대륙별 합계


          //arc_svg = arc_svg.data(pie(popData2));

          pie_arc.selectAll("path").data(pie(popData2)).attr("d",arc).transition().duration(1000).ease("bounce").attrTween("d",arcTween);


          
         // arc_svg.select("path").attr("d",arc).transition().delay(250).duration(1000).attrTween("d",arcTween);

          pie_text.selectAll("text").transition()
          							.duration(100)
          							.style("opacity",0);


          pie_text.selectAll("text").data(pie(popData2)).transition()
          						.delay(500)
                                .attr("transform", function(d){
                                        return "translate(" + arc.centroid(d) + ")";
                                })
                                .attr("text-anchor", "middle")
                                .text(function(d){
                                        return d3.format("%")(d.value/sum);
                                })
                                .transition()
          						.duration(50)
          						.style("opacity",1);
	     					});





function arcTween(a) {
          var delay=250;
          var duration=200;

          var i = d3.interpolate(this._current, a);
          
          this._current = i(0);

            return function(t) {
              return arc(i(t));
     };
}