// ==UserScript==
// @name         Open All buy orders in new tab test
// @namespace    https://github.com/LucasHenriqueDiniz
// @version      0.2
// @description  eh
// @author       Lucas Diniz
// @match        https://mannco.store/profile
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mannco.store
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js


// @homepageURL  https://github.com/LucasHenriqueDiniz/openAllBuyOrders.user.js
// @supportURL   https://github.com/LucasHenriqueDiniz/openAllBuyOrders.user.js/issues
// @downloadURL  https://github.com/LucasHenriqueDiniz/open-all-buyorders-test/raw/main/openAllBuyOrders.user.js
// @updateURL    https://github.com/LucasHenriqueDiniz/open-all-buyorders-test/raw/main/openAllBuyOrders.user.js

// @grant        GM_openInTab
// ==/UserScript==

(function () {
    "use strict";
  const maxLoop = 100;
    let currentLoop = 1; // Define o número inicial da página
    const delayvalue = 750;

    const paginationElement = document.querySelector("#bosPagination");
    const paginationElementChildren = paginationElement?.children;

    const buyOrdersLinks = [];

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function openAllPageBuyOrders() {
        console.log("Abrindo todos os pedidos de compra na página...");
        let bos = document.querySelector("#bosContent");
        let buyorders = Array.from(bos.children);

        if (buyorders.length > 0) {
            buyorders.forEach((order, i) => {
                console.log(`Pedido ${i + 1}:`, order);
                // handle logic for each item
                let orderLink = order.querySelector("a").parentElement.lastElementChild.href;

                if (orderLink) {
                    buyOrdersLinks.push(orderLink);
                }
            });
        } else {
            console.error("Nenhum pedido de compra encontrado.");
        }
    }

    async function findNextPage() {
        if (currentLoop < maxLoop) {
            function getButtonIndex() {
                for (let i = 0; i < paginationElementChildren.length; i++) {
                    if (paginationElementChildren[i].textContent === currentLoop.toString()) {
                        console.log("active button found", i);
                        return i;
                    }
                }
                console.log("-1 return");
                return -1; // Return -1 if active button not found
            }

            const nextButton = paginationElementChildren[getButtonIndex() + 1].firstElementChild; // Access directly
            if (nextButton) {
                console.log(`Mudando para a página: ${currentLoop + 1}`);
                nextButton.click();
                currentLoop++;
                await delay(delayvalue); // Aguarda 1.5 segundos antes de continuar
                await openAllPageBuyOrders();
                await findNextPage(); // Chama a próxima página recursivamente
            } else {
                console.log("Botão da próxima página não encontrado.");
            }
        } else {
            console.log("Alcançou a última página ou o limite definido.");
        }
    }

    async function openAllBuyOrders() {
        newButton.disabled = true;
        runStatus.textContent = "Running";
        console.log("Iniciando o processo para abrir todos os pedidos de compra...");
        await openAllPageBuyOrders(); // Começa com a primeira página
        await findNextPage(); // Continua com a próxima página
        runStatus.textContent = "Finished";
        saveButton.disabled = false;
    }

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    document
        .querySelector(
        "#tab-history > div:nth-child(2) > div:nth-child(2) > div > div > div.card-head > h3"
    )
        .appendChild(container);

    const newButton = document.createElement("button");
    newButton.textContent = "Open All Buy Orders";
    newButton.className = "btn btn-secondary btn-sm ms-3 mt-2";
    newButton.onclick = openAllBuyOrders;
    container.appendChild(newButton);

    const input = document.createElement("input");
    input.type = "number";
    input.className = "form-control border border-start-0";
    input.style.padding = "0";
    input.style.width = "75px";
    input.style.height = "100%";
    input.min = 1;
    input.value = maxLoop;
    input.onchange = (e) => {
        maxLoop = e.target.value;
    };
    container.appendChild(input);

    const runStatus = document.createElement("span");
    runStatus.className = "text-success ms-3";
    container.appendChild(runStatus);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.disabled = true;
    saveButton.className = "btn btn-secondary btn-sm ms-3 mt-2";
    saveButton.onclick = () => {
        console.log("Saving buy orders links...");
        console.log(buyOrdersLinks);
        let blob = new Blob([buyOrdersLinks.join("\n")], {
            type: "text/plain;charset=utf-8",
        });
        saveAs(blob, "buyOrdersLinks.txt");
    };
    container.appendChild(saveButton);
})();
