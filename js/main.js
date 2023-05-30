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
    if (operations.length) {
        hideElement("#any-operation")
        showElements(["#new-operation", "#table"])
        for (const {id, description, category, date, amount, type } of operations){
            
            let className = type === "Ganancia" ? "text-green-500" : "text-red-600"
            let symbol = type === "Ganancia" ? "+" : "-"
            
            const categorySelected = getInfo("categories").find(cat => cat.id === category)

            $("#operations-table").innerHTML += `
            <tr class="flex flex-wrap justify-between md:flex-nowrap md:items-center border border-purple-100 odd:bg-white even:bg-purple-50">
                <td class="w-1/2 px-4 py-2 md:w-1/5 md:flex md:justify-start">${description}</td>
                <td class="w-1/2 px-4 py-2 flex items-end justify-end text-purple-500 md:w-1/5 md:flex md:justify-start">${categorySelected.categoryName}</td>
                <td class="px-4 py-2 hidden md:w-1/5 md:flex md:items-center md:justify-start">${transformCurrentDate(date)}</td>
                <td class="w-1/2 px-4 py-2 text-3xl md:w-1/5 md:text-base md:flex md:justify-start font-bold ${className}">${symbol}$${amount}</td>
                <td class="w-1/2 px-4 py-2 flex items-center justify-end md:w-1/5 md:flex md:justify-start">
                    <button onclick="editOperationForm('${id}')"><i class="fa-solid fa-pen-to-square mr-2 text-green-600"></i></button> 
                    <button data-id="${id}" onclick="modalToDeleteOperations('${id}')"><i class="btn-delete fa-solid fa-trash text-red-600"></i></button>
                </td>                            
            </tr>
            `
        }
    } else {
        showElement("#any-operation")
    }
}

const transformCurrentDate = (date) => {
    const currentDate = new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
    return currentDate
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
    cleanContainer("#categories-select")
    cleanContainer("#category")

    if (categories.length){
        $("#categories-select").innerHTML += `
        <option value="">Todas</option>`
        for (const {id, categoryName} of  categories) { 
        $("#categories-select").innerHTML += `
        <option value="${id}">${categoryName}</option>
        `}

        for( const {id, categoryName} of categories){
            $("#category").innerHTML +=`
            <option value="${id}">${categoryName}</option>
            `
        }
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
    
    if (date === "") {
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

//delete data of operations and categories
const deleteData = (id, keys) => {
    const currentData = getInfo(keys).filter(key => key.id != id)
    setInfo(keys, currentData)
}


//open modal to delete
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
    const selectedCategory = getInfo("categories").find(category => category.id === id)
    $(".modal-text").innerText = selectedCategory.categoryName
    $("#modal-delete").addEventListener("click", () => {
        deleteData(id, "categories")
        window.location.reload()
    })
    renderCategories(getInfo("categories"))
}

//edit operations
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

//edit category
const editCategory = () => {
    const categoryId= $("#btn-confirm-add").getAttribute("data-id")
    const editedCategory= getInfo("categories").map(category => {
        if (category.id === categoryId){
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

const validateAddCategory = () => {
    const category = $("#input-add-categories").value.trim()

    if (category === "") {
        showElement(".category-error")
        $("#input-add-categories").classList.add("border-red-600")
    } else {
        hideElement(".category-error")
        $("#input-add-categories").classList.remove("border-red-600")
        
    }
    return category !== "" 
}

const validateEditCategory = () => {
    const editedCategory = $("#input-edit-categories").value.trim()

    if (editedCategory === "") {
        showElement(".edited-category-error")
        $("#input-edit-categories").classList.add("border-red-600")
    } else {
        hideElement(".edited-category-error")
        $("#input-edit-categories").classList.remove("border-red-600")
    }
    return editedCategory !== "" 
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
        totalsPerMonth(currentOperations)
        generateTotalsForCategory(currentOperations, allCategories)
        generateTotalsPerMonth(currentOperations)

    } else {
        showElement(".any-reports")
        hideElement("#reports-table")
    }
}

const getBalance = (operations) => {
    let profits = 0
    let expenses = 0 
    let total = 0 
    
    for (const { type, amount } of operations){

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

    let className = total > 0 ? "text-green-500" : total < 0 ? "text-red-600" : "text-gray-900"
    let symbol = total > 0 ? "+" : total < 0 ? "-" : ""
    
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

    return balanceByCategory
}

const generateTotalsForCategory = (operations, categories) => {
    const balanceByCategory = totalsForCategory(operations, categories)
    
    let tableContent = cleanContainer("#totals-all-categories")
    
    for (const categoryName in balanceByCategory) {
        const { profits, expenses, total } = balanceByCategory[categoryName]

        let symbol = total < 0 ? "-" : ""
        const tableRow = `
            <tr class="flex justify-between items-center">
                <td class="w-1/4 flex justify-start py-4"><span class="rounded-lg bg-purple-50 text-purple-500">${categoryName}</span></td>
                <td class="w-1/4 flex justify-center py-4 text-green-600">+$${profits}</td>
                <td class="w-1/4 flex justify-center py-4 text-red-600">-$${expenses}</td>
                <td class="w-1/4 flex justify-center py-4">${symbol}$${Math.abs(total)}</td>
            </tr> 
        `
        tableContent += tableRow
    }
    $("#totals-all-categories").innerHTML += tableContent
}

const totalsPerMonth = (operations) => {
    const balancePerMonth = {}

    for (const { date, type, amount } of operations) {
        const currentDate = new Date(date)
        const monthYear = `${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`

        if (!balancePerMonth[monthYear]){
            balancePerMonth[monthYear] = {
                profits: 0,
                expenses: 0,
                total: 0
            }
        }
        if (type === "Ganancia") {
            balancePerMonth[monthYear].profits += amount
            balancePerMonth[monthYear].total += amount
        } else if (type === "Gasto") {
            balancePerMonth[monthYear].expenses += amount
            balancePerMonth[monthYear].total -= amount
        }

    }
    return balancePerMonth
}


const generateTotalsPerMonth = (operations) => {

    const balancePerMonth = totalsPerMonth(operations)
    let tableContent = cleanContainer("#totals-all-months")

    for (const monthYear in balancePerMonth) {
        const { profits, expenses, total } = balancePerMonth[monthYear]
        
        let symbol = total < 0 ? "-" : ""
       
        const tableRow = `
        <tr class="flex justify-between items-center">
            <td class="w-1/4 flex justify-start py-4">${monthYear}</td>
            <td class="w-1/4 flex justify-center py-4 text-green-600">+$${profits}</td>
            <td class="w-1/4 flex justify-center py-4 text-red-600">-$${expenses}</td>
            <td class="w-1/4 flex justify-center py-4">${symbol}$${Math.abs(total)}</td>
        </tr>
        
        `
        tableContent += tableRow
    }
    $("#totals-all-months").innerHTML += tableContent
}


/*
  ************** INITIALIZE APP SECTION  **************
*/

const initializeApp = () => { 
    setInfo("operations", allOperations)
    setInfo("categories", allCategories)
    renderOperations(allOperations)
    renderCategories(allCategories)
    renderCategoriesOptions(allCategories)
    renderReports()
    generateBalance(allOperations)
    

    const home = () => {
        showElements(["#balance-section", "#balance-card-left", "#balance-card-right"])
        hideElements(["#category-section", "#reports-section", "#operations-form"])
    }

    $("#title-home").addEventListener("click", () => {
        home()
        renderOperations(getInfo("operations"))
        renderCategories(getInfo("categories"))
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
        renderCategories(getInfo("categories"))
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
            showElements(["#new-operation", "#table", "#succesfull-alert"]) 
            renderOperations(getInfo("operations"))
            renderCategoriesOptions(getInfo("categories"))
            renderCategories(getInfo("categories"))
            renderReports()
            generateBalance(getInfo("operations"))
            $("#form").reset()
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
            generateBalance(getInfo("operations"))
            renderReports()
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

    
          
      //categories filter
      $("#categories-select").addEventListener("input", (e) => {
        const categoryId = e.target.value
        const currentsOperations = getInfo("operations")
        hideElement("#table")
        if (!categoryId) {
            renderOperations(currentsOperations)
        } else {
            const filteredOperations = currentsOperations.filter(operation => operation.category === categoryId)
            renderOperations(filteredOperations) 
        }    
    })    
    
    //expenses/profits selector
    $("#select-panel").addEventListener("change", (e) => {
        e.preventDefault()
        const selectPanel = $("#select-panel").value  
        if (selectPanel === "Todos"){
            return renderOperations(allOperations)
        }

        const typeFiltered = allOperations.filter((operation) => {
            return operation.type === selectPanel
        })

        renderOperations(typeFiltered)
        showElement("#new-operation")
        hideElement("#any-operation")
    })
    
    //Date filter    
    $("#selector-date").addEventListener("input", (e) => {
        e.preventDefault()
        let filteredOperations = []
        const selectedDate = new Date(e.target.value)
        for (let i = 0; i < allOperations.length; i++) {
            let operationDate = new Date(allOperations[i].date)
            
            if (operationDate >= selectedDate) {
                filteredOperations.push(allOperations[i]) 
                renderOperations(filteredOperations)
            }
            else if (filteredOperations < selectedDate) {
                showElement("#any-operation")
                hideElement("#new-operation")
            }
        }
    })

    //order filter
    $("#order-select").addEventListener("input", (e) => {
        e.preventDefault();
        const currentsOperations = getInfo("operations")
        let selectedOption = $("#order-select").value
        
        if (selectedOption === "more-recent") {
        currentsOperations.sort((a, b) => b.date.localeCompare(a.date))
            renderOperations(currentsOperations)
        }
        
        if (selectedOption === "les-recent") {
            currentsOperations.sort((a, b) => a.date.localeCompare(b.date))
            renderOperations(currentsOperations)
        }
    
        if (selectedOption === "more-amount") {
            currentsOperations.sort((a, b) => b.amount - a.amount)
            renderOperations(currentsOperations)
        }
        
        if (selectedOption === "les-amount") {
            currentsOperations.sort((a, b) => a.amount - b.amount)
            renderOperations(currentsOperations)
        }
        
        if (selectedOption === "a-z") {
            currentsOperations.sort((a, b) =>
            a.description.localeCompare(b.description))
            renderOperations(currentsOperations)
        }
        
        if (selectedOption === "z-a") {
            currentsOperations.sort((a, b) =>
            b.description.localeCompare(a.description))
            renderOperations(currentsOperations)
        }
    })
        
    //section categorias
    $("#btn-add-categories").addEventListener("click", () => {
        if (validateAddCategory()) {
            sendNewData("categories", saveCategoriesData)
            renderCategories(getInfo("categories"))
            renderCategoriesOptions(getInfo("categories"))
            showElement("#succesfull-alert") 
        }
    })
    
    //section category edition
    $("#btn-cancel-add").addEventListener("click", () => {
        hideElement("#edit-categories")
        showElement("#category-section")
    })
    
    $("#btn-confirm-add").addEventListener("click", () => {
        if (validateEditCategory()) {
            editCategory()
            hideElement("#edit-categories")
            showElement("#category-section")
            renderCategories(getInfo("categories"))
        }
    })

    //modal-window buttons
    $("#modal-cancel").addEventListener("click", () => {
        hideElement("#modal-window")
    })

    $("#modal-delete").addEventListener("click", () => {
        hideElement("#modal-window")
    })
}
window.addEventListener("load", initializeApp)