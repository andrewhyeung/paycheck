

// DOM MANIPULATING FUNCTIONS
function hourly(){
    document.getElementById('rate').placeholder='Hourly Rate';
    document.getElementById('hoursWorked').className = 'visible';
}
function salary(){
    document.getElementById('rate').placeholder='Yearly Salary';
    document.getElementById('hoursWorked').className = 'hidden';
}

//FEDERAL INCOME TAX CALCULATIONS
function federalWitholding(bracket, witholdings,weeklyPay, allowances){
    let percentage = [0,.10,.15,.25,.28,.33,.35,.396];
    const subjectedWitholding = weeklyPay - (allowances*77.90)
    let x = 0; 
    while(subjectedWitholding > bracket[x]){
        if(subjectedWitholding < bracket[x+1]){
            return ((subjectedWitholding - bracket[x]) * percentage[x]) + witholdings[x]; 
        }
        x++
    }
}
// EVENT LISTENER FOR FORM SUBMISSION
document.getElementById('form1').addEventListener('submit', function(e){ //say this is an anchor
    // RADIO BUTTONS
    let radios = document.getElementsByName('maritalStatus');
    let maritalStatus;
    for (let i = 0; i < radios.length; i++){
        if (radios[i].checked){
            maritalStatus = radios[i].value; 
            break;
        }
    }
    let radiosPay = document.getElementsByName('payType');
    let payType;
    for (let i = 0; i < radiosPay.length; i++){
        if (radiosPay[i].checked){
            payType = radiosPay[i].value; 
            break;
        }
    }
    //FORM VALUES 
    const payRate = document.getElementById('rate').value;
    const hoursWorked = document.getElementById('hoursWorked').value; 
    const overtimeRate = document.getElementById('overtimeRate').value; 
    const overtimeHoursWorked = document.getElementById('overtimeHoursWorked').value; 
    const payFrequency = document.getElementById('payFrequency').value; 
    const allowances = document.getElementById('allowances').value; 
    let tips  = document.getElementById('tips').value; 
    if(typeof tips !== NaN){
        tips = parseInt(tips);
    }
    switch(payType){
        case 'hourly': 
            overtimePay = overtimeRate * overtimeHoursWorked;  
            regularPay = payRate*hoursWorked;
            if(typeof tips !== NaN){
                totalPay = regularPay + overtimePay;    
            }
            else{
                totalPay = regularPay + overtimePay + tips;
            }
            break; 
        case "salary": 
            overtimePay = overtimeRate * overtimeHoursWorked;
            switch(payFrequency){
                case "weekly": 
                    regularPay = payRate / 52;
                    break; 
                case "bi": 
                    regularPay = payRate /26;
                    break; 
                case "monthly": 
                    regularPay = payRate / 12; 
            }
            totalPay = regularPay + overtimePay + tips;
            break;
        default:  
            break;
    }
    const socialSecurityTax =totalPay * 0.062;
    const medicareTax = totalPay* 0.0145;
    //ADD FINAL CALCULATIONS TO DOM
    document.getElementById('totalPay').innerHTML = "$"+ totalPay.toFixed(2); 
    document.getElementById('socialSecurityTax').innerHTML = "$"+ socialSecurityTax.toFixed(2); 
    document.getElementById('medicareTax').innerHTML = "$"+medicareTax.toFixed(2); 

    let weeklyPay; 
    switch(payFrequency){
        case "weekly": 
            weeklyPay = totalPay * 1; 
            break; 
        case "bi": 
            weeklyPay = totalPay / 2;
            break; 
        case "monthly": 
            weeklyPay = (totalPay * 12)/52; 
    }


// if hourly is selected 
// weekly = totalPay times 1    biweekly = totalPay / 2     monthly = (totalpay * 12)/52
// convert to weekly pay and use the weekly pay table to calculate the federal witholding amount. 
    const singleTaxBracket = [0,43,222,767,1796,3700,7992,8025]; 
    const singleWitholdings = [0,0,17.90, 99.65,356.90, 890.02, 2306.38, 2317.93]; 
    const marriedTaxBracket = [0,164,521,1613,3086,4615,8113,9144]; 
    const marriedWitholdings = [0,0,35.70,199.50,567.75,995.87,2150.21,2511.06]; 
    let fedWitheld;
    switch(maritalStatus){
        case 'single': 
            fedWitheld = federalWitholding(singleTaxBracket, singleWitholdings, weeklyPay, allowances)
            break;
        case 'married': 
            fedWitheld = federalWitholding(marriedTaxBracket,marriedWitholdings, weeklyPay, allowances)
            break; 
        default: 
            console.log('marital status is not caught');
            break;
    } 
    const takeHome = totalPay - fedWitheld - socialSecurityTax - medicareTax; 
    document.getElementById('federalIncomeTax').innerHTML = "$"+fedWitheld.toFixed(2)
    document.getElementById('takeHome').innerHTML = "$"+takeHome.toFixed(2); 

    document.getElementsByClassName('loader')[0].className = "loader visible"    

    setTimeout(function(){
        document.getElementsByClassName('loader')[0].style.display = "none"    
        document.getElementsByClassName('table')[0].className = "table visible"    
            // //D3 chart 
        d3.select(".svg-container").remove();
        const data = [
            {"label":"Take Home Pay", "value": takeHome}, 
            {"label":"Federal Witholdings", "value": fedWitheld}, 
            {"label":"Social Security Tax", "value": totalPay * .062}, 
            {"label":"Medicare Tax", "value": totalPay * .0145}, 
        ]
        var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);
        var width = 250,
        height = 250,
        radius = Math.min(width, height) / 2;

        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 70);

        var pie = d3.pie()
            .sort(null)
            .value(function (d) {
            return d.value;
        });
        var svg = d3.select(".results").append("svg")
            .classed("svg-container", true)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
            return color(d.data.label);
        });

        // g.append("text")
        //     .attr("transform", function (d) {
        //     return "translate(" + arc.centroid(d) + ")";
        // })
        //     .attr("dy", ".35em")
        //     .style("text-anchor", "middle")
        //     .text(function (d) {
        //     return d.data.label;
        // });
    }, 1000)


    e.preventDefault();
});



