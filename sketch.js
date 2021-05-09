var PLAY = 1;
var END = 0;
var gameState = PLAY;
var WIN = 0;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var trex, trex_running, trex_collided;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var cloudsGroup, cloudImage;

var ground, invisibleGround, groundImage;

function preload(){
  trex_running = loadImage("trex1.png");
  trex_collided = loadImage("trex_collide.png");
  backgroundImg=loadImage("background.png")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("cactus.jpg");
  obstacle2 = loadImage("cactus.jpg");
  obstacle3 = loadImage("cactus.jpg");
  obstacle4 = loadImage("cactus.jpg");
  obstacle5 = loadImage("cactus.jpg");
  obstacle6 = loadImage("cactus.jpg");
  
  restartImg = loadImage("download.jpg")
  gameOverImg = loadImage("download.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addImage("running", trex_running);
  trex.addImage("collided", trex_collided);
  trex.scale = 0.3;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100,1,1);
  gameOver.addImage(gameOverImg);
      
    
  restart = createSprite(300,140,1,1);        
  restart.addImage(restartImg);

  gameOver.scale = 1;
  restart.scale = 0.2; 
  
  invisibleGround = createSprite(200,200,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,20,200,160);
  trex.debug = false;
  
  score = 0;
  
}

function draw() {
 
  background(backgroundImg);
  textFont("Agency FB")
  fill("black")
  textSize(20)
  text("Score: "+ score, 260,50);
  text("Target=Score:500",400,50)
  

  if(gameState === PLAY){

    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -15;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    spawnObstacles();
    gameOver.visible=false;
    restart.visible=false;

    if(obstaclesGroup.isTouching(trex)){
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === Win) {
    gameOver.visible=true;
    restart.visible=true;
    
      trex.addImage("collided", trex_collided);  
  if(mousePressedOver(restart)) {
      reset();
    }
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  


  drawSprites();
}

function reset(){
score=0  
trex.addImage("running", trex_running)
gameOver.visible=false;  
restart.visible=false;  
obstaclesGroup.destroyEach(); 
cloudsGroup.destroyEach();  
gameState=PLAY;  
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
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
    obstacle.scale = 0.13;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
    cloud.lifetime = 200;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}

