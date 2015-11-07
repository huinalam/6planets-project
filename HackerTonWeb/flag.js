var normal_flag = [200,200,200];
var biased_flag = [185,117,298];
var text = ["Internal Displaced: 6.5M","Refugees Abroad:4.1M","Still Remain:10.6M"];
//var text = ["내부적 난민 : 6.5M", "해외 난민 : 4.1M", "나머지 : 10.6M"];
var flag_svg;
var posY = 0;

flag_svg = d3.select(".flag_div").append("svg")
								 .attr("width",800)
								 .attr("height",600);

flag_svg.selectAll("rect")
		.data(normal_flag)
		.enter()
		.append("rect")
		.attr("width",800)
		.attr("height",function(d){
			return d;
		})
		.attr("x",0)
		.attr("y",function(d,i){
			if(i!=0){
				posY+= normal_flag[i-1];
			} 
			return posY;
		})
		.attr("class",function(d,i){
			return "flag" + i;
		});

flag_svg.on("click",change);

function change(){
	var posY_b=0;
	var posY_t=0;
	flag_svg.selectAll("rect")
			.data(biased_flag)
			.transition()
			.duration(1000)
			.ease("elastic")
			.delay(function(d,i){
				return (2-i)*400;
			})
			.attr("height",function(d){
			return d;
		})
			.attr("y",function(d,i){
			if(i!=0){
				posY_b+= biased_flag[i-1];
			} 
			return posY_b;
		})
		.attr("class",function(d,i){
			return "flag" + i;
		});

	flag_svg.selectAll("text")
			.data(biased_flag)
			.enter()
			.append("text")
			.attr("x",10)
			.attr("y",function(d,i){
				if(i!=0){
					posY_t+= biased_flag[i-1];
				} 
			return posY_t +70;
			})
			.text(function(d,i){
				return text[i];
			})
			.attr("class",function(d,i){
				return "text" + i;
			})
			.style("opacity",0);

		flag_svg.selectAll("text")
			.transition()
			.delay(1000)
			.duration(500)
			.style("opacity",1);

	flag_svg.append("rect")
			.attr("width",0)
			.attr("height",5)
			.attr("x",0)
			.attr("y",180)
			.attr("class","kill");

	flag_svg.select(".kill")
			.transition()
			.delay(2000)
			.duration(500)
			.attr("width",800);

	flag_svg.append("text")
			.attr("x",10)
			.attr("y",165)
			.attr("class","kill")
			.attr("id","kill_text")
			.text("And..310,000 Killed")
			.style("opacity",0);

	flag_svg.select("#kill_text")
			.transition()
			.delay(3000)
			.duration(500)
			.style("opacity",1);
}