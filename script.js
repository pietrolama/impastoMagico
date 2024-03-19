function toggleSections() {
    var tipoImpasto = document.getElementById('tipo_impasto').value;
    var sezioneDiretto = document.getElementById('sezione_diretto');
    var sezioneBiga = document.getElementById('sezione_biga');
    var sezionePoolish = document.getElementById('sezione_poolish');
    var sezioneBigaPoolish = document.getElementById('sezione_biga_poolish');

    if (tipoImpasto === 'diretto') {
        sezioneDiretto.style.display = 'block';
        sezioneBiga.style.display = 'none';
        sezionePoolish.style.display = 'none';
        sezioneBigaPoolish.style.display = 'none';
    } else if (tipoImpasto === 'biga') {
        sezioneDiretto.style.display = 'none';
        sezioneBiga.style.display = 'block';
        sezionePoolish.style.display = 'none';
        sezioneBigaPoolish.style.display = 'none';
    } else if (tipoImpasto === 'poolish') {
        sezioneDiretto.style.display = 'none';
        sezioneBiga.style.display = 'none';
        sezionePoolish.style.display = 'block';
        sezioneBigaPoolish.style.display = 'none';
    } else if (tipoImpasto === 'biga_poolish') {
        sezioneDiretto.style.display = 'none';
        sezioneBiga.style.display = 'none';
        sezionePoolish.style.display = 'none';
        sezioneBigaPoolish.style.display = 'block';
    }
}

// Preimpostiamo il metodo "diretto" come base all'avvio
document.getElementById('tipo_impasto').value = 'diretto';
toggleSections();

// Aggiungiamo un ascoltatore per l'evento change dell'elemento con id 'tipo_impasto'
document.getElementById('tipo_impasto').addEventListener('change', toggleSections);

function calcola() {
    var tipoImpasto = document.getElementById('tipo_impasto').value;
    localStorage.setItem("tipo_impasto", tipoImpasto);

    if (tipoImpasto === 'diretto') {
        calcolaDiretto();
    } else if (tipoImpasto === 'biga') {
        calcolaBiga();
    } else if (tipoImpasto === 'poolish') {
        calcolaPoolish();
    } else if (tipoImpasto === 'biga_poolish') {
        calcolaBigaPoolish();
    } 

    // Reindirizza alla nuova pagina
    window.location.href = "nuova_pagina.html";
}

function calcolaLievito(numPanetti, pesoPaniello, idratazione, sale, grassi, tempoLievitazione, oreFrigo, temperaturaAmbiente, forzaFarina, usa_teglia) {

    var tempCorretta = temperaturaAmbiente * (1 - .25 * usa_teglia)
    var fattoreCrescitaLievito = .005;

    var tempoLievitazioneCorretto  = tempoLievitazione - 9 * oreFrigo / 10
      , calcoloForzaLievito  = 81.4206918743428 + 78.3939060802556 * Math.log(tempoLievitazione)
      , arrotondamentoCalcoloForzaLievito  = 10 * Math.round(calcoloForzaLievito  / 10)
      , forzaLievitoSpecifica = 2250 * (1 + sale / 200) * (1 + grassi / 300) / ((4.2 * idratazione - 80 - .0305 * idratazione * idratazione) * Math.pow(tempCorretta, 2.5) * Math.pow(tempoLievitazioneCorretto , 1.2))
      , pesoImpasto = numPanetti * pesoPaniello
      , capacitaAssorbimentoAcqua  = idratazione * (sale + grassi) + 1e3 * (idratazione + 100)
      , quantitaFarinaImpasto = 1e5 * (pesoImpasto) / capacitaAssorbimentoAcqua 
      , quantitaAcquaImpasto  = (1e3 * idratazione * (pesoImpasto) / capacitaAssorbimentoAcqua ).toFixed(0)
      , quantitaSaleImpasto  = (sale * idratazione * (pesoImpasto) / capacitaAssorbimentoAcqua ).toFixed(0)
      , quantitaGrassiImpasto  = (grassi * idratazione * (pesoImpasto) / capacitaAssorbimentoAcqua ).toFixed(0)
      , lievitoNecessarioImpasto  = (quantitaFarinaImpasto * forzaLievitoSpecifica - fattoreCrescitaLievito).toFixed(2);
    quantitaFarinaImpasto = quantitaFarinaImpasto.toFixed(0);
    return lievitoNecessarioImpasto;
}


function calcolaDiretto() {
    var pesoPanetto = parseFloat(document.getElementById('peso_panetto_diretto').value);
    var idratazioneTotale = parseFloat(document.getElementById('idratazione_totale_diretto').value);
    var numPanetti = parseInt(document.getElementById('num_panetti_diretto').value);
    var tempoLievitazione = parseInt(document.getElementById('tempoLiev').value);
    var oreFrigo = parseInt(document.getElementById('tempoLievFrig').value);
    var forzaFarina = parseInt(document.getElementById('w').value);
    var temperaturaAmbiente = parseInt(document.getElementById('tempAmb').value);
    var inTeglia = document.getElementById('usa_teglia').checked;
    console.log(inTeglia);

    var pesoFarina = (100 * pesoPanetto) / (100 + idratazioneTotale) * numPanetti;
    var pesoAcqua = idratazioneTotale * pesoFarina / 100;
    var pesoLievi = 0.01 * pesoFarina;
    var pesoSale = 0.02 * pesoFarina;
    var pesoZucc = 0.013 * pesoFarina;
    var pesoOlio = 0.032 * pesoFarina;
    var lievito = calcolaLievito(numPanetti, pesoPanetto, idratazioneTotale, pesoSale, 0, tempoLievitazione, oreFrigo, temperaturaAmbiente, forzaFarina, inTeglia);
    
        // Memorizzare i valori in localStorage
    
    localStorage.setItem("idratazione_totale_diretto", idratazioneTotale);
    localStorage.setItem("lievito", lievito);
    
    mostraRisultatiDiretto(pesoFarina, pesoAcqua, pesoLievi, pesoSale, pesoZucc, pesoOlio, numPanetti, lievito, idratazioneTotale, tempoLievitazione, oreFrigo);
}

function calcolaBiga() {
    var pesoPanetto = parseFloat(document.getElementById('peso_panetto_biga').value);
    var idratazioneTotale = parseFloat(document.getElementById('idratazione_totale_biga').value);
    var percentualeBiga = parseFloat(document.getElementById('percentuale_biga').value);
    var numPanetti = parseInt(document.getElementById('num_panetti_biga').value);

    var pesoTotaleFarina = (100 * pesoPanetto) / (100 + idratazioneTotale) * numPanetti;
    var pesoTotaleAcqua = idratazioneTotale * pesoTotaleFarina / 100;
    var pesoFarinaBiga = (percentualeBiga / 100) * pesoTotaleFarina;
    var pesoFarinaPrincipale = pesoTotaleFarina - pesoFarinaBiga;
    var pesoZucc = 0.013 * pesoTotaleFarina;
    var pesoOlio = 0.032 * pesoTotaleFarina;


    var pesoAcquaBiga = 0.44 * pesoFarinaBiga;
    var pesoLieviBiga = 0.01 * pesoFarinaBiga;
    var pesoSale = 0.02 * pesoTotaleFarina;

    mostraRisultatiBigaOPoolish(pesoTotaleFarina, pesoTotaleAcqua, pesoFarinaBiga, pesoAcquaBiga, pesoLieviBiga, pesoSale, pesoZucc, pesoOlio, numPanetti);
}

function calcolaPoolish() {
    var pesoPanetto = parseFloat(document.getElementById('peso_panetto_poolish').value);
    var idratazioneTotale = parseFloat(document.getElementById('idratazione_totale_poolish').value);
    var percentualePoolish = parseFloat(document.getElementById('percentuale_poolish').value);
    var numPanetti = parseInt(document.getElementById('num_panetti_poolish').value);

    var pesoTotaleFarina = (100 * pesoPanetto) / (100 + idratazioneTotale) * numPanetti;
    var pesoTotaleAcqua = idratazioneTotale * pesoTotaleFarina / 100;
    var pesoFarinaPoolish = (percentualePoolish / 100) * pesoTotaleFarina;
    var pesoFarinaPrincipale = pesoTotaleFarina - pesoFarinaPoolish;
    var pesoZucc = 0.013 * pesoTotaleFarina;
    var pesoOlio = 0.032 * pesoTotaleFarina;

    var pesoAcquaPoolish = pesoFarinaPoolish;
    var pesoLieviPoolish = 0.001 * pesoFarinaPoolish;
    var pesoSale = 0.02 * pesoTotaleFarina;
    localStorage.setItem("idratazione_totale_poolish", idratazioneTotale);
    localStorage.setItem("percentuale_poolish", percentualePoolish);

    mostraRisultatiBigaOPoolish(pesoTotaleFarina, pesoTotaleAcqua, pesoFarinaPoolish, pesoAcquaPoolish, pesoLieviPoolish, pesoSale, pesoZucc, pesoOlio, numPanetti);
}

function calcolaBigaPoolish() {
    var percentualeBiga = parseFloat(document.getElementById('percentuale_biga_bp').value);
    var percentualePoolish = parseFloat(document.getElementById('percentuale_poolish_bp').value);
    var pesoPanetto = parseFloat(document.getElementById('peso_panetto_biga_poolish').value);
    var idratazioneTotale = parseFloat(document.getElementById('idratazione_totale_biga_poolish').value);
    var numPanetti = parseInt(document.getElementById('num_panetti_biga_poolish').value);

    var pesoTotaleFarina = (100 * pesoPanetto) / (100 + idratazioneTotale) * numPanetti;
    var pesoZucc = 0.013 * pesoTotaleFarina;
    var pesoOlio = 0.032 * pesoTotaleFarina;

    var pesoFarinaBiga = (percentualeBiga / 100) * pesoTotaleFarina;
    var pesoFarinaPoolish = (percentualePoolish / 100) * pesoTotaleFarina;

    var pesoAcquaBiga = 0.44 * pesoFarinaBiga;
    var pesoLieviBiga = 0.01 * pesoFarinaBiga;

    var pesoAcquaPoolish = pesoFarinaPoolish;
    var pesoLieviPoolish = 0.001 * pesoFarinaPoolish;

    var pesoAcquaPrincipale = idratazioneTotale * pesoTotaleFarina / 100;
    var pesoSale = 0.02 * pesoTotaleFarina;
    localStorage.setItem("idratazione_totale:idratazione_totale_biga_poolish", idratazioneTotale);
    localStorage.setItem("percentuale_biga", percentualeBiga);
    localStorage.setItem("percentuale_poolish", percentualePoolish);

    mostraRisultatiBigaPiuPoolish(pesoTotaleFarina, pesoAcquaPrincipale, pesoFarinaBiga, pesoAcquaBiga, pesoLieviBiga, pesoFarinaPoolish, pesoAcquaPoolish, pesoLieviPoolish, pesoSale, pesoZucc, pesoOlio, numPanetti);
}

function mostraRisultatiDiretto(pesoFarina, pesoAcqua, pesoLievi, pesoSale, pesoZucc, pesoOlio, numPanetti, lievito, idratazione, tempoLievitazione, oreFrigo) {
    var resultsDiv = document.getElementById('risultati');
    resultsDiv.innerHTML = "<span class='result-label'>Per fare " + numPanetti + " panetti, con un'idratatazione dell'" +idratazione +" %, una lievitazione totale di " + tempoLievitazione +" ore, di cui in frigorifero "+ oreFrigo+"</span><br><br>" +
                            "<span class='result-label'>avrai bisogno di:</span><br>" +
                            "<span class='result-label'>Farina:</span> <span class='result-value'>" + pesoFarina.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Acqua:</span> <span class='result-value'>" + pesoAcqua.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Lievito:</span> <span class='result-value'>" + lievito + " gr</span><br>" +
                            "<span class='result-label'>Sale:</span> <span class='result-value'>" + pesoSale.toFixed(2) + " gr</span><br>"+
                            "<span class='result-label'>Zucchero:</span> <span class='result-value'>" + pesoZucc.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Olio:</span> <span class='result-value'>" + pesoOlio.toFixed(2) + " gr</span><br><br>" +
                            "<span class='result-label'>Procedimento:</span><br><br>"+
                            "<span class='result-value'>Sciogliere il sale nell'acqua e aggiungere metà farina setacciata con il lievito sbriciolato dentro. Aggiungere la restante farina un poco alla volta. Aggiungere poi zucchero e olio(lo zucchero aggiungetelo solo se usate un forno domestico). Lavorare l'impasto per circa 10/15 min., formare una palla e lasciarlo riposare sul piano da lavoro coperto da una bowl. A questo punto riporre l'impasto in frigo per "+ oreFrigo +", se previsto dalla ricetta, altrimenti trascorsa un'ora, formare "+ numPanetti +" panetti e aspettare il loro raddoppio, ci vorranno circa "+ Math.abs(tempoLievitazione-oreFrigo) +" ore. Spolveriamo un filo di farina sul piano di lavoro e stendiamo ora il panetto di pizza dandogli una forma tonda, facendo attenzione e non schiacciare i bordi. Partite dal centro, con le mani disposte tra di loro a 90°, con un indice sovrapposto all'altro, e delicatamente iniziate a sgonfiare il panetto portando l'aria verso i bordi, in modo da avere un cornicione ben strutturato ed alto. Di quando in quando durante la stesura girate il panetto e ripetete l'operazione. Finita la stesura condiamo la pizza. Infornate adesso la vostra pizza nel fornetto per pizze alla massima potenza per circa 2-3 minuti. In caso non abbiate un fornetto per le pizze, infornare alla massima potenza, in forno preriscaldato. I tempi possono essere variabili ma vi ci vorranno dagli 8 ai 12 minuti circa.</span><br><br>"; 
    
    // Salva i risultati nel localStorage
    var risultati = resultsDiv.innerHTML;
    localStorage.setItem("risultati", JSON.stringify(risultati));
}

function mostraRisultatiBigaOPoolish(pesoTotaleFarina, pesoTotaleAcqua, pesoFarinaPrefermento, pesoAcquaPrefermento, pesoLieviPrefermento, pesoSale, pesoZucc, pesoOlio, numPanetti) {
    var resultsDiv = document.getElementById('risultati');
    resultsDiv.innerHTML = "<span class='result-label'>Per fare " + numPanetti + " pagnotte avrai bisogno di:</span><br><br>" +
                            "<span class='result-label'>Ingradienti totali:</span><br>" +
                            "<span class='result-label'>Farina:</span> <span class='result-value'>" + pesoTotaleFarina.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Acqua:</span> <span class='result-value'>" + pesoTotaleAcqua.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Sale:</span> <span class='result-value'>" + pesoSale.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Zucchero:</span> <span class='result-value'>" + pesoZucc.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Olio:</span> <span class='result-value'>" + pesoOlio.toFixed(2) + " gr</span><br><br>" +
                            "<span class='result-label'>Prefermento:</span><br>" +
                            "<span class='result-label'>Farina:</span> <span class='result-value'>" + pesoFarinaPrefermento.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Acqua:</span> <span class='result-value'>" + pesoAcquaPrefermento.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Lievito:</span> <span class='result-value'>" + pesoLieviPrefermento.toFixed(2) + " gr</span><br><br>" +
                            "<span class='result-label'>Procedimento:</span><br><br>"+
                            "<span class='result-value'>Prepara il preimpasto mescolando la farina con l'acqua e il lievito secondo le proporzioni indicate per il prefermento. Lascia fermentare a temperatura ambiente per 18 ore. Dopo le 18 ore, metti in planetaria il prefermento e metà dell'acqua rimasta. Lascia lavorare fino a quando non si sono sciolti i grumi. Aggiungi la restante farina e il lievito. Quando si forma una buona maglia glutinica, aggiungi lo zucchero e l'olio e lascia assorbire. Aggiungi il sale e l'acqua rimasta a filo, assicurandoti di aggiungere nuovaacqua solo quando quella precedente è stata assorbita. Spostati su un piano da lavoro e inizia a lavorare l'impasto con un po' di olio, piegando finché non diventa liscio e omogeneo. Se è difficile da lavorare, fai riposare in frigorifero per 10 minuti e riprendi. Dopo il riposo, fai lo staglio e crea i singoli panetti. A questo punto, hai due opzioni: lasciare lievitare a temperatura ambiente per circa 3 ore, oppure riporre in frigorifero. Se scegli il secondo metodo, togli l'impasto dal frigorifero 1 ora e 30 minuti prima di usarlo. Stendi l'impasto e condiscilo a tuo piacimento. Cuoci in un fornetto per pizza preriscaldato al massimo della potenza per circa 4 minuti, oppure infornare in forno tradizionale alla massima potenza per circa 12-15 minuti</span><br><br>";



    // Salva i risultati nel localStorage
    var risultati = resultsDiv.innerHTML;
    localStorage.setItem("risultati", JSON.stringify(risultati));
}

function mostraRisultatiBigaPiuPoolish(pesoTotaleFarina, pesoAcquaPrincipale, pesoFarinaBiga, pesoAcquaBiga, pesoLieviBiga, pesoFarinaPoolish, pesoAcquaPoolish, pesoLieviPoolish, pesoSale, pesoZucc, pesoOlio, numPanetti) {
    var resultsDiv = document.getElementById('risultati');
    resultsDiv.innerHTML = "<span class='result-label'>Per fare " + numPanetti + " pagnotte avrai bisogno di:</span><br><br>" +
                            "<span class='result-label'>Ingradienti totali:</span><br>" +
                            "<span class='result-label'>Farina:</span> <span class='result-value'>" + pesoTotaleFarina.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Acqua:</span> <span class='result-value'>" + pesoAcquaPrincipale.toFixed(2) + " gr</span><br><br>" +
                            "<span class='result-label'>Sale:</span> <span class='result-value'>" + pesoSale.toFixed(2) + " gr</span><br><br>" +
                            "<span class='result-label'>Zucchero:</span> <span class='result-value'>" + pesoZucc.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Olio:</span> <span class='result-value'>" + pesoOlio.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Prefermento (Biga):</span><br>" +
                            "<span class='result-label'>Farina:</span> <span class='result-value'>" + pesoFarinaBiga.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Acqua:</span> <span class='result-value'>" + pesoAcquaBiga.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Lievito:</span> <span class='result-value'>" + pesoLieviBiga.toFixed(2) + " gr</span><br><br>" +
                            "<span class='result-label'>Prefermento (Poolish):</span><br>" +
                            "<span class='result-label'>Farina:</span> <span class='result-value'>" + pesoFarinaPoolish.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Acqua:</span> <span class='result-value'>" + pesoAcquaPoolish.toFixed(2) + " gr</span><br>" +
                            "<span class='result-label'>Lievito:</span> <span class='result-value'>" + pesoLieviPoolish.toFixed(2) + " gr</span><br><br>" +
                            "<span class='result-label'>Procedimento:</span><br><br>"+
                            "<span class='result-value'>Prepara il preimpasto mescolando la farina con l'acqua e il lievito secondo le proporzioni indicate per la biga e il poolish. Lascia fermentare a temperatura ambiente per 18 ore. Dopo le 18 ore, metti in planetaria la biga, il poolish e metà dell'acqua rimasta. Lascia lavorare fino a quando non sisono sciolti i grumi. Aggiungi la restante farina e il lievito. Quando si formauna buona maglia glutinica, aggiungi lo zucchero e l'olio e lascia assorbire.Aggiungi il sale e l'acqua rimasta a filo, assicurandoti di aggiungere nuovaacqua solo quando quella precedente è stata assorbita.Spostati su un piano da lavoro e inizia a lavorare l'impasto con un po' diolio, piegando finché non diventa liscio e omogeneo. Se è difficile da lavo-rare, fai riposare in frigorifero per 10 minuti e riprendi. Dopo il riposo, failo staglio e crea i singoli panetti.A questo punto, hai due opzioni: lasciare lievitare a temperatura ambienteper circa 3 ore, oppure riporre in frigorifero. Se scegli il secondo metodo,togli l'impasto dal frigorifero 1 ora e 30 minuti prima di usarlo.Stendi l'impasto e condiscilo a tuo piacimento.Cuoci in un fornetto per pizza preriscaldato al massimo della potenza per circa 4 minuti, oppure infornare in forno tradizionale alla massima potenza per circa 12-15 minuti</span><br><br>";

    // Salva i risultati nel localStorage
    var risultati = resultsDiv.innerHTML;
    localStorage.setItem("risultati", JSON.stringify(risultati));
}
