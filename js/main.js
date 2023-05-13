// Getting elements from DOM
const $ = (selector) => document.querySelector(selector)
const all = (selector)=> document.querySelectorAll(selector)


// Show or hide handlers
const showElement = (selector) => $(selector).classList.remove("hidden")
const hideElement = (selector) => $(selector).classList.add("hidden")
const cleanContainer = (selector) => $(selector).innerHTML = ""

// LocalStorage Handlers
const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, array) => localStorage.setItem(key, JSON.stringify(array))

// Random id generator
const randomId = () => self.crypto.randomUUID()

// const placeholderOperations = [
//     {
//       id:1,
//       description: "sdfgfg", 
//       categorie: "Comida", 
//       date: "2017-01-26",
//       amount: 200000
//     },
//     {
//       id:2,
//       description: "sdfgfg", 
//       categorie: "Trabajo", 
//       date: "2017-01-26",
//       amount: 200000
//     },
//     {
//       id:3,
//       description: "sdfgfg", 
//       categorie: "Compras", 
//       date: "2017-01-26",
//       amount: 200000
//     }
// ]

// if (!getData(operations)) {
//     setData("operations", [])
// }

const renderOperations = (operations) => {
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
}

// renderOperations(placeholderOperations)


// const saveOperationsData = () => {
//     return {
//         id: userId ? userId : randomId(), 
//         description: $(description).value,
//         categorie: $(categorie).value,
//         date: $(date).value,
//         amount: $(amount).value,
//     }
// }

//los saque de la funcion initializeApp porque no funcionaban... mostraba todas las secciones cuando abrias la pagina.
//hay que ver como inicializar de una manera mas prolija
//const initializeApp = () => { 
        hideElement("#categorie-section")  
        hideElement("#reports-section")

//     // agregar id correspondientes en el html
    const home = () =>{
        hideElement("#categorie-section")  
        hideElement("#reports-section")
        showElement("#balance-section") 
        showElement("#balance-card-left") 
        showElement("#balance-card-right") 
    }
    // btn balance 
    $("#balance-btn").addEventListener("click", home)

    $("#title-home").addEventListener("click", home)


//btn categorías
    $("#categorie-btn").addEventListener("click", () => {
        showElement("#categorie-section") 
        hideElement("#balance-section") 
        hideElement("#reports-section") 
        hideElement("#balance-card-left") 
        hideElement("#balance-card-right") 
        hideElement("#table") 
    })

    //btn reportes
    $("#reports-btn").addEventListener("click", () => {
        showElement("#reports-section")
        hideElement("#categorie-section") 
        hideElement("#balance-section") 
        hideElement("#balance-card-left") 
        hideElement("#balance-card-right") 
        hideElement("#table") 
    })

    // btn add operation
    $("#add-operation").addEventListener("click", () => {
        showElement("#operations-form")
        hideElement("#categorie-section")
        hideElement("#balance-section") 
        hideElement("#reports-section") 
        hideElement("#balance-card-left") 
        hideElement("#balance-card-right") 
        hideElement("#table") 
    })

    //add operation 
    //$("#")

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
//   Bueno, tene en cuenta entonces que este fragmento de codigo no deberia estar suelto
// Porque sino cuando agregas una categoria nueva
// No tendria el evento agregado
// Este for tendria que estar puesto donde generas esa tabla de categorias
// Parecido a lo que yo tuve que hacer en la super app
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
    $("#modal-cancel").addEventListener("click", ()=>{
        hideElement("#modal-window")
    })

    $("#modal-delete").addEventListener("click", ()=>{
        hideElement("#modal-window")
    })