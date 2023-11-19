
function guardarManga() {
  
  var mangasSalvos = JSON.parse(localStorage.getItem("mangas"))

  let campoNomeManga = document.getElementById("nomeManga")
  let nomeManga = campoNomeManga.value
  
  for (let i = 0; i < mangasSalvos.length; i++) {
    if (mangasSalvos.nome == nomeManga) {
      window.alert("Nome de mangá já salvo");
      campoNomeManga.value = "";
      return;
    }
  }


  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var url = tabs[0].url;
    console.log('URL atual:', url);
    
    var manga = { 
      url: url,
      nome: nomeManga
    };
    mangasSalvos.push(manga)
    localStorage.setItem("mangas", JSON.stringify(mangasSalvos));
    alert('Mangá guardado!');
    renderizarLista();
  });
 

}



function renderizarLista() {
  let mangasSalvos = JSON.parse(localStorage.getItem("mangas"))
  console.log(mangasSalvos);
  let ul = document.getElementById('listaMangas');
  ul.innerHTML = ''
  mangasSalvos.forEach(manga => {
    let li = document.createElement('li');

    let a = document.createElement('a');
    a.href = manga.url;
    a.textContent = manga.nome + ':\n' + manga.url;
    a.target = "_blank";
    li.appendChild(a);

    let botaoDeletar = document.createElement('button');
    botaoDeletar.textContent = 'Deletar';
    botaoDeletar.onclick = function() {
      // Lógica para deletar o manga
      // Por exemplo, você pode usar o índice do manga na lista para removê-lo
      let indice = mangasSalvos.indexOf(manga);
      if (indice !== -1) {
        
        mangasSalvos.splice(indice, 1);
        localStorage.setItem("mangas", JSON.stringify(mangasSalvos));
        renderizarLista(); // Atualiza a lista após a remoção
      }
    };

    li.appendChild(botaoDeletar);

    let botaoAtualizarLink = document.createElement('button');
    botaoAtualizarLink.textContent = 'Atualizar Link';
    botaoAtualizarLink.onclick = function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var url = tabs[0].url;
  
        manga.url = url
        localStorage.setItem("mangas", JSON.stringify(mangasSalvos));
        alert('Mangá guardado!');
        renderizarLista();
      });
    };
    li.appendChild(botaoAtualizarLink);
    ul.appendChild(li);
  });
}

function init() {
  let primeiraVez = localStorage.getItem("primeiraVez");
  if (!primeiraVez) {
    localStorage.setItem("mangas", JSON.stringify([]));
    localStorage.setItem("primeiraVez", 1);
  }
  renderizarLista()
}

document.getElementById("botaoGuardarManga").addEventListener("click", guardarManga);

window.onload = init;

