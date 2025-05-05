function tab(evento, tabela) {

    var i, ninaContent, ninaLinks;
    ninaContent = document.getElementsByClassName("nina-tab-content");

    for (i = 0; i < ninaContent.length; i++) {
        ninaContent[i].style.display = "none";
    }

    ninaLinks = document.getElementsByClassName("nina-links");

    for (i = 0; i < ninaLinks.length; i++) {
        ninaLinks[i].className = ninaLinks[i].className.replace(" active", "");
    }

  document.getElementById(tabela).style.display = "block";
  evento.currentTarget.className += " active";
}

document.getElementById("default").click();