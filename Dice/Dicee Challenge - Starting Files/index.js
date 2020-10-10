
var ran1=Math.floor(Math.random()*6)+1;
var ran2=Math.floor(Math.random()*6)+1;

if(ran1===1)
{
  document.querySelector(".img1").setAttribute("src","images/dice1.png");
}

else if(ran1===2)
{
  document.querySelector(".img1").setAttribute("src","images/dice2.png");
}

else if(ran1===3)
{
  document.querySelector(".img1").setAttribute("src","images/dice3.png");
}

else if(ran1===4)
{
  document.querySelector(".img1").setAttribute("src","images/dice4.png");
}

else if(ran1===5)
{
  document.querySelector(".img1").setAttribute("src","images/dice5.png");
}

else if(ran1===6)
{
  document.querySelector(".img1").setAttribute("src","images/dice6.png");
}

if(ran2===1)
{
  document.querySelector(".img2").setAttribute("src","images/dice1.png");
}

else if(ran2===2)
{
  document.querySelector(".img2").setAttribute("src","images/dice2.png");
}

else if(ran2===3)
{
  document.querySelector(".img2").setAttribute("src","images/dice3.png");
}

else if(ran2===4)
{
  document.querySelector(".img2").setAttribute("src","images/dice4.png");
}

else if(ran2===5)
{
  document.querySelector(".img2").setAttribute("src","images/dice5.png");
}

else if(ran2===6)
{
  document.querySelector(".img2").setAttribute("src","images/dice6.png");
}
if(ran1>ran2)
{
  document.querySelector("h1").innerHTML="Player 1 Wins!🚩";
}
else if(ran1<ran2)
{
  document.querySelector("h1").innerHTML="Player 2 Wins!🚩";
}
else if(ran1===ran2)
{
  document.querySelector("h1").innerHTML="Draw!";
}
