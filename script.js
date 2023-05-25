window.addEventListener('DOMContentLoaded', (event) => {
    window.focus();
    let snakePostioons;
    let applePosition;
    let startTimeStamp;
    let lastTimeStamp;
    let stepsTaken;
    let score;
    let contrast;
    let inputs;
    let gameStarted=false;
    let hardMode=false;
    //Configurations
    const width=15;
    const height=15;
    const speed=200;
    let fadeSpeed=5000;
    let constrastIncrease=0.5;
    const color='white';
    //setup buid up the grid
    const grid=document.querySelector('.grid');
    for (let i=0;i<width*height;i++){
        const content=document.createElement('div');
        const tile=document.createElement('div');
        content.setAttribute('class','content');
        content.setAttribute('id',i);
        tile.setAttribute('class','tile');
        tile.appendChild(content);
        grid.appendChild(tile);
    }
    const tiles=document.querySelectorAll('.grid .tile .content');
    const container=document.querySelector('.container');
    const noteElement=document.querySelector('footer');
    const constrastElement=document.querySelector('.constrast');
    const scoreElement=document.querySelector('.score');
    //initialize layout
    resetGame();
    //Reset game
    function resetGame(){
        //reset position
        snakePostioons=P[168, 169,170,171];
        applePosition=100;
        //reset the game progress
        startTimeStamp=undefined;
        stepsTaken=-1;
        score=0;
        contrast=1;
        //reset inputs
        inputs=[];
        //reset header
        constrastElement.innerText=`
            ${Math.floor(contrast*100)}%
        `;
        scoreElement.innerText= hardMode?`
            Hard Score: ${score}
        `:`
            Score: ${score}
        `;
        //reset tiles
        for (const tile of tiles){
            // render the apple
            setTile(tiles[applePosition],{
                'background-color':color,
                'border-radius':'50%'
            });
            //render the snake
            for(const i of snakePostioons.slice(1)){
                const 
            }
        }
    }
})