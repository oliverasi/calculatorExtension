let calculation = [];
let current_number = null;
let decimals = 0;
const DECIMAL_PRECISION = 6;
const PI = 3.14159265;

//Allow mouse input when clicking the HTML buttons.
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('zero').onclick = function() {updateNumber(0);};
    document.getElementById('one').onclick = function() {updateNumber(1);};
    document.getElementById('two').onclick = function() {updateNumber(2);};
    document.getElementById('three').onclick = function() {updateNumber(3);};
    document.getElementById('four').onclick = function() {updateNumber(4);};
    document.getElementById('five').onclick = function() {updateNumber(5);};
    document.getElementById('six').onclick = function() {updateNumber(6);};
    document.getElementById('seven').onclick = function() {updateNumber(7);};
    document.getElementById('eight').onclick = function() {updateNumber(8);};
    document.getElementById('nine').onclick = function() {updateNumber(9);};

    document.getElementById('add').onclick = function() {addOperator("+");};
    document.getElementById('substract').onclick = function() {addOperator("-");};
    document.getElementById('multiply').onclick = function() {addOperator("x");};
    document.getElementById('divide').onclick = function() {addOperator("÷");};
    document.getElementById('raise').onclick = function() {addOperator("^");};
    document.getElementById('root').onclick = function() {addOperator("√");};

    document.getElementById('clear').onclick = function() {clearCalc();};
    document.getElementById('PI').onclick = function() {addPI();};
    document.getElementById('decimal').onclick = function() {updateNumber(".");};
    document.getElementById('equals').onclick = function() {calculate();};
});

//Allow keyboard input.
document.onkeydown = function(e) {
    if (e.key == "Backspace") {
        clearCalc();
    } else if (e.key == "=" || e.key == "Enter") {
        calculate();
    } else if (e.key == "+" || e.key == "-" || e.key == "x" || e.key == "÷" || e.key == "^" || e.key == "√") {
        addOperator(e.key);
    } else if (e.key == "*") {
        addOperator("x");
    } else if (e.key == "/") {
        addOperator("÷");
    } else if (!isNaN(e.key)) {
        updateNumber(Number(e.key));
    }
}

//Change the current number value given the user input.
function updateNumber(value) {
    //Multiply if two different numbers are consecutive to each other.
    if (current_number == null && !isNaN(calculation[calculation.length - 1]) && calculation[calculation.length - 2] != "√") {
        calculation.push("x");
    }

    if (value == '.' && decimals == 0) {
        decimals++;
    } else if (decimals == 0) {
        current_number = current_number * 10 + value;
    } else if (decimals > 0 && value != '.') {
        value = value*10**-decimals;
        current_number += value;
        current_number = Math.round(current_number * Math.pow(10, decimals)) / Math.pow(10, decimals);
        decimals++;
    }
    reloadTemp();
}

//Add the operator to calculation[] and the current number.
function addOperator(operator) {
    //Don't allow first input to be an operator except "-".
    if (calculation.length == 0 && current_number == null && operator != "-") return;
    //Don't allow "--".
    if (operator == "-" && calculation[calculation.length - 1] == "-") return;
    //If the user types two consecutive operators, the last typed rules.
    if (isNaN(calculation[calculation.length - 1]) && current_number == null && operator != "-") {
        calculation.pop();
        calculation.push(operator);
        return;
    }
    
    //For the sake of clarity, 2√9 will appear in calculation[] as [2, "√", 9] (inverse order as it should be typed).
    if (operator == "√") {
        if (current_number != null) {
            calculation.push(operator);
            clearCurrentNumber();
        } else {
            calculation.splice(calculation.length - 1, 0, "√");
            decimals = 0;
        }
    } else if (operator == "-" && calculation[calculation.length - 2] == "√") {
        calculation.splice(calculation.length - 2, 0, operator);
    } else {
        clearCurrentNumber();
        calculation.push(operator);
    }
    reloadTemp();
}

//Add PI to the calculation[].
function addPI() {
    clearCurrentNumber();
    if (calculation[calculation.length - 2] == "√") {
        calculation.splice(calculation.length - 2, 0, PI);
    } else {
        if (!isNaN(calculation[calculation.length - 1])) {
            calculation.push("x");
        }
        calculation.push(PI);
    }
    reloadTemp();
}

//Calculates the result of calculation[] and saves the result on calculation[0].
function calculate() {
    clearCurrentNumber();
    calculation.push("=");
    reloadTemp();
    calculation.pop();

    //If the user typed nothing, return.
    if (calculation.length == 0) {
        reloadDisplay();
        return;
    }

    //Convert ["-", 5] in [-5].
    for (i = 0; i < calculation.length; i++) {
        if (calculation[i] == '-' && typeof(calculation[i - 1]) != "number") {
            calculation[i + 1] *= -1;
            calculation.splice(i, 1);
        }
    }
    if (checkIfOver()) return;

    for (i = 0; i < calculation.length; i++) {
        if (calculation[i] == '^') {
            calculation[i] = Math.pow(calculation[i - 1], calculation[i + 1]);
            spliceCalculation(i);
            i--;
        } else if (calculation[i] == '√') {
            calculation[i] = Math.pow(calculation[i + 1], 1/calculation[i - 1]);
            spliceCalculation(i);
            i--;
        }
    }
    if (checkIfOver()) return;

    for (i = 0; i < calculation.length; i++) {
        if (calculation[i] == 'x') {
            calculation[i] = calculation[i - 1] * calculation[i + 1];
            spliceCalculation(i);
            i--;
        } else if (calculation[i] == '÷') {
            calculation[i] = calculation[i - 1] / calculation[i + 1];
            spliceCalculation(i);
            i--;
        }
    }
    if (checkIfOver()) return;

    for (i = 0; i < calculation.length; i++) {
        if (calculation[i] == '+') {
            calculation[i] = calculation[i - 1] + calculation[i + 1];
            spliceCalculation(i);
            i--;
        } else if (calculation[i] == '-') {
            calculation[i] = calculation[i - 1] - calculation[i + 1];
            spliceCalculation(i);
            i--;
        }
    }
    reloadDisplay();
}

//Splice the calculation[] when two numbers are calculated.
function spliceCalculation(i) {
    calculation.splice(i - 1, 1);
    calculation.splice(i, 1);
}

//Check if the calculation is over to improve performance.
function checkIfOver() {
    if (calculation.length == 1) {
        reloadDisplay();
        return true;
    }
}

//Add the current number the user typed to calculation[] and set the variables to default.
function clearCurrentNumber() {
    if (current_number != null && calculation[calculation.length - 2] == "√") {
        calculation.splice(calculation.length - 2, 0, current_number);
    } else if (current_number != null) {
        calculation.push(current_number);
    }
    current_number = null;
    decimals = 0;
}

//Set all the variables and HTML elements to their default state.
function clearCalc() {
    calculation = [];
    current_number = null;
    decimals = 0;
    reloadTemp();
    document.getElementById("display").innerHTML = "";
}

//Changes the HTML temp to be the temporary state of the calculation[].
function reloadTemp() { 
    if (current_number != null && calculation[calculation.length - 2] == "√") {
        let temp = [].concat(calculation);
        temp.splice(calculation.length - 2, 0, current_number);
        let result = temp.join(" ");
        document.getElementById("temp").innerHTML = result;
    } else {
        let result = calculation.join(" ");
        if (current_number != null) {
            result += " " + current_number;
        }
        document.getElementById("temp").innerHTML = result;
    }
}

//Changes the HTML display to be the result of the calculation.
function reloadDisplay() {
    if (isNaN(calculation[0]) || calculation.length > 1) {
        document.getElementById("display").innerHTML = "Error";
        document.getElementById("display").style.setProperty("font-size", `30px`);
    } else {
        let result = Math.round(calculation[0] * Math.pow(10, DECIMAL_PRECISION)) / Math.pow(10, DECIMAL_PRECISION);
        calculation[0] = result;
        //Changes the CSS font-size property of the display based on the length of the result.
        let size = result.toString().length;
        if (size >= 12) {
            size = 51 - 2 * size;
            if (size < 14) {
                size = 14;
            }
            size += "px";
        } else {
            size = "30px";
        }
        document.getElementById("display").innerHTML = result;
        document.getElementById("display").style.setProperty("font-size", size);
    }
}