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
//limpiar tabla antes del for (las cosas se me duplican porque no le pongo el clean container)
const renderOperations = (operations) => {
    cleanContainer("#operations-table")
    if (operations.length){
        hideElement("#any-operation")
        for (const {id, description, categorie, date, amount} of operations){
            const categorieSelected = getInfo("categories").find(cat => cat.id === categorie)
            $("#operations-table").innerHTML += `
            <tr class="flex flex-wrap justify-between md:flex-nowrap md:items-center border border-purple-100 odd:bg-white even:bg-purple-50">
                <td class="w-1/2 px-4 py-2 md:w-1/5 md:flex md:justify-start">${description}</td>
                <td class="w-1/2 px-4 py-2 flex items-end justify-end md:w-1/5 md:flex md:justify-start">${categorieSelected.categorieName}</td>
                <td class="px-4 py-2 hidden md:w-1/5 md:flex md:items-center md:justify-start">${date}</td>
                <td class="w-1/2 px-4 py-2 text-3xl md:w-1/5 md:text-base md:flex md:justify-start">${amount}</td>
                <td class="w-1/2 px-4 py-2 flex items-center justify-end md:w-1/5 md:flex md:justify-start">
                    <button onClick="editOperationForm('${id}')"><i class="fa-solid fa-pen-to-square mr-2 text-green-600"></i></button> 
                    <button onClick="deleteOperation('${id}')"><i class="fa-solid fa-trash text-red-600"></i></button>
                </td>                            
            </tr>
            `
        }
    }else {
        showElement("#any-operation")
    }
}

// getInfo("categories").filter(cat => console.log(cat.id))
const renderCategories = (categories) => {
    cleanContainer("#categories-section")
    for (const {id, categorieName} of  categories) { 
        $("#categories-section").innerHTML += `
        <article class="flex justify-between p-4">
            <p class="p-2 w-fit rounded-lg bg-purple-50 text-purple-500" data-id="${id}">${categorieName}</p>
            <div>
                <button><i class="btn-edit-categories fa-solid fa-pen-to-square mr-2 text-green-600"></i></button>
                <button><i class="btn-delete-categories fa-solid fa-trash text-red-600"></i></button>
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

const saveCategoriesData = () => {
    return{
        id : randomId(),
        categorieName: $("#input-add-categories").value
    }
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

const addOperation = () => {
    const currentOperation = getInfo("operations")
    const newOperation = saveOperationsData()
    currentOperation.push(newOperation)
    setInfo ("operations", currentOperation)
}

const addCategories = () => {
    const currentCategorie = getInfo("categories")
    const newCategorie = saveCategoriesData()
    currentCategorie.push(newCategorie)
    setInfo("categories", currentCategorie)
}

//modifying funtions    
const deleteOperation = (id) => {
    const currentOperation = getInfo("operations").filter(operation => operation.id != id)
    setInfo("operations", currentOperation)
    renderOperations(currentOperation)
}

//me da error pq no puedo tomar las categories
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



const initializeApp = () => { 
    setInfo("operations", allOperations)
    setInfo("categories", allCategories)
    renderOperations(allOperations)
    renderCategories(allCategories)
    renderCategoriesOptions(allCategories)
    hideElement("#categorie-section")  
    hideElement("#reports-section")
    hideElement("#new-operation")

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

    $("#close-succesfull-alert").addEventListener("click", () => {
        hideElement("#succesfull-alert")
    })

    // btn add new operation
    $("#btn-new-operation").addEventListener("click",() => {
        showElement("#operations-form")
        hideElements(["#categorie-section", "#balance-section", "#reports-section", "#balance-card-left", "#balance-card-right"])        
    })

    //add operation
    $("#btn-add-operation").addEventListener("click",(e) => {
        e.preventDefault()
        addOperation()
        renderOperations(getInfo("operations"))
        renderCategoriesOptions(getInfo("operations"))
        renderCategories(getInfo("categories"))
        showElements(["#new-operation", "#table"]) 
        home()
    })
    

    $("#btn-cancel-operation").addEventListener("click",(e)=> {
        e.preventDefault()
        renderOperations(getInfo("operations"))
        showElements(["#new-operation", "#table"]) 
        home()
    })
    
    $("#btn-edit-operation").addEventListener("click", (e) => {
        e.preventDefault()
        editOperation()
        showElements(["#new-operation", "#table"]) 
        home()
        renderOperations(getInfo("operations"))
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
      
    $("#btn-show-filters").addEventListener("click",(e)=>{
        e.preventDefault()
        showElements(["#filters-panel", "#btn-hide-filters"])
        hideElement("#btn-show-filters")
    })

    $("#categories-select").addEventListener("input", (e)=>{
        const categorieId= e.target.value
        const currentsOperations= getInfo("operations")
        if(!categorieId){
         renderOperations("currentsOperations")
        }else{
         const filteredOperations= currentsOperations.filter(operation=> operation.categorie ===categorieId)
         renderOperations(filteredOperations)
         
        }    
     }
     )

    //selector gasto/ganancia
    $("#select-panel").addEventListener("click", () => {
        const selectPanel = $("#select-panel").value
        showElement("#new-operation")
        hideElement("#any-operation")
    })

    //section categorias
    $("#btn-add-categories").addEventListener("click",()=>{
        // showElement("#edit-categories")
        // hideElement("#categorie-section")
        addCategories()
        renderCategories(getInfo("categories"))
        renderCategoriesOptions(getInfo("categories"))
        showElement("#succesfull-alert") 
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