window.addEventListener('DOMContentLoaded', (e) => {
    window.focus();
    let snakePositions;
    let applePosition;
    let startTimestamp;
    let lastTimestamp; 
    let stepsTaken;
    let score;
    let contrast;
    let inputs;
    let gameStarted=false;
    let hardMode=false;
    const width = 15;
    const height = 15;
    const speed= 200;
    let fadeSpeed= 5000;
    let fadeExponential=1.024;
    const contrastIncrease=0.5;
    const color='black';
    const grid = document.querySelector('.grid');
    for (let i=0;i<width*height;i++){
        const content=document.createElement('div');
        content.setAttribute('class','content');
        content.setAttribute('id',i);
        const tile=document.createElement('div');
        tile.setAttribute('class','tile');
        tile.appendChild(content);
        grid.appendChild(tile);
    }
    const tiles=document.querySelectorAll('.grid .tile .content');
    console.log(tiles);
    const containerElement=document.querySelector('.container');
    const scoreElement=document.querySelector('.score');
    const contrastElement=document.querySelector('.contrast');
    const noteElement=document.querySelector('footer');
    function resetGame(){
        stepsTaken=-1;
        score=0;
        contrast=1;
        inputs=[]; //en reste game
        snakePositions=[168,169,170,171];
        applePosition=100;
        contrastElement.innerText=`Contrast: ${Math.floor(contrast*100)}%`;
        scoreElement.innerText=hardMode?
        `Hard Score: ${score}`:
        `Rockie Score: ${score}`;
        for(const tile of tiles){
            setTile(tile)
        }
        setTile(tiles[applePosition],{
            backgroundColor:color,
            borderRadius:'50%',
        });
        for(const i of snakePositions.slice(1)){
            const snakePart=tiles[i];
            snakePart.style.backgroundColor=color;
            if(i==snakePositions[snakePositions.length-1]){
                snakePart.style.left=0;
            }
            if(i==snakePositions[0]){
                snakePart.style.right=0;
            }
        }
    }
    resetGame();
    window.addEventListener('keydown', function(e) {
        if(![
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'e',
            'E',
            'h',
            'H',
            ' ',
        ].includes(e.key)){
            return;
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
            noteElement.innerHTML=`<p>Hard Mode, press space to start</p>`;
            noteElement.style.opacity=1;
            resetGame();
            return;
        }
        if(e.key=='e'||e.key=='E'){
            hardMode=false;
            fadeSpeed=5000;
            fadeExponential=1.024;
            noteElement.innerHTML=`<p>Easy Mode, press space to start</p>`;
            noteElement.style.opacity=1;
            resetGame();
            return;
        }
        if(e.key=='arrowLeft'&&inputs[inputs.length-1]!='left'&&headDirection()!='right'){
            inputs.push('left');
            if(!gameStarted) startGame();
            return;
        }
        if(e.key=='arrowRight'&&inputs[inputs.length-1]!='right'&&headDirection()!='left'){
            inputs.push('right');
            if(!gameStarted) startGame();
            return;
        }
        if(e.key=='arrowUp'&&inputs[inputs.length-1]!='up'&&headDirection()!='down'){
            inputs.push('up');
            if(!gameStarted) startGame();
            return;
        }
        if(e.key=='arrowDown'&&inputs[inputs.length-1]!='down'&&headDirection()!='up'){
            inputs.push('down');
            if(!gameStarted) startGame();
            return;
        }
    });
    function headDirection(){
        const head=snakePositions[snakePositions.length-1];
        const neck=snakePositions[snakePositions.length-2];
        return getDirection(neck,head);
    };
    function getDirection(first,second){
        if(first-1==second){
            return "right";
        }
        if(first+1==second){
            return "left";
        }
        if(first+width==second){
            return "up";
        }
        if(first-width==second){
            return "down";
        }
        throw new Error('ambas colitas no se han justado');
    }
    function tailDirection(){
        const tail1=snakePositions[0];
        const tail2=snakePositions[1];
        return getDirection(tail1,tail2);
    };
    function startGame(){
        gameStarted=true;
        noteElement.style.opacity=0;
        window.requestAnimationFrame(main);
    };
    function main(timestamp){
        try{
            if(startTimestamp===undefined){
                startTimestamp=timestamp
            }
            const totalElapsedTime=timestamp-startTimestamp;
            const timeElapsedSinceLastCall=timestamp-lastTimestamp;
            const stepsShouldHaveTaken=Math.floor(totalElapsedTime/speed);
            const percentageOfStep=(totalElapsedTime%speed)/speed;
            if(stepsTaken!==stepsShouldHaveTaken){
                stepAndTransition(percentageOfStep);
                const headPosition=snakePositions[snakePositions.length-1];
                if(headPosition==applePosition){
                    score++;
                    scoreElement.innerText=hardMode?
                    `Hard Mode: ${score}`:
                    `Score: ${score}`;
                    addNewApple();
                    contrast=Math.min(1,contrast+contrastIncrease);
                    console.log(`contrast: ${contrastIncrease*100}%`);
                    console.log('New fade spped');
                    stepsTaken++;
                }else{
                    transition(percentageOfStep)
                };
                if(lastTimestamp){
                    const contrastDecrease=timeElapsedSinceLastCall/Math.pow(fadeExponential,score)*fadeSpeed;
                    contrast=Math.max(0,contrast-contrastDecrease);
                }
                contrastElement.innerText=`Contrast: ${Math.floor(contrast*100)}%`;
                containerElement.style.filter=`contrast(${contrast})`;
            }
                window.requestAnimationFrame(main);
        }catch(e){
            console.log(`Mira mi error ${e}`);
        }
        lastTimestamp=timestamp;
    }
    function transition(percentageOfStep){
        const head=tiles[snakePositions[snakePositions.length-1]];
        const headDi=headDirection();
        const headValue=`${percentageOfStep*100}%`;
        if(headDi=='right'||headDi=='left'){
            head.style.width=headValue;
        }
        if(headDi=='up'||headDi=='down'){
            head.style.height=headValue;
        }
    };
    function stepAndTransition(percentageOfStep){
        const newPosition=getNextPostion();
        console.log(`
            Snake stteping into tile ${newPosition}`);
        snakePositions.push(newPosition);
        const previousTail=tiles[snakePositions[0]];
        setTile(previousTail);
        if(newPosition!=applePosition){
            snakePositions.shift();
            const tail=tiles[snakePositions[0]];
            const tailDi=tailDirection();
            const tailValue=`${percentageOfStep*100}%`;
            if(tailDi=='right'){
                setTile(tail,{
                    left:0,
                    width:tailValue,
                    backgroundColor:color,
                });
            }
            if(tailDi=='left'){
                setTile(tail,{
                    right:0,
                    width:tailValue,
                    backgroundColor:color,
                });
            }
            if(tailDi=='up'){  
                setTile(tail,{
                    bottom:0,
                    height:tailValue,
                    backgroundColor:color,
                });
            }
            if(tailDi=='down'){
                setTile(tail,{
                    top:0,
                    height:tailValue,
                    backgroundColor:color,
                });
            }
        }
        const previousHead=tiles[snakePositions[snakePositions.length-2]];
        setTile(previousHead,{
            backgroundColor:color,
        });
        const head=tiles[newPosition];
        const headDi=headDirection();
        const headValue=`${percentageOfStep*100}%`;
        if(headDi=='right'){
            setTile(head,{
                left:0,
                width:headValue,
                backgroundColor:color,
                borderRadius:0,
            });
        }
        if(headDi=='left'){
            setTile(head,{
                right:0,
                width:headValue,
                backgroundColor:color,
                borderRadius:0,
            });
        }
        if(headDi=='up'){
            setTile(head,{
                bottom:0,
                height:headValue,
                backgroundColor:color,
                borderRadius:0,
            });
        }
        if(headDi=='down'){
            setTile(head,{
                top:0,
                height:headValue,
                backgroundColor:color,
                borderRadius:0,
            });
        }
    }
    function getNextPostion(){
        const headPosition=snakePositions[snakePositions.length-1];
        const snakeDirenction=inputs.shift()||headDirection();
        switch(snakeDirenction){
            case 'right':{
                const  nextPosition=headPosition+1;
                if(nextPosition%width==0){
                    throw Error('Snake hit right wall');
                }
                if(snakePositions.slice(1).includes(nextPosition)){
                    throw new Error('Snake hit itself');
                }
                return nextPosition;
            }
            case 'left':{
                const nextPosition=headPosition-1;
                if(nextPosition%width==width-1||nextPosition<0){
                    throw new Error('Snake hit left wall');
                }
                if(snakePositions.slice(1).includes(nextPosition)){
                    throw new Error('Snake hit itself');
                }
                return nextPosition;
            }
            case 'up':{
                const nextPosition=headPosition-width;
                if(nextPosition<0){
                    throw new Error('Snake hit top wall');
                }
                if(snakePositions.slice(1).includes(nextPosition)){
                    throw new Error('Snake hit itself');
                }
                return nextPosition;
            }
            case 'down':{
                const nextPosition=headPosition+width;
                if(nextPosition>=width*height-1){
                    throw new Error('Snake hit bottom wall');
                }
                if(snakePositions.slice(1).includes(nextPosition)){
                    throw new Error('Snake hit itself');
                }
                return nextPosition;
            }
        };
    }
    function headDirection(){
        const head=snakePositions[snakePositions.length-1];
        const neck=snakePositions[snakePositions.length-2];
        return getDirection(neck,head);

    }
    function getDirection(first,second){
        if(first-1==second){
            return "right";
        }
        if(first+1==second){
            return "left";
        }
        if(first+width==second){
            return "up";
        }
        if(first-width==second){
            return "down";
        }
    }
    function tailDirection(){
        const tail1=snakePositions[0];
        const tail2=snakePositions[1];
        return getDirection(tail1,tail2);
    }
    function addNewApple(){
        let newPosition;
        do{
            newPosition=Math.floor(Math.random()*width*height);
        }while(snakePositions.includes(newPosition));
        applePosition=newPosition;
    }
    function setTile(element,override={}){
        const defaults={
            width:'100%',
            height:'100%',
            top:'auto',
            left:'auto',
            right:'auto',
            bottom:'auto',
            backgroundColor:'transparent',
        };
        const cssProperties={...defaults,...override};
        element.style.cssText=Object.entries(cssProperties).map(([key,value])=>`${key}:${value}`).join(';');
    }
});