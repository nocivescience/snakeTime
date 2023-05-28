window.addEventListener('load', function(e) {
    window.focus();
    let snakePositions;
    let applePosition;
    let startTimeStamp;
    let lastTimeStamp;
    let stepsTaken;
    let score;
    let contrast;
    let inputs;
    let gameStarted=false;
    let hardMode=false;
    const width = 15;
    const height = 15;
    const speed = 200;
    let fadeSpeed=5000;
    let constrastIncrease=.5;
    const color='red';
    const grid=document.querySelector('.grid');
    for(let i=0;i<width*height;i++){
        const content=document.createElement('div');
        const tile=document.createElement('div');
        content.setAttribute('class','content');
        tile.setAttribute('class','tile');
        content.setAttribute('id',i);
        tile.appendChild(content);
        grid.appendChild(tile);
    }
    const tiles=document.querySelectorAll('.grid .tile .content');
    const container=document.querySelector('.container');
    const noteElement=document.querySelector('footer');
    const contrastElement=document.querySelector('.contrast');
    const scoreElement=document.querySelector('.score');
    resetGame();
    function resetGame(){
        snakePositions=[168, 169, 170, 171];
        applePosition=100;
        startTimeStamp=undefined;
        stepsTaken=-1;
        score=0;
        contrast=1;
        inputs=[];
        contrastElement.innerText=`
            ${Math.floor(contrast*100)}%
        `;
        scoreElement.innerText=hardMode?`
            Hard Score: ${score}
        `:`
            Score: ${score}
        `;
        for(const tile of tiles){
            setTile(tile);
        }
        setTile(tiles[applePosition],{
            'background-color': color,
            'border-radius': '50%',
        })
        for (const i of snakePositions.slice(1)){
            const snakePart=tiles[i];
            snakePart.style.backgroundColor=color;
            if(i===snakePositions[snakePositions.length-1]){
                snakePart.style.borderRadius='50%';
            }
            if(i===snakePositions[0]){
                snakePart.style.right=0;
            }
        }
    };
    window.addEventListener('keydown',function(e){
        if(
            ![
                'ArrowUp',
                'ArrowDown',
                'ArrowLeft',
                'ArrowRight',
                ' ',
                'H',
                'h',
                'E',
                'e',
            ].includes(e.key)
        ){
            return 
        }
        e.preventDefault();
        if(e.key==' '){
            resetGame();
            startGame();
            return;
        }
        if(e.key=='h'||e.key=='H'){
            hardMode=true;
            fadeSpeed=4000;
            fadeExponential=1.025;
            noteElement.innerHTML=`
                Hard mode. Press Spance to start!
            `;
            noteElement.style.opacity=1;
            resetGame();
            return;
        }
        if(e.key=='e'||e.key=='E'){
            hardMode=false;
            fadeSpeed=5000;
            fadeExponential=1.024;
            noteElement.innerHTML=`
                Easy mode. Press Spance to start!
            `;
            noteElement.style.opacity=1;
            resetGame();
            return;
        }
        if(e.key=='ArrowLeft'&&inputs[inputs.length-1]!='right'&&headDirection()!='right'){
            inputs.push('left');
            if(!gameStarted){
                startGame();
            }
            return;
        }
        if(e.key=='ArrowRight'&&inputs[inputs.length-1]!='left'&&headDirection()!='left'){
            inputs.push('right');
            if(!gameStarted){
                startGame();
            }
            return;
        }
        if(e.key=='ArrowUp'&&inputs[inputs.length-1]!='down'&&headDirection()!='down'){
            inputs.push('up');
            if(!gameStarted){
                startGame();
            }
            return;
        }
        if(e.key=='ArrowDown'&&inputs[inputs.length-1]!='up'&&headDirection()!='up'){
            inputs.push('down');
            if(!gameStarted){
                startGame();
            }
            return;
        }
    });
    function main(){
        try{
            if(startTimeStamp===undefined){
                startTimeStamp=lastTimeStamp;
            }
            const totalElapsedTime=lastTimeStamp-startTimeStamp;
            const timeElapsedSinceLastCall=lastTimeStamp-startTimeStamp;
            const stepShouldHaveTaken=Math.floor(totalElapsedTime/speed);
            const percentageOfStep=(totalElapsedTime%speed)/speed;
            if(stepsTaken!=stepShouldHaveTaken){
                stepAndTransition(percentageOfStep);
            }
            window.requestAnimationFrame(main);
        }catch(e){
            console.log(e);
        }
    }
    function stepAndTransition(percentageOfStep){
        const newHeadPosition=getNextPosition();
        console.log(`Snake stteping into tile: ${newHeadPosition}`);
        snakePositions.push(newHeadPosition);
        console.log(`Snake is now in tile: ${newHeadPosition}`);
    };
    function getNextPosition(){
        //hay que completar despues del if
        const headPosition=snakePositions[snakePositions.length-1];
        const snakeDirection=inputs.shift()||headDirection();
        switch(snakeDirection){
            case 'right':{
                const nextPosition=headPosition+1;
                if(nextPosition%width===0){
                    throw Error('The snake the wall!');
                }
                return nextPosition;
            }
            case 'left':{
                const nextPosition=headPosition-1;
                if(nextPosition%width===width-1){
                    throw Error('The snake the wall!');
                }
                return nextPosition;
            }
            case 'up':{
                const nextPosition=headPosition-width;
                if(nextPosition<0){
                    throw Error('The snake hit the wall')
                }
                return nextPosition
            };
        };
    };
    function startGame(){
        gameStarted=true;
        noteElement.style.opacity=0;
        window.requestAnimationFrame(main);
    }
    function setTile(element,overrides={}){
        const defaults={
            width: "100%",
            height: "100%",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            'background-color': "transparent",
        };
        const cssProperties={...defaults,...overrides};
        element.style.cssText=Object.entries(cssProperties).map(([key,value])=>`${key}: ${value};`).join(' ');
    }
    function headDirection(){
        const head=snakePositions[snakePositions.length-1];
        const neck=snakePositions[snakePositions.length-2];
        return getDirection(neck,head);
    };
    function tailDirection(){
        const tail1=snakePositions[0];
        const tail2=snakePositions[1];
        return getDirection(tail1,tail2);
    };
    function getDirection(first,second){
        if(first-1==second){
            return 'right';
        }
        if(first+1==second){
            return 'left';
        }
        if(first+width==second){
            return 'down';
        }
        if(first-width==second){
            return 'up';
        }
    }
}); // DOMContentLoaded