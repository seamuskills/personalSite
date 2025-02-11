params = new URLSearchParams(document.location.search);
hostedLink = atob(params.get("hostedLink"));

frame = document.getElementById("projectFrame");
frame.src = hostedLink;
