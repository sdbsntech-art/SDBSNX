// JavaScript Document
function myFunction(){
	document.getElementById("demo").innerHTML = "Ma premiere page avec JS";	
}

function changeColor(){
	var x = document.getElementById("demo");
	
	x.style.color = "red";
	x.style.backgroundColor = "yellow";	
}

function changeImage(){
	var x = document.getElementById("logo");
	
	x.src = "images/img_tree.gif";

}

function changePara(){
	document.getElementsByTagName("p")[0].innerHTML = "Ma premiere page avec JS";	
}

function zoomImagePlus(){
	var x = document.getElementById("logo");
	x.width += 10;
	x.height += 10;
}

function zoomImageMoins(){
	var x = document.getElementById("logo");
	x.width = "100";
	x.height = "100";

}

function zoomImage(val){
	var x = document.getElementById("logo");
	if(val=="+"){
		x.width = "200";
		x.height = "200";
	}else{
		x.width = "100";
		x.height = "100";
	}
}


function tester(){
var lg = document.getElementById("login").value;
	mp = document.getElementById("mdp").value;
	if(lg=="")
		alert("Veuillez saisir le login");
	else
		if(mp=="")
			alert("Veuillez saisir le mdp");
		else
			alert("Login et mdp saisis");
}

function longueur(){
var lg = document.getElementById("login").value;
	mp = document.getElementById("mdp").value;
	alert("Longueur du login est "+lg.length);
	//write("Longuer du login est ",lg.length);
}










