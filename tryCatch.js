function prueba(numero){
    try{
        if(numero===0){
            throw new Error('no se puede dividir por cero');
        }
        let resultado=100/numero;
        console.log('que lindo resultado: '+resultado);
    }catch(error){
        console.log(`mira lo que hiciste: ${error}`);
    }
}
prueba(0);