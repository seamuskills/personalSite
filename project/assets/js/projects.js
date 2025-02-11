

function goToProject(hostLink){
    if (hostLink == ""){
        return 0;
    }
    window.location.href=`/hostedProject?hostedLink=${btoa(hostLink)}`
}
