var database;
var canvas;
var drawing = [];
var currentPath = [];
var saveButton;
var isDrawing = false;

function setup(){
    canvas = createCanvas(400,400);
    canvas.parent("canvascontainer");

     var params = getURLParams();
     console.log(params);
     if(params.id){
         showDrawing(params.id);
     }

    canvas.mousePressed(startPath);
    canvas.mouseReleased(endPath);
 
    saveButton = select("#saveButton");
    saveButton.mousePressed(saveDrawing);

    clearButton = select("#clearButton");
    clearButton.mousePressed(clearDrawing);

    var firebaseConfig = {
        apiKey: "AIzaSyD-t4OVjVhnoCP0lQYj6Co4whqPCgeZNHo",
        authDomain: "let-s-start-drawing.firebaseapp.com",
        databaseURL: "https://let-s-start-drawing.firebaseio.com",
        projectId: "let-s-start-drawing",
        storageBucket: "let-s-start-drawing.appspot.com",
        messagingSenderId: "803002274299",
        appId: "1:803002274299:web:25365f8d3f977a3bc8bb5e"
      };
      firebase.initializeApp(firebaseConfig);
      console.log(firebase);
    
      database = firebase.database();

     var ref = database.ref('drawings');
     ref.on('value', gotData, errData);
}

function startPath(){
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
}

function endPath(){
     isDrawing = false;
}

function draw(){
   background(0);

   if(isDrawing){
        var point = {
            x: mouseX,
            y: mouseY
        };
        currentPath.push(point);
   }

    stroke(255);
    strokeWeight(4);
    noFill();
   for(var i = 0; i < drawing.length; i++){
        var path = drawing[i];
        beginShape();
        for(var j = 0; j < path.length; j++){
            vertex(path[j].x,path[j].y);
        }
        endShape();
   }
}

function saveDrawing(){
    var ref = database.ref('drawings');
    var data = {
        name: "Aayush",
        drawing: drawing
    }
    var result = ref.push(data, dataSent);
     console.log(result.key);
}

function dataSent(err,status){
   console.log(status);
}

function gotData(data){

    var elts = selectAll('.listing');
    for(var i = 0; i < elts.length; i++){
        elts[i].remove();
    }
    var drawings = data.val();
    var keys = Object.keys(drawings);
    for(var i = 0; i < keys.length; i++){
        var key = keys[i];

        var li = createElement('li', '');
        li.class('listing');
        var ahref = createA("#", key);
        ahref.mousePressed(showDrawing);
        ahref.parent(li);
        // var perma = createA('?id=' + key, "permalink");
        // perma.parent(li);
        // perma.style('padding', '4px');
        li.parent('drawingList');
    }
}

function errData(err){
   console.log(err);
}

function showDrawing(key){
    //console.log(arguments);
    if(!key){
    key = this.html();
}

   var ref = database.ref('drawings/' + key);
   ref.once('value', oneDrawing, errData);
}

function oneDrawing(data){
   var dbdrawing = data.val();
   drawing = dbdrawing.drawing;
}

function clearDrawing(){
    drawing = [];
}