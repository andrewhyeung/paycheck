

// DOM MANIPULATING FUNCTIONS
function hourly(){
    document.getElementById('rate').placeholder='Hourly Rate';
    document.getElementById('hoursWorked').className = 'normalInput visible';
}
function salary(){
    document.getElementById('rate').placeholder='Yearly Salary';
    document.getElementById('hoursWorked').className = 'normalInput hidden';
}

//FEDERAL INCOME TAX CALCULATIONS
function federalWitholding(bracket, witholdings,weeklyPay, allowances){
    const percentage = [0,.10,.15,.25,.28,.33,.35,.396];
    const subjectedWitholding = weeklyPay - (allowances*77.90)
    let x = 0; 
    while(subjectedWitholding > bracket[x]){
        if(subjectedWitholding < bracket[x+1]){
            return ((subjectedWitholding - bracket[x]) * percentage[x]) + witholdings[x]; 
        }
        else if(subjectedWitholding > bracket[bracket.length-1]){
            return ((subjectedWitholding - bracket[bracket.length-1]) * percentage[percentage.length-1]) + witholdings[bracket.length-1];
        }
        x++
    }
}
function californiaWitholding(bracket, addOn, weeklyPay, allowances, maritalStatus){
    const percentage = [0.011, 0.022, 0.044, 0.066, 0.088, 0.1023, 0.1133, 0.1243, 0.1353, 0.1463];
    const exemptionBracket = [0,2.35,4.70,7.04,9.3,11.74,14.09,16.44,18.78,21.13,23.48];
    //LOW INCOME EXCEPTION
    if((weeklyPay < 263 && maritalStatus === 'single') || (maritalStatus === 'married' && weeklyPay < 263)){
        return 0; 
    }
    else if(maritalStatus === 'married' && allowances >= 2 && weeklyPay < 526){
        return 0; 
    }
    // STANDARD DEDUCTION
    if((maritalStatus === 'married' && allowances <= 1) || (maritalStatus === "single")){
        weeklyPay -= 79; 
    }
    else if(maritalStatus === 'married' && allowances >= 2){
        weeklyPay -= 159;
    }
    let x = 0;
    while(weeklyPay > bracket[x]){
        if(weeklyPay < bracket[x+1]){
            let test = (((weeklyPay - bracket[x]) * percentage[x]) + addOn[x] - exemptionBracket[allowances])
            if(allowances === ''){
                return ((((weeklyPay - bracket[x]) * percentage[x]) + addOn[x])-exemptionBracket[0]);
            }
            else{
                return test;
            }
            
        }
        else if(weeklyPay > bracket[bracket.length-1]){
            console.log('weeklyPay is greater than the tax Bracket '); 
            return 100000;
        }
        x++;
    }
}
// EVENT LISTENER FOR FORM SUBMISSION
document.getElementById('form1').addEventListener('submit', function(e){
    document.getElementsByClassName('loader')[0].style.display = "block"    
    //REMOVE ELEMENTS FROM THE DOM
    d3.select(".svg-container").remove();
    document.getElementsByClassName('table')[0].className = "table quickHide"  
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

    switch(payType){
        case 'hourly': 
            overtimePay = overtimeRate * overtimeHoursWorked;  
            regularPay = payRate*hoursWorked;
            if(typeof tips !== NaN){
                totalPay = regularPay + overtimePay;    
            }
            else{
                totalPay = regularPay + overtimePay + parseInt(tips);
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
            if(typeof tips !== NaN){
                totalPay = regularPay + overtimePay;    
            }
            else{
                totalPay = regularPay + overtimePay + parseInt(tips);
            }
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
    
    const caSingleTaxBracket = [0,154,365,577,801,1012,5168,6202,10337,19231]; 
    const caSingleAddOn = [0,1.69, 6.33,15.66,30.44,49.01,474.17,591.32,1105.30,2308.66];
    const caMarriedTaxBracket = [0,308,730,1154,1602,2024,10336,12404,19231,20673]; 
    const caMarriedAddOn = [0,3.39,12.67,31.33,60.90,98.04,948.36,1182.66,2031.26,2226.36];
    

    let fedWitheld;
    switch(maritalStatus){
        case 'single':
            fedWitheld = federalWitholding(singleTaxBracket, singleWitholdings, weeklyPay, allowances)
            calWitheld = californiaWitholding(caSingleTaxBracket, caSingleAddOn, weeklyPay, allowances, maritalStatus); 
            break;
        case 'married': 
            fedWitheld = federalWitholding(marriedTaxBracket,marriedWitholdings, weeklyPay, allowances)
            calWitheld = californiaWitholding(caMarriedTaxBracket, caMarriedAddOn, weeklyPay, allowances, maritalStatus); 
            break; 
        default: 
            console.log('marital status is not caught');
            break;
    } 
    const takeHome = totalPay - fedWitheld - calWitheld - socialSecurityTax - medicareTax; 

    document.getElementById('federalIncomeTax').innerHTML = "$"+fedWitheld.toFixed(2)
    document.getElementById('californiaIncomeTax').innerHTML = "$"+calWitheld.toFixed(2)
    document.getElementById('takeHome').innerHTML = "$"+takeHome.toFixed(2); 

    document.getElementsByClassName('loader')[0].className = "loader visible"  
    setTimeout(function(){
        document.getElementsByClassName('loader')[0].style.display = "none"    
        document.getElementsByClassName('table')[0].className = "table visible"    
        //D3 chart 
        const data = [
            {"label":"Take Home Pay", "value": takeHome}, 
            {"label":"Federal Witholdings", "value": fedWitheld}, 
            {"label": "California Witholdings", "value": calWitheld},
            {"label":"Social Security Tax", "value": totalPay * .062}, 
            {"label":"Medicare Tax", "value": totalPay * .0145}, 
            
        ]
        var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);
        var width = 300,
        height = 300,
        radius = Math.min(width, height) / 2;

        var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 70);

        var pie = d3.pie()
            .sort(null)
            .value(function (d) {
            return d.value;
        });
        var svg = d3.select(".results").insert("svg",":first-child")
            .classed("svg-container visible", true)
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



