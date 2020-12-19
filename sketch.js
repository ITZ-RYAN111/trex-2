//Declaring game states.
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Declaring background image.
var backgroundImage;

//Declaring trex and its animations.
var trex, trex_running, trex_collided;

//Declaring ground, its animation and invisible ground.
var ground, invisibleGround, groundImage;


//Declaring obstacles group and the images of the obstacles.
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//Declaring score.
var score;

//Declaring game over image and restart image.
var gameOverImg,restartImg

//Declaring variables for sound.
var jumpSound , checkPointSound, dieSound

function preload(){
  //Loading animations and images.
  backgroundImage = loadImage("background.jpg");

  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  //Loading sounds.
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  //Create canvas.
  createCanvas(displayWidth - 20, displayHeight - 145);
  
  ///Create trex.
  trex = createSprite(50,displayHeight-185,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  //Making the trex small.
  trex.scale = 0.5;
  
  //Create ground and add its image.
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //Create game over and add its image.
  gameOver = createSprite(width/2, height/2);
  gameOver.addImage(gameOverImg);
  
  //Creating restart and adding its image.
  restart = createSprite(width/2,height/2 + 50);
  restart.addImage(restartImg);
  
  //Making game over and restart small.
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  //Creating invisible ground.
  invisibleGround = createSprite(width/2,height - 10,width,10);
  invisibleGround.visible = false;
  
  //create Obstacles Group
  obstaclesGroup = createGroup();

  //Setting a small collider for trex.
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  
  //Initializing the score
  score = 0;
  
}

function draw() {
  
  //Hiding multiple sprites.
  background(backgroundImage);
  //displaying score
  fill("white");
  text("Score: "+ score, displayWidth - 200,50);
  
  
  if(gameState === PLAY){

    //Hiding restart and game over.
    gameOver.visible = false;
    restart.visible = false;
    
    //Move the ground and make it adapt to the score.
    ground.velocityX = -(6 + score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //Play checkpoint sound on every 100 points.
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    //Resetting the ground.
    if (ground.x < 300){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= height - 50 || touches.length > 0) {
        trex.velocityY = -12;
        jumpSound.play();
        touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    //Check for collision and play die sound.
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
    //Making game over and restart visible.
    gameOver.visible = true;
    restart.visible = true;
     
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    
    //Preventing the ground and trex to move.
    ground.velocityX = 0;
    trex.velocityY = 0
     
    //set lifetime of the obstacles so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
     
     //Stopping the and obstacles.
     obstaclesGroup.setVelocityXEach(0);
     
     //Reset the game if restart is pressed.
     if(mousePressedOver(restart) || touches.length > 0) {
      reset();
      touches = [];
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);

  //Drawing the sprites.
  drawSprites();
}

function reset(){
     
  //Restarting the game.
  gameState = PLAY;
  
  //Resetting the score.
  score = 0;
  
  //Making the trex run.
  trex.changeAnimation("running", trex_running);
  
  //Destroy the remaining obstacles.
  obstaclesGroup.destroyEach();

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(displayWidth - 20, displayHeight - 185,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
  //assign scale and lifetime to the obstacle           
  obstacle.scale = 0.5;
  obstacle.lifetime = 300;
   
  //add each obstacle to the group
  obstaclesGroup.add(obstacle);
 }
}