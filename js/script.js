// const url = 'https://script.google.com/macros/s/AKfycbwYfyHN0w7qPp_BV-VoZvE7o6XBzy4kBScmR1ThALTxzZRgQiAHWHk3a5YOVmJE1glkYQ/exec';
// fetch(url);
let faixaTable = [];
let faixaAtualTable = [];

function submitToGoogleForms(nome, bairro, telefone, email) {
    const FORM_ID = '1FAIpQLSe-2VOWWyGVpJtT5uk0uZVKXsGVRdsWMQ0G8TMrwmTuvwBNVQ';
    const submitURL = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse?&submit=Submit&usp=pp_url&entry.1942049878=${encodeURIComponent(nome)}&entry.71874551=${encodeURIComponent(bairro)}&entry.1782898570=${encodeURIComponent(telefone)}&entry.969157729=${encodeURIComponent(email)}`;

    fetch(submitURL, {
        method: 'GET',
        mode: 'no-cors',
    })
}

function formatarReais(valor) {
    const numero = typeof valor === 'string' ? parseFloat(valor.replace(',','.')) : valor;
    return "R$ " + numero.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});

}

function formatarReaisContaLuz(cosipAtual, novaCosip) {
    const diferenca = Math.abs((cosipAtual - novaCosip));
    const numero = typeof diferenca === 'string' ? parseFloat(diferenca.replace(',','.')) : diferenca;
    return "R$ " + numero.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});   

}

function formatarPercentual(valor) {
    if (isNaN(valor)) return '0%';
    return (valor >= 0 ? '+ ' : '- ') + Math.abs(valor).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '%';
}

function formatarPercentualContaLuz() {
    
}

function insertValues() {

    let kwh = parseFloat(document.querySelector("#kwh").value);
    if(kwh < 0 || isNaN(kwh)) {
        alert("Por favor, insira um valor válido para KWh.");
        return;
    }

    const [valorFixo, coeficiente, cosipAtualVerde, cosipAtualAmarela, cosipAtualVermelha1, cosipAtualVermelha2] = getValues(kwh, [faixaTable, faixaAtualTable]);
    

    // Valor da TEIP por bandeira
    const teipBandeiraVerde = 0.64018;
    const teipBandeiraAmarela = 0.66709;
    const teipBandeiraVermelha1 = 0.69728;
    const teipBandeiraVermelha2 = 0.75746;

    // Valor da Bandeira por bandeira
    const valorBandeiraVerde = 0.00;
    const valorBandeiraAmarela = 0.01885; 
    const valorBandeiraVermelha1 = 0.04463;
    const valorBandeiraVermelha2 = 0.07877;

    // Valor-Base da COSIP por bandeira 
    let valorbaseCosipVerde = valorFixo + (coeficiente * (teipBandeiraVerde * 1000));
    let valorbaseCosipAmarela = valorFixo + (coeficiente * (teipBandeiraAmarela * 1000));
    let valorbaseCosipVermelha1 = valorFixo + (coeficiente * (teipBandeiraVermelha1 * 1000));
    let valorbaseCosipVermelha2 = valorFixo + (coeficiente * (teipBandeiraVermelha2 * 1000));

    // Valores da COSIP por bandeiras
    let acrescimoBandeiraCosipVerde = coeficiente * (valorBandeiraVerde * 1000);
    let acrescimoBandeiraCosipAmarela = coeficiente * (valorBandeiraAmarela * 1000);
    let acrescimoBandeiraCosipVermelha1 = coeficiente * (valorBandeiraVermelha1 * 1000);
    let acrescimoBandeiraCosipVermelha2 = coeficiente * (valorBandeiraVermelha2 * 1000);
    

    // Total Nova Cosip por bandeira
    let totalNovaCosipVerde = (valorbaseCosipVerde + acrescimoBandeiraCosipVerde);
    let totalNovaCosipAmarela = (valorbaseCosipAmarela + acrescimoBandeiraCosipAmarela);
    let totalNovaCosipVermelha1 = (valorbaseCosipVermelha1 + acrescimoBandeiraCosipVermelha1);
    let totalNovaCosipVermelha2 = (valorbaseCosipVermelha2 + acrescimoBandeiraCosipVermelha2);

    // Diferença entre a COSIP atual e a nova COSIP por bandeira
    let diferencaCosipVerde = (totalNovaCosipVerde - cosipAtualVerde).toFixed(2);
    let diferencaCosipAmarela = (totalNovaCosipAmarela - cosipAtualAmarela).toFixed(2);
    let diferencaCosipVermelha1 = (totalNovaCosipVermelha1 - cosipAtualVermelha1).toFixed(2);
    let diferencaCosipVermelha2 = (totalNovaCosipVermelha2 - cosipAtualVermelha2).toFixed(2);
    

    // Variação percentual entre a COSIP atual e a nova COSIP por bandeira
    let variacaoPercentualCosipVerde = ((diferencaCosipVerde / cosipAtualVerde) * 100).toFixed(2);
    let variacaoPercentualCosipAmarela = ((diferencaCosipAmarela / cosipAtualAmarela) * 100).toFixed(2);
    let variacaoPercentualCosipVermelha1 = ((diferencaCosipVermelha1 / cosipAtualVermelha1) * 100).toFixed(2);
    let variacaoPercentualCosipVermelha2 = ((diferencaCosipVermelha2 / cosipAtualVermelha2) * 100).toFixed(2);

    ////////////////////////////////////////////////////////////////////////
    // Custo estimado conta de luz (sem imposto)
    let [custoEstimadoContaLuzVerde, custoEstimadoContaLuzAmarela, custoEstimadoContaLuzVermelha1, custoEstimadoContaLuzVermelha2] = [(kwh * 0.86819), (kwh * 0.86819), (kwh * 0.86819), (kwh * 0.86819)];  

    // Custo da bandeira por bandeira
    let custoBandeiraVerde = (kwh * valorBandeiraVerde);
    let custoBandeiraAmarela = (kwh * valorBandeiraAmarela);
    let custoBandeiraVermelha1 = (kwh * valorBandeiraVermelha1);
    let custoBandeiraVermelha2 = (kwh * valorBandeiraVermelha2); 

    // PIS/COFINS (11,75%) -> ((Custo da energia + Custo da Bandeira) / (1-6,29%)) - (Custo da energia + Custo da Bandeira)
    let pisCofinsVerde = (((custoEstimadoContaLuzVerde + custoBandeiraVerde) / 0.9371) - (custoEstimadoContaLuzVerde + custoBandeiraVerde));
    let pisCofinsAmarela = (((custoEstimadoContaLuzAmarela + custoBandeiraAmarela) / 0.9371) - (custoEstimadoContaLuzAmarela + custoBandeiraAmarela));
    let pisCofinsVermelha1 = (((custoEstimadoContaLuzVermelha1 + custoBandeiraVermelha1) / 0.9371) - (custoEstimadoContaLuzVermelha1 + custoBandeiraVermelha1));
    let pisCofinsVermelha2 = (((custoEstimadoContaLuzVermelha2 + custoBandeiraVermelha2) / 0.9371) - (custoEstimadoContaLuzVermelha2 + custoBandeiraVermelha2));
    
    // ICMS por bandeira (25%) -> ((Custo da energia + Custo da Bandeira + PIS/COFINS) / (1-25%)) - (Custo da energia + Custo da Bandeira + PIS/COFINS)
    let icmsVerde = (((custoEstimadoContaLuzVerde + custoBandeiraVerde + pisCofinsVerde) / 0.82) - (custoEstimadoContaLuzVerde + custoBandeiraVerde + pisCofinsVerde));
    let icmsAmarela = (((custoEstimadoContaLuzAmarela + custoBandeiraAmarela + pisCofinsAmarela) / 0.82) - (custoEstimadoContaLuzAmarela + custoBandeiraAmarela + pisCofinsAmarela));
    let icmsVermelha1 = (((custoEstimadoContaLuzVermelha1 + custoBandeiraVermelha1 + pisCofinsVermelha1) / 0.82) - (custoEstimadoContaLuzVermelha1 + custoBandeiraVermelha1 + pisCofinsVermelha1));
    let icmsVermelha2 = (((custoEstimadoContaLuzVermelha2 + custoBandeiraVermelha2 + pisCofinsVermelha2) / 0.82) - (custoEstimadoContaLuzVermelha2 + custoBandeiraVermelha2 + pisCofinsVermelha2));  
    
    // Subtotal (energia + impostos)
    let subtotalVerde = (custoEstimadoContaLuzVerde + custoBandeiraVerde + pisCofinsVerde + icmsVerde).toFixed(2);
    let subtotalAmarela = (custoEstimadoContaLuzAmarela + custoBandeiraAmarela + pisCofinsAmarela + icmsAmarela).toFixed(2);
    let subtotalVermelha1 = (custoEstimadoContaLuzVermelha1 + custoBandeiraVermelha1 + pisCofinsVermelha1 + icmsVermelha1).toFixed(2);
    let subtotalVermelha2 = (custoEstimadoContaLuzVermelha2 + custoBandeiraVermelha2 + pisCofinsVermelha2 + icmsVermelha2).toFixed(2);

    // Total estimado conta de luz Cosip Atual
    let totalEstimadoContaLuzCosipAtualVerde = (parseFloat(subtotalVerde) + parseFloat(cosipAtualVerde)).toFixed(2);
    let totalEstimadoContaLuzCosipAtualAmarela = (parseFloat(subtotalAmarela) + parseFloat(cosipAtualAmarela)).toFixed(2);
    let totalEstimadoContaLuzCosipAtualVermelha1 = (parseFloat(subtotalVermelha1) + parseFloat(cosipAtualVermelha1)).toFixed(2);
    let totalEstimadoContaLuzCosipAtualVermelha2 = (parseFloat(subtotalVermelha2) + parseFloat(cosipAtualVermelha2)).toFixed(2);

    // Total estimado conta de luz Nova Cosip
    let totalEstimadoContaLuzNovaCosipVerde = (parseFloat(subtotalVerde) + parseFloat(totalNovaCosipVerde)).toFixed(2);
    let totalEstimadoContaLuzNovaCosipAmarela = (parseFloat(subtotalAmarela) + parseFloat(totalNovaCosipAmarela)).toFixed(2);
    let totalEstimadoContaLuzNovaCosipVermelha1 = (parseFloat(subtotalVermelha1) + parseFloat(totalNovaCosipVermelha1)).toFixed(2);
    let totalEstimadoContaLuzNovaCosipVermelha2 = (parseFloat(subtotalVermelha2) + parseFloat(totalNovaCosipVermelha2)).toFixed(2); 
    
    
    // Inserindo os valores na tabela HTML

    let cosipVerdeTotal =  document.querySelector("#total-cosip-verde");
    let novaCosipVerdeTotal = document.querySelector("#total-nova-cosip-verde");
    let diferencaCosipsVerde = document.querySelector("#diferenca-cosips-verde");
    let variacaoCosipsVerde = document.querySelector("#variacao-cosips-verde");

    let cosipAmarelaTotal =  document.querySelector("#total-cosip-amarela");
    let novaCosipAmarelaTotal = document.querySelector("#total-nova-cosip-amarela"); 
    let diferencaCosipsAmarela = document.querySelector("#diferenca-cosips-amarela");
    let variacaoCosipsAmarela = document.querySelector("#variacao-cosips-amarela");

    let cosipVermelha1Total =  document.querySelector("#total-cosip-vermelha1"); 
    let novaCosipVermelha1Total = document.querySelector("#total-nova-cosip-vermelha1"); 
    let diferencaCosipsVermelha1 = document.querySelector("#diferenca-cosips-vermelha1");
    let variacaoCosipsVermelha1 = document.querySelector("#variacao-cosips-vermelha1");

    let cosipVermelha2Total =  document.querySelector("#total-cosip-vermelha2");
    let novaCosipVermelha2Total = document.querySelector("#total-nova-cosip-vermelha2"); 
    let diferencaCosipsVermelha2 = document.querySelector("#diferenca-cosips-vermelha2");
    let variacaoCosipsVermelha2 = document.querySelector("#variacao-cosips-vermelha2");


    let totalContaLuzCosipAtualVerde = document.querySelector("#total-conta-luz-cosip-verde");
    let totalContaLuzNovaCosipVerde = document.querySelector("#total-conta-luz-nova-cosip-verde");
    let diferencaContaLuzVerde = document.querySelector("#diferenca-conta-luz-cosips-verde");
    let variacaoContaLuzVerde = document.querySelector("#variacao-conta-luz-cosips-verde");

    let totalContaLuzCosipAtualAmarela = document.querySelector("#total-conta-luz-cosip-amarela");
    let totalContaLuzNovaCosipAmarela = document.querySelector("#total-conta-luz-nova-cosip-amarela");
    let diferencaContaLuzAmarela = document.querySelector("#diferenca-conta-luz-cosips-amarela");
    let variacaoContaLuzAmarela = document.querySelector("#variacao-conta-luz-cosips-amarela");

    let totalContaLuzCosipAtualVermelha1 = document.querySelector("#total-conta-luz-cosip-vermelha1");
    let totalContaLuzNovaCosipVermelha1 = document.querySelector("#total-conta-luz-nova-cosip-vermelha1");
    let diferencaContaLuzVermelha1 = document.querySelector("#diferenca-conta-luz-cosips-vermelha1");
    let variacaoContaLuzVermelha1 = document.querySelector("#variacao-conta-luz-cosips-vermelha1");

    let totalContaLuzCosipAtualVermelha2 = document.querySelector("#total-conta-luz-cosip-vermelha2");
    let totalContaLuzNovaCosipVermelha2 = document.querySelector("#total-conta-luz-nova-cosip-vermelha2");
    let diferencaContaLuzVermelha2 = document.querySelector("#diferenca-conta-luz-cosips-vermelha2");
    let variacaoContaLuzVermelha2 = document.querySelector("#variacao-conta-luz-cosips-vermelha2");

    
    
    

    // !isNaN(variacaoPercentualCosipVerde)
    // ? `${variacaoPercentualCosipVerde >= 0 ? '+ ' : '- '}${Math.abs(variacaoPercentualCosipVerde).toFixed(2).replace('.', ',')}%`: '0%';
    
    
    cosipVerdeTotal.textContent = formatarReais(cosipAtualVerde);
    novaCosipVerdeTotal.textContent = formatarReais(totalNovaCosipVerde);
    diferencaCosipsVerde.textContent = formatarReais(diferencaCosipVerde);
    variacaoCosipsVerde.textContent = formatarPercentual(variacaoPercentualCosipVerde);

    cosipAmarelaTotal.textContent = formatarReais(cosipAtualAmarela);
    novaCosipAmarelaTotal.textContent = formatarReais(totalNovaCosipAmarela);
    diferencaCosipsAmarela.textContent = formatarReais(diferencaCosipAmarela);
    variacaoCosipsAmarela.textContent = formatarPercentual(variacaoPercentualCosipAmarela);

    cosipVermelha1Total.textContent = formatarReais(cosipAtualVermelha1);
    novaCosipVermelha1Total.textContent = formatarReais(totalNovaCosipVermelha1);
    diferencaCosipsVermelha1.textContent = formatarReais(diferencaCosipVermelha1);
    variacaoCosipsVermelha1.textContent = formatarPercentual(variacaoPercentualCosipVermelha1);

    cosipVermelha2Total.textContent = formatarReais(cosipAtualVermelha2);
    novaCosipVermelha2Total.textContent =formatarReais(totalNovaCosipVermelha2);
    diferencaCosipsVermelha2.textContent = formatarReais(diferencaCosipVermelha2);
    variacaoCosipsVermelha2.textContent = formatarPercentual(variacaoPercentualCosipVermelha2);
    

    totalContaLuzCosipAtualVerde.textContent = formatarReais(totalEstimadoContaLuzCosipAtualVerde);
    totalContaLuzNovaCosipVerde.textContent = formatarReais(totalEstimadoContaLuzNovaCosipVerde);
    diferencaContaLuzVerde.textContent =  formatarReaisContaLuz(totalEstimadoContaLuzCosipAtualVerde, totalEstimadoContaLuzNovaCosipVerde);
    variacaoContaLuzVerde.textContent = !isNaN(((totalEstimadoContaLuzNovaCosipVerde - totalEstimadoContaLuzCosipAtualVerde) / totalEstimadoContaLuzCosipAtualVerde) * 100)
    ? `${(((totalEstimadoContaLuzNovaCosipVerde - totalEstimadoContaLuzCosipAtualVerde) / totalEstimadoContaLuzCosipAtualVerde) * 100) >= 0 ? '+ ' : '- '}${Math.abs((((totalEstimadoContaLuzNovaCosipVerde - totalEstimadoContaLuzCosipAtualVerde) / totalEstimadoContaLuzCosipAtualVerde) * 100)).toFixed(2).replace('.', ',')}%`: '0%';
    
    totalContaLuzCosipAtualAmarela.textContent = formatarReais(totalEstimadoContaLuzCosipAtualAmarela);
    totalContaLuzNovaCosipAmarela.textContent = formatarReais(totalEstimadoContaLuzNovaCosipAmarela);
    diferencaContaLuzAmarela.textContent = formatarReaisContaLuz(totalEstimadoContaLuzCosipAtualAmarela, totalEstimadoContaLuzNovaCosipAmarela);
    variacaoContaLuzAmarela.textContent = !isNaN(((totalEstimadoContaLuzNovaCosipAmarela - totalEstimadoContaLuzCosipAtualAmarela) / totalEstimadoContaLuzCosipAtualAmarela) * 100)
    ? `${(((totalEstimadoContaLuzNovaCosipAmarela - totalEstimadoContaLuzCosipAtualAmarela) / totalEstimadoContaLuzCosipAtualAmarela) * 100) >= 0 ? '+ ' : '- '}${Math.abs((((totalEstimadoContaLuzNovaCosipAmarela - totalEstimadoContaLuzCosipAtualAmarela) / totalEstimadoContaLuzCosipAtualAmarela) * 100)).toFixed(2).replace('.', ',')}%`: '0%';  

    totalContaLuzCosipAtualVermelha1.textContent = formatarReais(totalEstimadoContaLuzCosipAtualVermelha1);
    totalContaLuzNovaCosipVermelha1.textContent = formatarReais(totalEstimadoContaLuzNovaCosipVermelha1);
    diferencaContaLuzVermelha1.textContent = formatarReaisContaLuz(totalEstimadoContaLuzCosipAtualVermelha1, totalEstimadoContaLuzNovaCosipVermelha1);
    variacaoContaLuzVermelha1.textContent = !isNaN(((totalEstimadoContaLuzNovaCosipVermelha1 - totalEstimadoContaLuzCosipAtualVermelha1) / totalEstimadoContaLuzCosipAtualVermelha1) * 100)
    ? `${(((totalEstimadoContaLuzNovaCosipVermelha1 - totalEstimadoContaLuzCosipAtualVermelha1) / totalEstimadoContaLuzCosipAtualVermelha1) * 100) >= 0 ? '+ ' : '- '}${Math.abs((((totalEstimadoContaLuzNovaCosipVermelha1 - totalEstimadoContaLuzCosipAtualVermelha1) / totalEstimadoContaLuzCosipAtualVermelha1) * 100)).toFixed(2).replace('.', ',')}%`: '0%';

    totalContaLuzCosipAtualVermelha2.textContent = formatarReais(totalEstimadoContaLuzCosipAtualVermelha2);
    totalContaLuzNovaCosipVermelha2.textContent = formatarReais(totalEstimadoContaLuzNovaCosipVermelha2);
    diferencaContaLuzVermelha2.textContent = formatarReaisContaLuz(totalEstimadoContaLuzCosipAtualVermelha2, totalEstimadoContaLuzNovaCosipVermelha2);
    variacaoContaLuzVermelha2.textContent = !isNaN(((totalEstimadoContaLuzNovaCosipVermelha2 - totalEstimadoContaLuzCosipAtualVermelha2) / totalEstimadoContaLuzCosipAtualVermelha2) * 100) 
    ? `${(((totalEstimadoContaLuzNovaCosipVermelha2 - totalEstimadoContaLuzCosipAtualVermelha2) / totalEstimadoContaLuzCosipAtualVermelha2) * 100) >= 0 ? '+ ' : '- '}${Math.abs((((totalEstimadoContaLuzNovaCosipVermelha2 - totalEstimadoContaLuzCosipAtualVermelha2) / totalEstimadoContaLuzCosipAtualVermelha2) * 100)).toFixed(2).replace('.', ',')}%`: '0%';  
}

    
function getValues(kwh, [tabela, tabelaBandeiras]) {
    let valorFixo = null;
    let coeficiente = null;
    let cosipAtualVerde = null;
    let cosipAtualAmarela = null;
    let cosipAtualVermelha1 = null;
    let cosipAtualVermelha2 = null;

    for(let faixa of tabela){
        if(kwh >= faixa.Mínimo && (faixa.Máximo === undefined || kwh <= faixa.Máximo || faixa.Mínimo >= 200001) ) {
            valorFixo = faixa.valorFixo;
            coeficiente = faixa.Coeficiente;
        }}
    
    for(let faixaBandeira of tabelaBandeiras){
        if(kwh >= faixaBandeira.Mínimo && (kwh <= faixaBandeira.Máximo || faixaBandeira.Máximo === undefined)) {
    
            cosipAtualVerde = (faixaBandeira.cosipAtualVerde).toFixed(2);
            cosipAtualAmarela = (faixaBandeira.cosipAtualAmarela).toFixed(2);
            cosipAtualVermelha1 = (faixaBandeira.cosipAtualVermelha1).toFixed(2);
            cosipAtualVermelha2 = (faixaBandeira.cosipAtualVermelha2).toFixed(2);
        }
        
}   
   
    return [valorFixo, coeficiente, cosipAtualVerde, cosipAtualAmarela, cosipAtualVermelha1, cosipAtualVermelha2];
}




window.addEventListener('DOMContentLoaded', async () => {

    const popup = document.getElementById("popup");
    const form = document.getElementById("form-acesso");
    const fecharBtn = document.querySelector(".close-btn");
    const prosseguir = document.getElementById("prosseguir-dados");

    if (localStorage.getItem("acessoPermitido") !== "true") {
        setTimeout(() => {
            popup.style.display = "block"
        }, 1500)
    } else {
        popup.style.display = "none";
    } 

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const bairro = document.getElementById("bairro").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const email = document.getElementById("email").value.trim();
        
        submitToGoogleForms(nome, bairro, telefone, email);

        localStorage.setItem("acessoPermitido", "true");
        popup.style.display = "none";
    });

    // Fechar no X 
    fecharBtn.addEventListener('click', () => {
        localStorage.setItem('acessoPermitido', "true");
        popup.style.display = "none";
        console
    });

    // Fechar no prosseguir sem dados
    prosseguir.addEventListener("click", () => {
        localStorage.setItem("acessoPermitido", "true");
        popup.style.display = "none";
    });

    try {
        const response1 = await fetch('json/cosipometro_tabela_faixa.json')
        faixaTable = await response1.json();

        const response2 = await fetch('json/cosipometro_tabela_faixa_atual_bandeiras.json')
        faixaAtualTable = await response2.json();
    } catch (error) {
        console.error(error);
    }

    document.getElementById('kwh').addEventListener('keypress', function (event) {
        if (event.key == 'Enter'){
            event.preventDefault();
            insertValues();
        }
    })    
});
