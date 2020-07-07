const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// load images

let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeTop = new Image();
let pipeBottom = new Image();

bird.src = "images/yellowbird-midflap.png";
fg.src = "images/base.png";
pipeTop.src = "images/pipe-green-top.png";
pipeBottom.src = "images/pipe-green-bottom.png";
bg.src = "images/background-day.png";

const flap = new Audio();
const scoreIncrement = new Audio();
const die = new Audio();
const hit = new Audio();

flap.src = "sounds/wing.wav";
scoreIncrement.src = "sounds/point.wav";
die.src = "sounds/die.wav";
hit.src = "sounds/hit.wav";

bg.onload = function() {

// some variables

    const gap = 80;
    const constant = pipeTop.height + gap;

    let birdX = 10;
    let birdY = 150;
    let score = 0;  
    let dead = false;
    let gravity = dead ? 4 : 1.5;

    // on key down

    document.addEventListener("keydown", moveUp);

    function moveUp(){
        if(!dead) {
            birdY -= 25;
            flap.play();
        }
    }

    // pipe coordinates

    let pipe = [];
    pipe[0] = {
        x : cvs.width,
        y : -100
    }

    // draw images

    function draw() {
        ctx.drawImage(bg, 0, 0);

        for(let i = 0; i < pipe.length; i++) {
            ctx.drawImage(pipeTop, pipe[i].x, pipe[i].y);
            ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + constant);

            if (!dead) {
                pipe[i].x--;
            }

            pipe[i].x === 125 && pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*(pipeTop.height-100))-
                pipeTop.height+100
            });

            // Detect Collision
            if
            (
                ((birdX + bird.width - 5 >= pipe[i].x && birdX <= pipe[i].x + pipeTop.width)
                && 
                (birdY <= pipe[i].y + pipeTop.height || birdY+bird.height >= pipe[i].y+constant))
                || 
                (birdY+bird.height >= cvs.height - fg.height)
            ) 
            {
                if (!dead && (birdY+bird.height < cvs.height - fg.height)) {
                    birdX-=5;
                    hit.play();
                    die.play();
                }
                dead = true;
                setTimeout(function(){ location.reload(); }, 1000); // reload the page after 3 secs  
            } 

            // Increment score

            if(pipe[i].x === 5) {
                score++;
                scoreIncrement.play();
            }   
        }

        ctx.drawImage(fg, 0, cvs.height-fg.height);

        ctx.drawImage(bird, birdX, birdY);
        
        if (birdY+bird.height < cvs.height - fg.height) {
            birdY += gravity;
        }

        ctx.fillStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score : " + score, 10, cvs.height - 20);

        requestAnimationFrame(draw);
    }

    try {
        console.log(pipeTop.height)
        draw();
    } catch (err) {
        console.log(err)
    }

}