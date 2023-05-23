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
        categorieName: "Comida"
    },
    {
        id: randomId(),
        categorieName: "Servicios"
    },
    {
        id: randomId(),
        categorieName: "Salidas"
    },
    {
        id: randomId(),
        categorieName: "Educación"
    },
    {
        id: randomId(),
        categorieName: "Transporte"
    },
    {
        id: randomId(),
        categorieName: "Trabajo"
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
        for (const {id, description, categorie, date, amount} of operations){
            const categorieSelected = getInfo("categories").find(cat => cat.id === categorie)
            $("#operations-table").innerHTML += `
            <tr class="flex flex-wrap justify-between md:flex-nowrap md:items-center border border-purple-100 odd:bg-white even:bg-purple-50">
                <td class="w-1/2 px-4 py-2 md:w-1/5 md:flex md:justify-start">${description}</td>
                <td class="w-1/2 px-4 py-2 flex items-end justify-end text-purple-500 md:w-1/5 md:flex md:justify-start">${categorieSelected.categorieName}</td>
                <td class="px-4 py-2 hidden md:w-1/5 md:flex md:items-center md:justify-start">${date}</td>
                <td class="w-1/2 px-4 py-2 text-3xl md:w-1/5 md:text-base md:flex md:justify-start">${amount}</td>
                <td class="w-1/2 px-4 py-2 flex items-center justify-end md:w-1/5 md:flex md:justify-start">
                    <button onClick="editOperationForm('${id}')"><i class="fa-solid fa-pen-to-square mr-2 text-green-600"></i></button> 
                    <button data-id="${id}" onClick="openDeleteModal('${id}')"><i class="btn-delete fa-solid fa-trash text-red-600"></i></button>
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
    for (const {id, categorieName} of  categories) { 
        $("#categories-section").innerHTML += `
        <article class="flex justify-between p-4">
            <p class="p-2 w-fit rounded-lg bg-purple-50 text-purple-500" data-id="${id}">${categorieName}</p>
            <div>
                <button><i class="btn-edit-categories fa-solid fa-pen-to-square mr-2 text-green-600" onclick=editCategoriesForm("${id}")></i></button>
                <button><i class="btn-delete-categories fa-solid fa-trash text-red-600" onclick=deleteCategorieId("${id}")></i></button>
            </div>
        </article>
        `
    }
}

const renderCategoriesOptions = (categories) => {
    for (const {id, categorieName} of  categories) { 
        $("#categories-select").innerHTML += `
        <option value="${id}">${categorieName}</option>
    `
    $("#categorie").innerHTML +=`
    <option value="${id}">${categorieName}</option>
    `
    }
}


//Save data operations
//union de save categorie, preguntar
const saveCategoriesData1 = (selector) => {
    return{
        id : randomId(),
        categorieName: $(selector).value
    }
}
const saveCategoriesData = () => {
    return{
        id : randomId(),
        categorieName: $("#input-add-categories").value
    }
}

const saveCategoriesData2 = () => {
    return{
        id : randomId(),
        categorieName: $("#input-edit-categories").value
    }
}


const validateForm = () => {
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
        categorie: $("#categorie").value,
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
// no puedo usar el sendNewData en add categories porque en saveCteorieData no puedo pasarle el selected
const addCategories = () => {
    const currentCategorie = getInfo("categories")
    const newCategorie = saveCategoriesData()
    currentCategorie.push(newCategorie)
    setInfo("categories", currentCategorie)
}

//modifying funtions  
//podemos unificar estas dos delete  
const deleteData = (id, keys) => {
    const currentData = getInfo(keys).filter(key => key.id != id)
    setInfo(keys, currentData)
}

// quise unir las delete categorie e operation en una pero no funciona
const openDeleteModal1 = (id, keys, render) => {
    showElement("#modal-window")
    const selectedAction = getInfo(keys).find(key => key.id === id)
    $(".modal-text").innerHTML = selectedAction[1]
    $("#modal-delete").setAttribute("data-id", id)
    $("#modal-delete").addEventListener("click", () => {
        deleteData(id, keys)
        window.location.reload()
    })
    render(getInfo(keys))
}

////podemos unificar estas dos delete 
const openDeleteModal = (id) => {
    showElement("#modal-window")
    const selectedOperation = getInfo("operations").find(operation => operation.id === id)
    $(".modal-text").innerHTML = selectedOperation.description
    $("#modal-delete").setAttribute("data-id", id)
    $("#modal-delete").addEventListener("click", () => {
        // const operationId = $("#modal-delete").getAttribute("data-id")
        deleteData(id, "operations")
        window.location.reload()
    })
    renderOperations(getInfo("operations"))
}


const deleteCategorieId = (id) => {
    showElement("#modal-window")
    $("#modal-delete").setAttribute("data-id",id)
    const selectedCategorie= getInfo("categories").find(categorie=>categorie.id ===id)
    $(".modal-text").innerText= selectedCategorie.categorieName
    
    $("#modal-delete").addEventListener("click", ()=>{
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
    hideElements([".new-operation-title", "#btn-add-operation", "#balance-section", "#balance-card-left", "#balance-card-right", "#categorie-section"])
    $("#btn-edit-operation").setAttribute("data-id", id)
    const editSelected = getInfo("operations").find(operation => operation.id === id)
    $("#description").value = editSelected.description
    $("#amount").valueAsNumber = editSelected.amount
    $("#type").value = editSelected.type
    $("#categorie").value = editSelected.categorie
    $("#date").value = editSelected.date
}

const editCategorie = () => {
    const categorieId= $("#btn-confirm-add").getAttribute("data-id")
    const editedCategorie= getInfo("categories").map(categorie => {
        if(categorie.id === categorieId){
            return saveCategoriesData2(categorieId)
        }
        return categorie
    })
    setInfo("categories", editedCategorie)
}

const editCategoriesForm = (id) => {
    showElement("#edit-categories")
    hideElement("#categorie-section")
    $("#btn-confirm-add").setAttribute("data-id", id)
    const categorieSelected=getInfo("categories").find(categorie => categorie.id === id)
    $("#input-edit-categories").value = categorieSelected.categorieName
}
let restar=(a,b)=>{
  return a - b
}

let sumar=(a,b)=>{
  return a + b
}

const renderBalance=(operations)=>{
    const profits = $("#profits").value
    const expenses = $("#expenses").value
    let accProfits = 0
    let accExpenses = 0
    const expensesFiltred = operations.filter(({ type }) => type === expenses)
        for (const {amount} of expensesFiltred) {
        totalExpenses = accExpenses += amount
         $("#balance-expenses").innerHTML =+ totalExpenses
         $("#total-balance").innerHTML =+ totalExpenses
        }
    const profitsFiltred = operations.filter(({ type }) => type === profits)
        for (const {amount} of profitsFiltred) {
        totalProfits = accProfits += amount
        $("#balance-profits").innerHTML =+  totalProfits   
            $("#total-balance").innerHTML =+ totalProfits    
        }
    const total=+ restar(totalProfits, totalExpenses)
    return $("#total-balance").innerHTML = total

}
//   const saveBalanceData=(renderBalance)=>{
    
// $("#balance-expenses").innerHTML =+ totalExpenses
//      $("#total-balance").innerHTML =+ totalExpenses
//    }
//    const actualizarBalance = (operaciones = obtenerOperaciones()) => {
//     const { ganancias, gastos, balance } = obtenerBalance(operaciones)
//     $('#ganancias').innerHTML = `+$${Math.abs(ganancias)}`
//     $('#gastos').innerHTML = `-$${Math.abs(gastos)}`
  
//     $('#balance').classList.remove('has-text-danger', 'has-text-success')
//     let operador = ''
  
//     if (balance > 0) {
//       $('#balance').classList.add('has-text-success')
//       operador = '+'
//     } else if (balance < 0) {
//       $('#balance').classList.add('has-text-danger')
//       operador = '-'
//     }
  
//     $('#balance').innerHTML = `${operador}$${Math.abs(balance)}`
//   }
  
       
//  const renderBalance = (operations) => {
//     const profits = $("#profits").value
//      const expenses = $("#expenses").value
//      let accProfits = 0
//     let accExpenses = 0
//     return operations.filter(({type})=> {
//         if (type === profits) {
//           return {
//             ...total,
//             ganancias: total.ganancias + operacion.monto,
//             balance: total.balance + operacion.monto,
//           }
//         }
  
//         if (operacion.tipo === OPERACIONES.GASTO) {
//           return {
//             ...total,
//             gastos: total.gastos + operacion.monto,
//             balance: total.balance - operacion.monto,
//           }
//         }
//       },
//       {
//         ganancias: 0,
//         gastos: 0,
//         balance: 0,
//       }
//     )
//   }

  


// console.log(cardTotalBalance())

    //const cardTotalBalance = () => {
    // const expenses = $("#expenses").value
    // const profits = $("#profits").value
    // const allOperations = getInfo("operations")
    // let accExpenses = 0
    // let accProfits = 0
    
    // const expensesFiltred = allOperations.filter(({ type }) => type === expenses)
    // for (const {amount} of expensesFiltred) {
    //     totalExpenses = accExpenses += amount
    //     console.log(totalExpenses)
    //     $("#balance-expenses").innerHTML =+ totalExpenses
    // }
    
    // const profitsFiltred = allOperations.filter(({ type }) => type === profits)
    // for (const {amount} of profitsFiltred) {
    //     totalProfits = accProfits += amount
    //     console.log(totalProfits)
    //     $("#balance-profits").innerHTML =+  totalProfits
    // }
    
    // let totalBalance = totalProfits - totalExpenses 
    // $("#total-balance").innerHTML =+ totalBalance
    

    //let totalBalance = cardProfists - cardExpenses
     //$("#total-balance").innerHTML =+ totalBalance 
    
     //console.log(totalBalance)

    // const expenses = $("#expenses").value
    // const profits = $("#profits").value
    // const allOperations = getInfo("operations")
    // let totalExpenses = 0
    // let totalProfits = 0
    
    // for (const { type, amount } of allOperations) {
    //     if (type === expenses) {
    //         totalExpenses= amount
    //         totalExpenses++
    //         $("#balance-expenses").innerHTML = amount
    //     } else if (type === profits) {
    //        totalProfits = amount
    //         $("#balance-profits").innerHTML = totalProfits
    //     }
    // }
    
    // const totalBalance = totalProfits - totalExpenses;
    // $("#total-balance").innerHTML = totalBalance;
//  }

 //console.log(cardTotalBalance())

const initializeApp = () => { 
    setInfo("operations", allOperations)
    setInfo("categories", allCategories)
    renderOperations(allOperations)
    renderCategories(allCategories)
    renderCategoriesOptions(allCategories)
    renderBalance(allOperations)

    const home = () => {
        showElements(["#balance-section", "#balance-card-left", "#balance-card-right"])
        hideElements(["#categorie-section", "#reports-section", "#operations-form"])
    }

    //Falta que muestre el contendio de la tabla cuando tiene informacion
    $("#title-home").addEventListener("click", () => {
        home()
        renderOperations(getInfo("operations"))
    })

    // btn balance 
    $("#balance-btn").addEventListener("click", () => {
        home()
        renderOperations(getInfo("operations")) 
        renderCategories(getInfo("categories"))
        showElements(["#new-operation", "#table"])

    })

    //btn categorías
    $("#categorie-btn").addEventListener("click", () => {
        showElement("#categorie-section")
        hideElements(["#balance-section", "#reports-section", "#balance-card-left", "#balance-card-right", "#new-operation", "#operations-form"]) 
    })

    //btn reportes
    $("#reports-btn").addEventListener("click", () => {
        showElement("#reports-section")
        hideElements(["#categorie-section", "#balance-section", "#balance-card-left", "#balance-card-right", "#new-operation", "#operations-form"])
    })

    //btn succesfull alert
    $("#close-succesfull-alert").addEventListener("click", () => {
        hideElement("#succesfull-alert")
    })

    // btn add new operation
    $("#btn-new-operation").addEventListener("click", () => {
        showElement("#operations-form")
        hideElements(["#categorie-section", "#balance-section", "#reports-section", "#balance-card-left", "#balance-card-right"])        
    })

    //add and edit operation 
    $("#btn-add-operation").addEventListener("click", (e) => {
        e.preventDefault()
        if (validateForm()) {
            sendNewData("operations", saveOperationsData)
            renderOperations(getInfo("operations"))
            renderCategoriesOptions(getInfo("operations"))
            renderCategories(getInfo("categories"))
            renderBalance(getInfo("operations"))
            showElements(["#new-operation", "#table", "#succesfull-alert"]) 
            home()
        }
    })
    
    $("#amount").addEventListener("input", (e) => {
        const value = e.target.valueAsNumber
        if (isNaN(value)) {
            $("#amount").value = ""
        }
    })

    $("#btn-cancel-operation").addEventListener("click",(e) => {
        e.preventDefault()
        renderOperations(getInfo("operations"))
        showElements(["#new-operation", "#table"]) 
        home()
    })
    
    $("#btn-edit-operation").addEventListener("click", (e) => {
        e.preventDefault()
        if (validateForm()) {
            editOperation()
            showElements(["#new-operation", "#table"]) 
            home()
            renderOperations(getInfo("operations"))
        }
        
    })

    //mobile - open menu
    $(".fa-bars").addEventListener("click", () => {
        showElements([".fa-xmark", "#options-menu"])
        hideElement(".fa-bars")
    })

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
        const categorieId = e.target.value
        const currentsOperations = getInfo("operations")
        if (!categorieId) {
            renderOperations("currentsOperations")
        } else {
            const filteredOperations = currentsOperations.filter(operation => operation.categorie === categorieId)
            renderOperations(filteredOperations) 
        }    
    })

    //selector gasto/ganancia
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
    
    //section categorie edition
    $("#btn-cancel-add").addEventListener("click", () => {
        hideElement("#edit-categories")
        showElement("#categorie-section")
    })
    
    $("#btn-confirm-add").addEventListener("click", () => {
        editCategorie()
        hideElement("#edit-categories")
        showElement("#categorie-section")
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