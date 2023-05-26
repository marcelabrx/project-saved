// Getting elements from DOM
const $ = (selector) => document.querySelector(selector)

// Show or hide handlers
const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")
const cleanContainer = (selector) => $(selector).innerHTML = ""

const showElements = (selectors) => {
    for (const selector of selectors){
        $(selector).classList.remove("hidden")
    }
}

const hideElements = (selectors) => {
    for (const selector of selectors){
        $(selector).classList.add("hidden")
    }
}

// LocalStorage Handlers
const getInfo = (key) => JSON.parse(localStorage.getItem(key))
const setInfo = (key, array) => localStorage.setItem(key, JSON.stringify(array))


// Random id generator
const randomId = () => self.crypto.randomUUID()

//Default categories
const defaultCategories = [
    {
        id: randomId(),
        categoryName: "Comida"
    },
    {
        id: randomId(),
        categoryName: "Servicios"
    },
    {
        id: randomId(),
        categoryName: "Salidas"
    },
    {
        id: randomId(),
        categoryName: "Educación"
    },
    {
        id: randomId(),
        categoryName: "Transporte"
    },
    {
        id: randomId(),
        categoryName: "Trabajo"
    },
]

//Getting Info operations
const allOperations = getInfo("operations") || []
const allCategories = getInfo("categories") || defaultCategories

//Render functions
const renderOperations = (operations) => {
    cleanContainer("#operations-table")
    if (operations.length){
        hideElement("#any-operation")
        showElements(["#new-operation", "#table"])
        for (const {id, description, category, date, amount} of operations){
            const categorySelected = getInfo("categories").find(cat => cat.id === category)
            $("#operations-table").innerHTML += `
            <tr class="flex flex-wrap justify-between md:flex-nowrap md:items-center border border-purple-100 odd:bg-white even:bg-purple-50">
                <td class="w-1/2 px-4 py-2 md:w-1/5 md:flex md:justify-start">${description}</td>
                <td class="w-1/2 px-4 py-2 flex items-end justify-end text-purple-500 md:w-1/5 md:flex md:justify-start">${categorySelected.categoryName}</td>
                <td class="px-4 py-2 hidden md:w-1/5 md:flex md:items-center md:justify-start">${date}</td>
                <td class="w-1/2 px-4 py-2 text-3xl md:w-1/5 md:text-base md:flex md:justify-start">${amount}</td>
                <td class="w-1/2 px-4 py-2 flex items-center justify-end md:w-1/5 md:flex md:justify-start">
                    <button onclick="editOperationForm('${id}')"><i class="fa-solid fa-pen-to-square mr-2 text-green-600"></i></button> 
                    <button data-id="${id}" onclick="modalToDeleteOperations('${id}')"><i class="btn-delete fa-solid fa-trash text-red-600"></i></button>
                </td>                            
            </tr>
            `
        }
    }else {
        showElement("#any-operation")
    }
}


const renderCategories = (categories) => {
    cleanContainer("#categories-section")
    for (const {id, categoryName} of  categories) { 
        $("#categories-section").innerHTML += `
        <article class="flex justify-between p-4">
            <p class="p-2 w-fit rounded-lg bg-purple-50 text-purple-500" data-id="${id}">${categoryName}</p>
            <div>
                <button><i class="btn-edit-categories fa-solid fa-pen-to-square mr-2 text-green-600" onclick=editCategoriesForm("${id}")></i></button>
                <button><i class="btn-delete-categories fa-solid fa-trash text-red-600" onclick=modalToDeleteCategories("${id}")></i></button>
            </div>
        </article>
        `
    }
}

const renderCategoriesOptions = (categories) => {
    for (const {id, categoryName} of  categories) { 
        $("#categories-select").innerHTML += `
        <option value="${id}">${categoryName}</option>
    `
    $("#category").innerHTML +=`
    <option value="${id}">${categoryName}</option>
    `
    }
}


//Save data operations

const saveCategoriesData = () => {
    return{
        id : randomId(),
        categoryName: $("#input-add-categories").value
    }
}

const saveEditedCategoriesData = () => {
    return{
        id : randomId(),
        categoryName: $("#input-edit-categories").value
    }
}


const validateFormOperations = () => {
    const date = $("#date").value
    const description = $("#description").value.trim()
    const amount = $("#amount").valueAsNumber 

    if (description === "") {
        showElement(".description-error")
        $("#description").classList.add("border-red-600")
    } else {
        hideElement(".description-error")
        $("#description").classList.remove("border-red-600")
    }

    if (isNaN(amount)) {
        showElement(".amount-error")
        $("#amount").classList.add("border-red-600")
    } else {
        hideElement(".amount-error")
        $("#amount").classList.remove("border-red-600")
    }
    
    if(date === "") {
        showElement(".date-error")
        $("#date").classList.add("border-red-600")
    } else {
        hideElement(".date-error")
        $("#date").classList.remove("border-red-600")
    }
    return description !== "" && !isNaN(amount) && date !== ""
}

const saveOperationsData = (operationId) => {
    return {
        id: operationId ? operationId : randomId(), 
        description: $("#description").value,
        amount: $("#amount").valueAsNumber,
        type: $("#type").value,
        category: $("#category").value,
        date: $("#date").value,
    }
}

//Add data functions
const sendNewData = (key, callback) => {
    const currentData = getInfo(key)
    const newData = callback()
    currentData.push(newData)
    setInfo(key, currentData)
}

//modifying funtions  
const deleteData = (id, keys) => {
    const currentData = getInfo(keys).filter(key => key.id != id)
    setInfo(keys, currentData)
}


//delete operations and categories
const modalToDeleteOperations = (id) => {
    showElement("#modal-window")
    const selectedOperation = getInfo("operations").find(operation => operation.id === id)
    $(".modal-text").innerHTML = selectedOperation.description
    $("#modal-delete").setAttribute("data-id", id)
    $("#modal-delete").addEventListener("click", () => {
        deleteData(id, "operations")
        window.location.reload()
    })
    renderOperations(getInfo("operations"))
}

const modalToDeleteCategories = (id) => {
    showElement("#modal-window")
    $("#modal-delete").setAttribute("data-id",id)
    const selectedCategory= getInfo("categories").find(category => category.id === id)
    $(".modal-text").innerText= selectedCategory.categoryName
    $("#modal-delete").addEventListener("click", () => {
        deleteData(id, "categories")
        window.location.reload()
    })
    renderCategories(getInfo("categories"))
}

const editOperation = () => {
    const operationId = $("#btn-edit-operation").getAttribute("data-id")
    const editedOperations = getInfo("operations").map(operation => {
        if (operation.id === operationId){
            return saveOperationsData()
        }
        return operation
    })
    setInfo("operations", editedOperations)
}

const editOperationForm = (id) => {
    showElements(["#operations-form", "#btn-edit-operation", ".edit-operation-title"])
    hideElements([".new-operation-title", "#btn-add-operation", "#balance-section", "#balance-card-left", "#balance-card-right", "#category-section"])
    $("#btn-edit-operation").setAttribute("data-id", id)
    const editSelected = getInfo("operations").find(operation => operation.id === id)
    $("#description").value = editSelected.description
    $("#amount").valueAsNumber = editSelected.amount
    $("#type").value = editSelected.type
    $("#category").value = editSelected.category
    $("#date").value = editSelected.date
}

const editCategory = () => {
    const categoryId= $("#btn-confirm-add").getAttribute("data-id")
    const editedCategory= getInfo("categories").map(category => {
        if(category.id === categoryId){
            return saveEditedCategoriesData(categoryId)
        }
        return category
    })
    setInfo("categories", editedCategory)
}

const editCategoriesForm = (id) => {
    showElement("#edit-categories")
    hideElement("#category-section")
    $("#btn-confirm-add").setAttribute("data-id", id)
    const categorySelected = getInfo("categories").find(category => category.id === id)
    $("#input-edit-categories").value = categorySelected.categoryName
}

/*
  ************** REPORTS SECTION  **************
*/

const renderReports = () => {
    const currentOperations = getInfo("operations")
    const allCategories = getInfo("categories")
    let hasProfit = false
    let hasExpenditure = false
    
    for (const { type } of currentOperations) {
        if (type === "Ganancia") {
            hasProfit = true
        } else if (type === "Gasto") {
            hasExpenditure = true
        }
    }

    if (hasProfit && hasExpenditure) {
        summaryByCategories(currentOperations, allCategories)
        summaryByMonths(currentOperations)
        totalsForCategory(currentOperations, allCategories)

    } else {
        showElement(".any-reports");
        hideElement("#reports-table");
    }
}

const getBalance = (operations) => {
    let profits = 0
    let expenses = 0 
    let total = 0 
    
    for (const operation of operations){
        const { type, amount } = operation
        if (type === "Ganancia"){
            profits += amount
            total += amount
        }

        if (type === "Gasto" ){
            expenses += amount
            total -= amount
        }
        
    }
 
    return {
        profits: profits,
        expenses: expenses,
        total: total
    }
}

const generateBalance = (operations) => {
    const { profits, expenses, total } = getBalance(operations)
    
    $("#balance-profits").innerHTML = `+$${profits}`
    $("#balance-expenses").innerHTML = `-$${expenses}`

    let symbol = ""
    let className = "" 
    if (total > 0){
        className = "text-green-500"
        symbol = "+"
    } else if (total < 0) {
        className = "text-red-600"
        symbol = "-"
    } else {
        className = "text-gray-900"
    }
    $("#total-balance").innerHTML = `
    <span class="font-bold ${className}">${symbol}$${(Math.abs(total))}</span>
    `
}

const summaryByCategories = (operations, categories) => {
    
    const categoryTotals = {}

    for (const { category, amount, type } of operations) {
        
        if (!categoryTotals[category]) {
            categoryTotals[category] = {
            profits: 0,
            expenses: 0,
            }
        }
        if (type === "Ganancia") {
            categoryTotals[category].profits += amount;
        } else if (type === "Gasto") {
            categoryTotals[category].expenses += amount;
        }
    }
    
    let maxCategoryProfits = ""
    let maxAmountProfits = 0
    let maxCategoryExpenses = ""
    let maxAmountExpenses = 0
    let maxCategoryBalance = ""
    let maxAmountBalance = 0

    for (const category in categoryTotals) {
        const { profits, expenses } = categoryTotals[category]
        const balance = profits - expenses
        
        if (profits > maxAmountProfits) {
            maxAmountProfits = profits
            maxCategoryProfits = category
        }
        if (expenses > maxAmountExpenses){
            maxAmountExpenses = expenses
            maxCategoryExpenses = category
        }
        if (balance > maxAmountBalance){
            maxAmountBalance = balance
            maxCategoryBalance = category
        }
    }

    for (const { id, categoryName } of categories){
        if (id === maxCategoryProfits){
            $("#highest-category-profits").innerHTML = categoryName 
            $("#total-hg-category-profits").innerHTML = `+$${maxAmountProfits}`  
        }
        if (id === maxCategoryExpenses) {
            $("#highest-category-expenses").innerHTML = categoryName
            $("#total-hg-category-expenses").innerHTML = `-$${maxAmountExpenses}`
        }
        if (id === maxCategoryBalance){
            $("#highest-category-balance").innerHTML = categoryName
            $("#total-hg-category-balance").innerHTML = `$${maxAmountBalance}`
        }
    }
   
}

const summaryByMonths = (operations) => {

    const monthTotals = {}

    for (const { date, type, amount } of operations) {
        const currentDate = new Date(date)
        const monthYear = `${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`

        if(!monthTotals[monthYear]){
            monthTotals[monthYear] = {
                profits: 0,
                expenses: 0, 
            }
        }
        if (type === "Ganancia"){
            monthTotals[monthYear].profits += amount
        } else if (type === "Gasto") {
            monthTotals[monthYear].expenses += amount
        }
    }
    
    let maxMonthProfits = ""
    let maxAmountProfits = 0
    let maxMonthExpenses = ""
    let maxAmountExpenses = 0

    for (const monthYear in monthTotals) {
        const { profits, expenses } = monthTotals[monthYear]

        if (profits > maxAmountProfits) {
            maxAmountProfits = profits
            maxMonthProfits = monthYear
        }
        if (expenses > maxAmountExpenses) {
            maxAmountExpenses = expenses
            maxMonthExpenses = monthYear
        }
    }
    $("#month-highest-profit").innerHTML = maxMonthProfits
    $("#total-month-hg-profit").innerHTML = `+$${maxAmountProfits}`
    $("#month-highest-expenditure").innerHTML = maxMonthExpenses
    $("#total-month-hg-expenditure").innerHTML = `-$${maxAmountExpenses}`
}

const totalsForCategory = (operations, categories) => {

    const balanceByCategory = {}
    
    for (const { category, type, amount } of operations) {
        const categoryFiltered = categories.find(cat => cat.id === category)

        if (categoryFiltered) {
            const { categoryName } = categoryFiltered

            if (!balanceByCategory[categoryName]) {
                balanceByCategory[categoryName] = {
                    profits: 0,
                    expenses: 0,
                    total: 0
                }
            }

            if (type === "Ganancia") {
                balanceByCategory[categoryName].profits += amount
                balanceByCategory[categoryName].total += amount
            } else if (type === "Gasto") {
                balanceByCategory[categoryName].expenses += amount
                balanceByCategory[categoryName].total -= amount
            }
        }
    }

    return (balanceByCategory)
}

const generateTotalsForCategory = (operations, categories) => {
    const balanceByCategory = totalsForCategory(operations, categories)
    
    let tableContent = cleanContainer("#totals-category")
    for (const categoryName in balanceByCategory) {
        const { profits, expenses, total } = balanceByCategory[categoryName]
        
        const tableRow = `
            <tr class="flex justify-between items-center">
                <td class="w-1/5 flex justify-start p-4"><span class="px-2 py-1 rounded-lg bg-purple-50 text-purple-500">${categoryName}</span></td>
                <td class="w-1/5 flex justify-end p-4 text-green-600">$${profits}</td>
                <td class="w-1/5 flex justify-end p-4 text-red-600">$${expenses}</td>
                <td class="w-1/5 flex justify-end p-4">$${total}</td>
            </tr>
            
        `
        tableContent += tableRow
    }
    $("#totals-category").innerHTML += tableContent
}

const totalsPerMonth = () => {

}


const initializeApp = () => { 
    setInfo("operations", allOperations)
    setInfo("categories", allCategories)
    renderOperations(allOperations)
    renderCategories(allCategories)
    renderCategoriesOptions(allCategories)
    getBalance(allOperations)
    generateBalance(allOperations)
    generateTotalsForCategory(allOperations, allCategories)
    renderReports()

    const home = () => {
        showElements(["#balance-section", "#balance-card-left", "#balance-card-right"])
        hideElements(["#category-section", "#reports-section", "#operations-form"])
    }

    $("#title-home").addEventListener("click", () => {
        home()
        renderOperations(getInfo("operations"))
    })

    // btn balance 
    $("#balance-btn").addEventListener("click", () => {
        home()
        renderOperations(getInfo("operations")) 
        renderCategories(getInfo("categories"))
    })

    //btn categorías
    $("#category-btn").addEventListener("click", () => {
        showElement("#category-section")
        hideElements(["#balance-section", "#reports-section", "#balance-card-left", "#balance-card-right", "#new-operation", "#operations-form"]) 
    })

    //btn reportes
    $("#reports-btn").addEventListener("click", () => {
        renderReports()
        showElement("#reports-section")
        hideElements(["#category-section", "#balance-section", "#balance-card-left", "#balance-card-right", "#new-operation", "#operations-form"])
    })

    //btn succesfull alert
    $("#close-succesfull-alert").addEventListener("click", () => {
        hideElement("#succesfull-alert")
    })

    // btn add new operation
    $("#btn-new-operation").addEventListener("click", () => {
        showElement("#operations-form")
        hideElements(["#category-section", "#balance-section", "#reports-section", "#balance-card-left", "#balance-card-right"])        
    })

    //btn add operation 
    $("#btn-add-operation").addEventListener("click", (e) => {
        e.preventDefault()
        if (validateFormOperations()) {
            sendNewData("operations", saveOperationsData)
            renderOperations(getInfo("operations"))
            renderCategoriesOptions(getInfo("operations"))
            renderCategories(getInfo("categories"))
            getBalance(getInfo("operations"))
            generateBalance(getInfo("operations"))
            $("#form").reset()
            showElements(["#new-operation", "#table", "#succesfull-alert"]) 
            home()
        }
    })

    //btn edit operation 
    $("#btn-edit-operation").addEventListener("click", (e) => {
        e.preventDefault()
        if (validateFormOperations()) {
            editOperation()
            showElements(["#new-operation", "#table"]) 
            renderOperations(getInfo("operations"))
            renderCategories(getInfo("categories"))
            getBalance(getInfo("operations"))
            generateBalance(getInfo("operations"))
            home()
        }
        
    })

    //btn cancel operation 
    $("#btn-cancel-operation").addEventListener("click",(e) => {
        e.preventDefault()
        renderOperations(getInfo("operations"))
        showElements(["#new-operation", "#table"]) 
        home()
    })
    
    //input only accepts numbers
    $("#amount").addEventListener("input", (e) => {
        const value = e.target.valueAsNumber
        if (isNaN(value)) {
            $("#amount").value = ""
        }
    })

    //mobile - open menu
    $(".fa-bars").addEventListener("click", () => {
        showElements([".fa-xmark", "#options-menu"])
        hideElement(".fa-bars")
    })
    // mobile - close menu
    $(".fa-xmark").addEventListener("click", () => {
        showElement(".fa-bars")
        hideElements([".fa-xmark", "#options-menu"])
    })

    //filters panel 
    $("#btn-hide-filters").addEventListener("click", (e) => {
        e.preventDefault()
        showElement("#btn-show-filters")
        hideElements(["#filters-panel", "#btn-hide-filters"])
    })
      
    $("#btn-show-filters").addEventListener("click", (e) => {
        e.preventDefault()
        showElements(["#filters-panel", "#btn-hide-filters"])
        hideElement("#btn-show-filters")
    })

    $("#categories-select").addEventListener("input", (e) => {
        const categoryId = e.target.value
        const currentsOperations = getInfo("operations")
        if (!categoryId) {
            renderOperations("currentsOperations")
        } else {
            const filteredOperations = currentsOperations.filter(operation => operation.category === categoryId)
            renderOperations(filteredOperations) 
        }    
    })

    //profits / expenses selector
    $("#select-panel").addEventListener("click", () => {
        const selectPanel = $("#select-panel").value
        showElement("#new-operation")
        hideElement("#any-operation")
    })

    //section categorias
    $("#btn-add-categories").addEventListener("click", () => {
        sendNewData("categories", saveCategoriesData)
        renderCategories(getInfo("categories"))
        renderCategoriesOptions(getInfo("categories"))
        showElement("#succesfull-alert") 
    })
    
    //section category edition
    $("#btn-cancel-add").addEventListener("click", () => {
        hideElement("#edit-categories")
        showElement("#category-section")
    })
    
    $("#btn-confirm-add").addEventListener("click", () => {
        editCategory()
        hideElement("#edit-categories")
        showElement("#category-section")
        renderCategories(getInfo("categories"))
    })

    //modal-window buttons
    $("#modal-cancel").addEventListener("click", () =>{
        hideElement("#modal-window")
    })

    $("#modal-delete").addEventListener("click", () =>{
        hideElement("#modal-window")
    })

    

}
window.addEventListener("load", initializeApp)