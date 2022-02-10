// Storage Controller
const StorageController = (function () {


    return {
        storeElement: function (element) {
            let elements;
            if (localStorage.getItem('elements') == null) {
                elements = [],
                elements.push(element);
            } else {
                elements = JSON.parse(localStorage.getItem('elements'));
                elements.push(element);
            }
            localStorage.setItem('elements',JSON.stringify(elements));
        },
        getElements: function() {
            let elements;
            if(localStorage.getItem('elements') == null) {
                elements = [];
            } else {
                elements = JSON.parse(localStorage.getItem('elements'));
            }
            return elements;
        },
        updateElement: function(element) {
            let elements = JSON.parse(localStorage.getItem('elements'));

            elements.forEach(function(_element,index) {
                if(element.id == _element.id) {
                    elements.splice(index,1,element); 
                }
            });
            localStorage.setItem('elements',JSON.stringify(elements));
        },
        deleteElement: function(id) {
            let elements = JSON.parse(localStorage.getItem('elements'));

            elements.forEach(function(_element,index) {
                if(id == _element.id) {
                    elements.splice(index,1); 
                }
            });
            localStorage.setItem('elements',JSON.stringify(elements));
        }
    }
})();

// Element Controller
const ElementController = (function () {

    // private
    const Element = function (id, date, pair, timeframe, shortLong, entry, tp, sl, size, wl, link, reasons, results, r, profit) {
        this.id = id;
        this.date = date;
        this.pair = pair;
        this.timeframe = timeframe;
        this.shortLong = shortLong;
        this.entry = entry;
        this.tp = tp;
        this.sl = sl;
        this.size = size;
        this.r = r;
        this.profit = profit;
        this.wl = wl;
        this.link = link;
        this.reasons = reasons;
        this.results = results;
    }
    var data = {
        elements: StorageController.getElements(),
        selectedElement: null,
        totalProfit: 0,
        totalR: 0
    }

    // public
    return {
        getElements: function () {
            return data.elements;
        },
        getData: function () {
            return data;
        },
        getElementById: function (id) {
            let element = null;
            data.elements.forEach(function (_element) {
                if (_element.id == id) {
                    element = _element;
                }
            });
            return element;
        },
        setCurrentElement: function (element) {
            data.selectedElement = element;
        },
        getCurrentElement: function () {
            return data.selectedElement;
        },
        rCalculator: function (elements) {
            elements.forEach((element) => {
                let _r;
                if (element.shortLong.toUpperCase() == "L" || element.shortLong.toUpperCase() == 'LONG') {
                    _r = ((element.tp - element.entry) / (element.entry - element.sl)).toFixed(2);
                } else {
                    _r = ((element.entry - element.tp) / (element.sl - element.entry)).toFixed(2);
                }
                if (element.wl.toUpperCase() == "L" || element.wl.toUpperCase() == "LOSE") {
                    _r = -1;
                }
                element.r = parseFloat(_r);
                return element.r;
            });
        },
        profitCalculator: function (elements) {
            elements.forEach((element) => {
                let _profit;
                if (element.wl.toUpperCase() == "W" || element.wl.toUpperCase() == "WIN") {
                    if (element.shortLong.toUpperCase() == "L" || element.shortLong.toUpperCase() == "LONG") {
                        _profit = ((element.tp - element.entry) * element.size - (element.entry * element.size / 5000) - (element.tp * element.size / 2500)).toFixed(2);
                    } else {
                        _profit = ((element.entry - element.tp) * element.size - (element.entry * element.size / 5000) - (element.tp * element.size / 2500)).toFixed(2);
                    }
                } else {
                    if (element.shortLong.toUpperCase() == "S" || element.shortLong.toUpperCase() == "SHORT") {
                        _profit = ((element.entry - element.sl) * element.size - (element.entry * element.size / 5000) - (element.sl * element.size / 2500)).toFixed(2);
                    } else {
                        _profit = ((element.sl - element.entry) * element.size - (element.entry * element.size / 5000) - (element.sl * element.size / 2500)).toFixed(2);
                    }
                }
                element.profit = parseFloat(_profit);
                return element.profit;
            });
        },
        addElement: function (date, pair, timeframe, shortLong, entry, tp, sl, size, wl, link, reasons, results, r, profit) {
            let id;
            if (data.elements.length > 0) {
                id = data.elements[data.elements.length - 1].id + 1;
            } else {
                id = 0;
            }
            const newElement = new Element(id, date, pair, timeframe, shortLong, parseFloat(entry), parseFloat(tp), parseFloat(sl), parseFloat(size), wl, link, reasons, results, parseFloat(r), parseFloat(profit));
            data.elements.push(newElement);
            return newElement;
        },
        updateElement: function (date, pair, timeframe, shortLong, entry, tp, sl, size, wl, link, reasons, results, r, profit) {
            let element = null;

            data.elements.forEach(function (_element) {
                if (_element.id == data.selectedElement.id) {
                    _element.date = date;
                    _element.pair = pair;
                    _element.timeframe = timeframe;
                    _element.shortLong = shortLong;
                    _element.entry = entry;
                    _element.tp = tp;
                    _element.sl = sl;
                    _element.size = size;
                    _element.wl = wl;
                    _element.link = link;
                    _element.reasons = reasons;
                    _element.results = results;
                    _element.r = parseFloat(r);
                    _element.profit = parseFloat(profit);
                    element = _element;
                }
            });
            return element;
        },
        deleteElement: function (element) {
            data.elements.forEach(function (_element, index) {
                if (_element.id == element.id) {
                    data.elements.splice(index, 1);
                }
            });
        },
        getTotalR: function () {
            let _totalR = 0;
            data.elements.forEach(function (element) {
                _totalR += element.r;
            });
            data.totalR = _totalR.toFixed(2);
            return data.totalR
        },
        getTotalProfit: function () {
            let _totalProfit = 0;
            data.elements.forEach(function (element) {
                _totalProfit += element.profit;
            });
            data.totalProfit = _totalProfit.toFixed(2);

            return data.totalProfit;
        }
    }
})();

// UI Controller
const UIController = (function () {

    const Selectors = {
        elementList: "#item-list",
        elementListItems: "#item-list tr",
        addButton: "#addBtn",
        updateButton: "#updateBtn",
        cancelButton: "#cancelBtn",
        deleteButton: "#deleteBtn",
        elementCard: "#elementCard",
        elementDate: "#date",
        elementPair: "#pair",
        elementTimeframe: "#timeframe",
        elementShortLong: "#shortLong",
        elementEntry: "#entry",
        elementTP: "#tp",
        elementSL: "#sl",
        elementSize: "#size",
        elementWL: "#wl",
        elementLink: "#link",
        elementReasons: "#reasons",
        elementResults: "#results",
        totalR: '#totalR',
        totalProfit: '#totalProfit'

    }


    return {
        createElementList: function (elements) {
            let html = ``;

            elements.forEach(element => {

                let wL;
                if (element.wl.toUpperCase() == "W" || element.wl.toUpperCase() == "WIN") {
                    wL = "fas fa-check text-success";
                } else {
                    wL = "fas fa-times text-danger";
                }
                let shortLongFontAwesome;
                if (element.shortLong.toUpperCase() == "L" || element.shortLong.toUpperCase() == "LONG") {
                    shortLongFontAwesome = "fas fa-arrow-alt-circle-up text-success";
                } else {
                    shortLongFontAwesome = "fas fa-arrow-alt-circle-down text-danger";
                }

                html +=
                    `
                <tr>
                        <td>${element.id}</td>
                        <td>${element.date}</td>
                        <td>${element.pair}</td>
                        <td>${element.timeframe}</td>
                        <td><a><i class="${shortLongFontAwesome}"></i></a></td>
                        <td>${element.entry}</td>
                        <td>${element.tp}</td>
                        <td>${element.sl}</td>
                        <td>${element.size}</td>
                        <td>${element.r}</td>
                        <td>${element.profit}</td>
                        <td><a href="#"<i class="${wL}"></i></a></td>
                        <td><a href="${element.link}" target="_blink"><i class="fas fa-link"></i></a></td>
                        <td>${element.reasons}</td>
                        <td>${element.results}</td>
                        <td class="text-right">
                            <i class="far fa-edit editElement"></i>
                        </td>
                    </tr>
                `;
            });
            document.querySelector(Selectors.elementList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },
        addElement: function (element) {

            document.querySelector(Selectors.elementCard).style.display = 'block';

            let wL;
            if (element.wl.toUpperCase() == "W" || element.wl.toUpperCase() == "WIN") {
                wL = "fas fa-check text-success";
            } else {
                wL = "fas fa-times text-danger";
            }
            let shortLongFontAwesome;
            if (element.shortLong.toUpperCase() == "L" || element.shortLong.toUpperCase() == "LONG") {
                shortLongFontAwesome = "fas fa-arrow-alt-circle-up text-success";
            } else {
                shortLongFontAwesome = "fas fa-arrow-alt-circle-down text-danger";
            }

            var item =
                `
                <tr>
                    <td>${element.id}</td>
                    <td>${element.date}</td>
                    <td>${element.pair}</td>
                    <td>${element.timeframe}</td>
                    <td><a><i class="${shortLongFontAwesome}"></i></a></td>
                    <td>${element.entry}</td>
                    <td>${element.tp}</td>
                    <td>${element.sl}</td>
                    <td>${element.size}</td>
                    <td>${element.r}</td>
                    <td>${element.profit}</td>
                    <td><a href="#"<i class="${wL}"></i></a></td>
                    <td><a href="${element.link}" target="_blink"><i class="fas fa-link"></i></a></td>
                    <td>${element.reasons}</td>
                    <td>${element.results}</td>
                    <td>
                        <i class="far fa-edit editElement"></i>
                    </td>
                </tr>
            `;
            document.querySelector(Selectors.elementList).innerHTML += item;
        },
        updateElement: function (element) {
            let wL;
            if (element.wl.toUpperCase() == "W" || element.wl.toUpperCase() == "WIN") {
                wL = "fas fa-check text-success";
            } else {
                wL = "fas fa-times text-danger";
            }
            let shortLongFontAwesome;
            if (element.shortLong.toUpperCase() == "L" || element.shortLong.toUpperCase() == "LONG") {
                shortLongFontAwesome = "fas fa-arrow-alt-circle-up text-success";
            } else {
                shortLongFontAwesome = "fas fa-arrow-alt-circle-down text-danger";
            }

            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.elementListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = element.date;
                    item.children[2].textContent = element.pair;
                    item.children[3].textContent = element.timeframe;
                    item.children[4].innerHTML = `<td><a><i class="${shortLongFontAwesome}"></i></a></td>`;
                    item.children[5].textContent = element.entry;
                    item.children[6].textContent = element.tp;
                    item.children[7].textContent = element.sl;
                    item.children[8].textContent = element.size;
                    item.children[9].textContent = element.r;
                    item.children[10].textContent = element.profit;
                    item.children[11].innerHTML = `<td><a href="#"<i class="${wL}"></i></a></td>`;
                    item.children[12].innerHTML = `<td><a href="${element.link}" target="_blink"><i class="fas fa-link"></i></a></td>`;
                    item.children[13].textContent = element.reasons;
                    item.children[14].textContent = element.results;
                    updatedItem = item;
                }
            });

            return updatedItem;
        },
        clearInputs: function () {
            document.querySelector(Selectors.elementDate).value = '';
            document.querySelector(Selectors.elementPair).value = '';
            document.querySelector(Selectors.elementTimeframe).value = '';
            document.querySelector(Selectors.elementShortLong).value = '';
            document.querySelector(Selectors.elementEntry).value = '';
            document.querySelector(Selectors.elementTP).value = '';
            document.querySelector(Selectors.elementSL).value = '';
            document.querySelector(Selectors.elementSize).value = '';
            document.querySelector(Selectors.elementWL).value = '';
            document.querySelector(Selectors.elementLink).value = '';
            document.querySelector(Selectors.elementReasons).value = '';
            document.querySelector(Selectors.elementResults).value = '';
        },
        clearWarnings: function () {
            const items = document.querySelectorAll(Selectors.elementListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning');
                }
            });
        },
        hideCard: function () {
            document.querySelector(Selectors.elementCard).style.display = 'none';
        },
        showTotal: function (totalR, totalProfit) {
            document.querySelector(Selectors.totalR).textContent = totalR;
            document.querySelector(Selectors.totalR).textContent += "R";

            document.querySelector(Selectors.totalProfit).textContent = totalProfit;
            document.querySelector(Selectors.totalProfit).textContent += "$";

        },
        addElementToForm: function () {
            const selectedElement = ElementController.getCurrentElement();
            document.querySelector(Selectors.elementDate).value = selectedElement.date;
            document.querySelector(Selectors.elementPair).value = selectedElement.pair;
            document.querySelector(Selectors.elementTimeframe).value = selectedElement.timeframe;
            document.querySelector(Selectors.elementShortLong).value = selectedElement.shortLong;
            document.querySelector(Selectors.elementEntry).value = selectedElement.entry;
            document.querySelector(Selectors.elementTP).value = selectedElement.tp;
            document.querySelector(Selectors.elementSL).value = selectedElement.sl;
            document.querySelector(Selectors.elementSize).value = selectedElement.size;
            document.querySelector(Selectors.elementWL).value = selectedElement.wl;
            document.querySelector(Selectors.elementLink).value = selectedElement.link;
            document.querySelector(Selectors.elementReasons).value = selectedElement.reasons;
            document.querySelector(Selectors.elementResults).value = selectedElement.results;
        },
        deleteElement: function () {
            let items = document.querySelectorAll(Selectors.elementListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            });
        },
        addingState: function () {
            UIController.clearWarnings();
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },
        editState: function (tr) {

            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
        }
    }
})();

// App Controller
const App = (function (ElementCtrl, UICtrl, StorageCtrl) {

    const UISelectors = UICtrl.getSelectors();

    // load Event Listeners
    const loadEventListeners = function () {
        // add element event
        document.querySelector(UISelectors.addButton).addEventListener('click', elementAddSubmit);
        // edit element click
        document.querySelector(UISelectors.elementList).addEventListener('click', elementEditClick);
        // edit element submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', editElementSubmit);
        // cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate);
        // delete element submit
        document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteElementSubmit);

    }
    const elementAddSubmit = function (e) {

        const elementDate = document.querySelector(UISelectors.elementDate).value;
        const elementPair = document.querySelector(UISelectors.elementPair).value;
        const elementTimeframe = document.querySelector(UISelectors.elementTimeframe).value;
        const elementShortLong = document.querySelector(UISelectors.elementShortLong).value;
        const elementEntry = document.querySelector(UISelectors.elementEntry).value;
        const elementTP = document.querySelector(UISelectors.elementTP).value;
        const elementSL = document.querySelector(UISelectors.elementSL).value;
        const elementSize = document.querySelector(UISelectors.elementSize).value;
        const elementWL = document.querySelector(UISelectors.elementWL).value;
        const elementLink = document.querySelector(UISelectors.elementLink).value;
        const elementReasons = document.querySelector(UISelectors.elementReasons).value;
        const elementResults = document.querySelector(UISelectors.elementResults).value;
        var r;
        if (elementShortLong.toUpperCase() == "L" || elementShortLong.toUpperCase() == 'LONG') {
            if (elementWL.toUpperCase() == "L" || elementWL.toUpperCase() == "LOSE") {
                r = -1;
            } else {
                r = ((elementTP - elementEntry) / (elementEntry - elementSL)).toFixed(2);
            }
        } else {
            if (elementWL.toUpperCase() == "L" || elementWL.toUpperCase() == "LOSE") {
                r = -1;
            } else {
                r = ((elementEntry - elementTP) / (elementSL - elementEntry)).toFixed(2);
            }
        }
        var profit;
        if (elementWL.toUpperCase() == "W" || elementWL.toUpperCase() == "WIN") {
            if (elementShortLong.toUpperCase() == "L" || elementShortLong.toUpperCase() == "LONG") {
                profit = ((elementTP - elementEntry) * elementSize - (elementEntry * elementSize / 5000) - (elementTP * elementSize / 2500)).toFixed(2);
            } else {
                profit = ((elementEntry - elementTP) * elementSize - (elementEntry * elementSize / 5000) - (elementTP * elementSize / 2500)).toFixed(2);
            }
        } else {
            if (elementShortLong.toUpperCase() == "S" || elementShortLong.toUpperCase() == "SHORT") {
                profit = ((elementEntry - elementSL) * elementSize - (elementEntry * elementSize / 5000) - (elementSL * elementSize / 2500)).toFixed(2);
            } else {
                profit = ((elementSL - elementEntry) * elementSize - (elementEntry * elementSize / 5000) - (elementSL * elementSize / 2500)).toFixed(2);
            }
        }
        if (elementPair !== '' && elementShortLong !== '' && elementEntry !== '' && elementTP !== '' && elementSL !== '' && elementSize !== '' && elementWL !== '') {
            const newElement = ElementCtrl.addElement(elementDate, elementPair, elementTimeframe, elementShortLong, elementEntry, elementTP, elementSL, elementSize, elementWL, elementLink, elementReasons, elementResults, r, profit);
            UIController.addElement(newElement);
            //add element to LS
            StorageCtrl.storeElement(newElement);
            const totalR = ElementCtrl.getTotalR();
            const totalProfit = ElementCtrl.getTotalProfit();
            UICtrl.showTotal(totalR, totalProfit);
            UIController.clearInputs();
        } else {
            alert("YOU MUST FILL THE PAIR, SHORT/LONG, ENTRY, TP, SL, SIZE, WIN/LOSE");
        }
        e.preventDefault();
    }
    const elementEditClick = function (e) {

        if (e.target.classList.contains('editElement')) {
            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling
                .previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            // get selected element
            const element = ElementCtrl.getElementById(id);
            // set current element
            ElementCtrl.setCurrentElement(element);
            UICtrl.clearWarnings();
            // add element to UI
            UICtrl.addElementToForm();
            UICtrl.editState(e.target.parentNode.parentNode);
        }
        e.preventDefault();
    }
    const editElementSubmit = function (e) {

        const elementDate = document.querySelector(UISelectors.elementDate).value;
        const elementPair = document.querySelector(UISelectors.elementPair).value;
        const elementTimeframe = document.querySelector(UISelectors.elementTimeframe).value;
        const elementShortLong = document.querySelector(UISelectors.elementShortLong).value;
        const elementEntry = document.querySelector(UISelectors.elementEntry).value;
        const elementTP = document.querySelector(UISelectors.elementTP).value;
        const elementSL = document.querySelector(UISelectors.elementSL).value;
        const elementSize = document.querySelector(UISelectors.elementSize).value;
        const elementWL = document.querySelector(UISelectors.elementWL).value;
        const elementLink = document.querySelector(UISelectors.elementLink).value;
        const elementReasons = document.querySelector(UISelectors.elementReasons).value;
        const elementResults = document.querySelector(UISelectors.elementResults).value;
        var r;
        if (elementShortLong.toUpperCase() == "L" || elementShortLong.toUpperCase() == 'LONG') {
            if (elementWL.toUpperCase() == "L" || elementWL.toUpperCase() == "LOSE") {
                r = -1;
            } else {
                r = ((elementTP - elementEntry) / (elementEntry - elementSL)).toFixed(2);
            }
        } else {
            if (elementWL.toUpperCase() == "L" || elementWL.toUpperCase() == "LOSE") {
                r = -1;
            } else {
                r = ((elementEntry - elementTP) / (elementSL - elementEntry)).toFixed(2);
            }
        }
        var profit;
        if (elementWL.toUpperCase() == "W" || elementWL.toUpperCase() == "WIN") {
            if (elementShortLong.toUpperCase() == "L" || elementShortLong.toUpperCase() == "LONG") {
                profit = ((elementTP - elementEntry) * elementSize - (elementEntry * elementSize / 5000) - (elementTP * elementSize / 2500)).toFixed(2);
            } else {
                profit = ((elementEntry - elementTP) * elementSize - (elementEntry * elementSize / 5000) - (elementTP * elementSize / 2500)).toFixed(2);
            }
        } else {
            if (elementShortLong.toUpperCase() == "S" || elementShortLong.toUpperCase() == "SHORT") {
                profit = ((elementEntry - elementSL) * elementSize - (elementEntry * elementSize / 5000) - (elementSL * elementSize / 2500)).toFixed(2);
            } else {
                profit = ((elementSL - elementEntry) * elementSize - (elementEntry * elementSize / 5000) - (elementSL * elementSize / 2500)).toFixed(2);
            }
        }
        if (elementPair !== '' && elementShortLong !== '' && elementEntry !== '' && elementTP !== '' && elementSL !== '' && elementSize !== '' && elementWL !== '') {
            //update element
            const updatedElement = ElementCtrl.updateElement(elementDate, elementPair, elementTimeframe, elementShortLong, elementEntry, elementTP, elementSL, elementSize, elementWL, elementLink, elementReasons, elementResults, r, profit);
            let item = UICtrl.updateElement(updatedElement);
            const totalR = ElementCtrl.getTotalR();
            const totalProfit = ElementCtrl.getTotalProfit();
            UICtrl.showTotal(totalR, totalProfit);
            // update storage
            StorageCtrl.updateElement(updatedElement);
            UICtrl.addingState();
        }

        e.preventDefault();
    }
    const cancelUpdate = function (e) {

        UICtrl.addingState();
        UICtrl.clearWarnings();

        e.preventDefault();
    }
    const deleteElementSubmit = function (e) {
        // get selected element
        const selectedElement = ElementCtrl.getCurrentElement();
        // delete element
        ElementCtrl.deleteElement(selectedElement);
        // delete ui
        UICtrl.deleteElement();
        const totalR = ElementCtrl.getTotalR();
        const totalProfit = ElementCtrl.getTotalProfit();
        UICtrl.showTotal(totalR, totalProfit);
        // delete from ls
        StorageCtrl.deleteElement(selectedElement.id);
        UICtrl.addingState();
        if (totalProfit == 0) {
            UICtrl.hideCard();
        }
        e.preventDefault();
    }

    return {
        init: function () {
            console.log("Starting App..");
            UICtrl.addingState();
            const elements = ElementCtrl.getElements();
            if (elements.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createElementList(elements);
                ElementCtrl.rCalculator(elements);
                ElementCtrl.profitCalculator(elements);
                const totalR = ElementCtrl.getTotalR();
                const totalProfit = ElementCtrl.getTotalProfit();
                UICtrl.showTotal(totalR, totalProfit);
            }
            loadEventListeners();

        }
    }
})(ElementController, UIController, StorageController)

App.init();