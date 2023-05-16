// Getting elements from DOM
const $ = (selector) => document.querySelector(selector)

// Show or hide handlers
const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")
const cleanContainer = (selector) => $(selector).innerHTML = ""

const showElements = (selectors) => {
    for (const eachSelector of selectors){
        $(eachSelector).classList.remove("hidden")
    }
}

const hideElements = (selectors) => {
    for (const eachSelector of selectors){
        $(eachSelector).classList.add("hidden")
    }
}

// LocalStorage Handlers
const getInfo = (key) => JSON.parse(localStorage.getItem(key))
const setInfo = (key, array) => localStorage.setItem(key, JSON.stringify(array))


// Random id generator
const randomId = () => self.crypto.randomUUID()


const allOperations = getInfo("operations") || []


//limpiar tabla antes del for (las cosas se me duplican porque no le pongo el clean container)
const renderOperations = (operations) => {
    cleanContainer("#table")
    if (operations.length){
        hideElement("#any-operation")
        for (const {id, description, categorie, date, amount} of operations){
            $("#operationsTable").innerHTML += `
            <tr class="flex flex-wrap justify-between md:flex-nowrap md:items-center border border-purple-100 odd:bg-white even:bg-purple-50">
                <td class="w-1/2 px-4 py-2 md:w-1/5 md:flex md:justify-start">${description}</td>
                <td class="w-1/2 px-4 py-2 flex items-end justify-end md:w-1/5 md:flex md:justify-start">${categorie}</td>
                <td class="px-4 py-2 hidden md:w-1/5 md:flex md:items-center md:justify-start">${date}</td>
                <td class="w-1/2 px-4 py-2 text-3xl md:w-1/5 md:text-base md:flex md:justify-start">${amount}</td>
                <td class="w-1/2 px-4 py-2 flex items-center justify-end md:w-1/5 md:flex md:justify-start">
                    <button><i class="fa-solid fa-pen-to-square mr-2 text-green-600"></i></button> 
                    <button><i class="fa-solid fa-trash text-red-600"></i></button>
                </td>                            
            </tr>
            `
        }
    }else {
        showElement("#any-operation")
    }
}

    
// renderOperations(placeholderOperations)
const saveOperationsData = () => {
    return {
        id: randomId(), 
        description: $("#description").value,
        categorie: $("#categorie").value,
        date: $("#date").value,
        amount: $("#amount").valueAsNumber
    }
}



const addOperation = () => {
    const currentOperation = getInfo("operations")
    const newOperation = saveOperationsData()
    currentOperation.push(newOperation)
    console.log(currentOperation)
    setInfo ("operations", currentOperation)
}

const deleteOperation = () => {

}

const initializeApp = () => { 
    setInfo("operations", allOperations)
    renderOperations(allOperations)
    
    hideElement("#categorie-section")  
    hideElement("#reports-section")
     
    const home = () =>{
        showElement("#balance-section") 
        showElement("#balance-card-left") 
        showElement("#balance-card-right")
        hideElement("#categorie-section")  
        hideElement("#reports-section")
        hideElement("#operations-form")
    }
    
    //POR AHORA NO HACE FALTA EL BOTON DE TITLE HOME
    // $("#title-home").addEventListener("click", home)

    // btn balance 
    $("#balance-btn").addEventListener("click", home)

    //btn categorías
    $("#categorie-btn").addEventListener("click", () => {
        showElement("#categorie-section") 
        hideElement("#balance-section") 
        hideElement("#reports-section") 
        hideElement("#balance-card-left") 
        hideElement("#balance-card-right") 
        hideElement("#new-operation")
        hideElement("#operations-form") 
    })

    //btn reportes
    $("#reports-btn").addEventListener("click", () => {
        showElement("#reports-section")
        hideElement("#categorie-section") 
        hideElement("#balance-section") 
        hideElement("#balance-card-left") 
        hideElement("#balance-card-right") 
        hideElement("#new-operation")
        hideElement("#operations-form") 
    })

    // btn add operation
    $("#btn-new-operation").addEventListener("click",() => {
        showElement("#operations-form")
        hideElement("#categorie-section")
        hideElement("#balance-section") 
        hideElement("#reports-section") 
        hideElement("#balance-card-left") 
        hideElement("#balance-card-right") 
        hideElement("#new-operation") 
        
    })
    $("#btn-add-operation").addEventListener("click",(e) => {
        e.preventDefault()
        addOperation()
        renderOperations(getInfo("operations")) 
        // hideElement("#any-operation")
        // showElement("#new-operation")
        // showElement("#table")
        home()
    })

    $("#btn-cancel-operation").addEventListener("click",(e)=>{
        e.preventDefault()
        home()
    })
    

    //mobile - open 
    $(".fa-bars").addEventListener("click", () => {
        hideElement(".fa-bars")
        showElement(".fa-xmark")
        showElement("#options-menu")
    })
    $(".fa-xmark").addEventListener("click", () => {
        showElement(".fa-bars")
        hideElement(".fa-xmark")
        hideElement("#options-menu")
    })

    //filters panel 
    $("#btn-hide-filters").addEventListener("click",(e)=>{
        e.preventDefault()
        hideElement("#filters-panel")
        hideElement("#btn-hide-filters")
        showElement("#btn-show-filters")
    })
      
    $("#btn-show-filters").addEventListener("click",(e)=>{
        e.preventDefault()
        showElement("#filters-panel")
        showElement("#btn-hide-filters")
        hideElement("#btn-show-filters")
    })

    //selector gasto/ganancia
    $("#select-panel").addEventListener("click", () => {
        const selectPanel = $("#select-panel").value
        showElement("#new-operation")
        hideElement("#any-operation")
    })

    //section categorias
    $("#btn-add-categories").addEventListener("click",()=>{
        showElement("#edit-categories")
        hideElement("#categorie-section")
    })
    
    $("#btn-cancel-add").addEventListener("click",()=>{
        hideElement("#edit-categories")
        showElement("#categorie-section")
    })
    
    $("#btn-confirm-add").addEventListener("click",()=>{
        hideElement("#edit-categories")
        showElement("#categorie-section")
    })
  
    // mensaje de Pili respecto a los botones edit categories y delete categories
    //  Bueno, tene en cuenta entonces que este fragmento de codigo no deberia estar suelto
    // Porque sino cuando agregas una categoria nueva
    // No tendria el evento agregado
    // Este for tendria que estar puesto donde generas esa tabla de categorias
    // Parecido a lo que yo tuve que hacer en la super app

    // ESTO VA EN LOS BTN DELETE Y EDIT DE RENDER OPERATIONS
    const btnEditCategories = document.querySelectorAll(".btn-edit-categories");
        for (const btn  of btnEditCategories) {
            btn.addEventListener ("click", () => {
            showElement("#edit-categories")
            hideElement("#categorie-section")
        })
    }
    const btnDeleteCategories = document.querySelectorAll(".btn-delete-categories");
        for (const btn  of btnDeleteCategories) {
            btn.addEventListener ("click", () => {
            showElement("#modal-window")
        })
    }

    //modal-window buttons
    $("#modal-cancel").addEventListener("click", () =>{
        hideElement("#modal-window")
    })

    $("#modal-delete").addEventListener("click", () =>{
        hideElement("#modal-window")
    })

}
window.addEventListener("load", initializeApp)