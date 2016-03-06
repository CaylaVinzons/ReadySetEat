
//Asian
var asianimages = [
    "url('img/Asian_Logo_1.png')",
    "url('img/Asian_Logo_2.png')"
];
var asiancount = 0;
function toggleasianimages() {
    document.getElementById('Asian').style.backgroundImage = asianimages[(asiancount+1) % 2];
    asiancount=(asiancount+1) % 2;
}

//Barbequeue
var bbqimages = [
    "url('img/BBQ_Logo_1.png')",
    "url('img/BBQ_Logo_2.png')"
];
var bbqcount = 0;
function togglebbqimages() {
    document.getElementById('bbq').style.backgroundImage = bbqimages[(bbqcount+1) % 2];
    bbqcount=(bbqcount+1) % 2;
}

//Breakfast and brunch
var bfastbrunchimages = [
    "url('img/Breakfast_Logo_1.png')",
    "url('img/Breakfast_Logo_2.png')"
];
var bfastbrunchcount = 0;
function togglebfastbrunchimages() {
    document.getElementById('bfastbrunch').style.backgroundImage = bfastbrunchimages[(bfastbrunchcount+1) %
         2];
    bfastbrunchcount=(bfastbrunchcount+1) % 2;
}

//Fast Food
var fastfoodimages = [
    "url('img/FastFood_Logo_1.png')",
    "url('img/FastFood_Logo_2.png')"
];
var fastfoodcount = 0;
function togglefastfoodimages() {
    document.getElementById('fastfood').style.backgroundImage = fastfoodimages[(fastfoodcount+1) %
         2];
    fastfoodcount=(fastfoodcount+1) % 2;
}

//Italian
var italianimages = [
    "url('img/Asian_Logo_1.png')",
    "url('img/Asian_Logo_2.png')"
];
var italiancount = 0;
function toggleitalianimages() {
    document.getElementById('osolemio').style.backgroundImage = italianimages[(italiancount+1) %
         2];
    italiancount=(italiancount+1) % 2;
}

//Mexican
var mexicanimages = [
    "url('img/Asian_Logo_1.png')",
    "url('img/Asian_Logo_2.png')"
];
var mexicancount = 0;
function togglemexicanimages() {
    document.getElementById('mexican').style.backgroundImage = mexicanimages[(mexicancount+1) %
         2];
    mexicanimages=(mexicancount+1) % 2;
}

//Burgers and Sandwiches
var sandwichimages = [
    "url('img/Asian_Logo_1.png')",
    "url('img/Asian_Logo_2.png')"
];
var sandwichcount = 0;
function togglesandwichimages() {
    document.getElementById('sandwich').style.backgroundImage = sandwichimages[(sandwichcount+1) %
         2];
    sandwichcount=(sandwichcount+1) % 2;
}

//Seafood
var seafoodimages = [
    "url('img/Asian_Logo_1.png')",
    "url('img/Asian_Logo_2.png')"
];
var seafoodcount = 0;
function toggleseafoodimages() {
    document.getElementById('seafood').style.backgroundImage = seafoodimages[(seafoodcount+1) %
         2];
    seafoodcount=(seafoodcount+1) % 2;
}

//Vegetarian
var vegetarianimages = [
    "url('img/Asian_Logo_1.png')",
    "url('img/Asian_Logo_2.png')"
];
var vegetariancount = 0;
function toggleseafoodimages() {
    document.getElementById('seafood').style.backgroundImage = vegetarianimages[(vegetariancount+1) %
         2];
    vegetariancount=(vegetariancount+1) % 2;
}

function getoptions() {
    var options = [];
    if (asiancount%2==0) {
        options.push("Chinese");
        options.push("Japanese");
        options.push("Korean");
        options.push("Vietnamese");
    }
    if (bbqcount%2==0) {
        options.push("Barbequeue");
    }
    if (bfastbrunchcount%2==0) {
        options.push("Breakfast & Brunch");
        options.push("Creperies");
        options.push("Cafes");
    }
    if (fastfoodcount%2==0) {
        options.push("Fast Food");
    }
    if (italiancount%2==0) {
        options.push("Italian");
    }
    if (mexicancount%2==0) {
        options.push("Mexican");
    }
    if (sandwichcount%2==0) {
        options.push("Burgers");
        options.push("Sandwiches");
        options.push("Cheesesteaks");
        options.push("Steakhouses");
    }
    if (seafoodcount%2==0) {
        options.push("Seafood");
    }
    if (vegetariancount%2==0) {
        options.push("Vegetarian");
    }
    console.log(options);
    return options;
}