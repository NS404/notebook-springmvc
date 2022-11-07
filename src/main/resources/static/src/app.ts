
let context: string = "";
let editMode: boolean = false;

let writeNoteButton = document.getElementById('writeNoteButton') as HTMLButtonElement;

let newCategoryButton = document.getElementById('newCategoryButton') as HTMLButtonElement;
newCategoryButton.addEventListener('click', createCategory);

let openNewNoteButton = document.getElementById('openNewNoteButton') as HTMLButtonElement;
openNewNoteButton.addEventListener('click', function (){
    editMode = false;
    openNewNotePopup();
});

let closeNewNoteButton = document.getElementById('closeNewNoteButton') as HTMLButtonElement;
closeNewNoteButton.addEventListener('click',closeNewNotePopup);

let newNotePopup = document.getElementById('newNoteDiv') as HTMLElement;
let overlay = document.getElementById('overlay') as HTMLElement;




addCategoryListeners();

addDeleteNoteButtonListeners();

addEditNoteButtonListener();


function closeNewNotePopup() {
    newNotePopup.classList.remove('active');
    overlay.classList.remove('active');

    (document.getElementById("newNoteTitle") as HTMLInputElement).value = "";
    (document.getElementById("noteContentArea") as HTMLInputElement).value = "";
}

function openNewNotePopup(event?: Event) {
    newNotePopup.classList.add('active');
    overlay.classList.add('active');

    if(editMode) {
        let noteElm = (event?.target as HTMLElement).parentElement as HTMLElement;
        let noteId = noteElm.getAttribute("data-id") as string;
        let noteTitle: string = (noteElm.querySelector(".noteTitle") as HTMLElement).innerText;
        let noteContent: string = (noteElm.querySelector(".noteContent") as HTMLElement).innerText;


        (document.getElementById("newNoteTitle") as HTMLInputElement).value = noteTitle;
        (document.getElementById("noteContentArea") as HTMLInputElement).value = noteContent;
        (document.getElementById("noteIdHidden") as HTMLInputElement).value = noteId;


        writeNoteButton.innerText = "Edit";
        writeNoteButton.removeEventListener("click", createNote);
        writeNoteButton.addEventListener("click",editNote);
    }else {
        writeNoteButton.innerText = "Note";
        writeNoteButton.removeEventListener("click",editNote);
        writeNoteButton.addEventListener("click",createNote);
    }
}

function addEditNoteButtonListener(){
    $(".editNoteButton").click(function (){
        editMode = true;
        openNewNotePopup(event as Event);
    });

}

function addEditCatButtonListener() {
    $(".editCatButton").click(function () {
        editCategory(event as Event);
    });
}

function addDeleteCatButtonListeners(){
    $(".deleteCatButton").click(function() {
        deleteCategory(event as Event);
    });
}

function addDeleteNoteButtonListeners(){
    $(".deleteNoteButton").click(function() {
        deleteNote(event as Event);
    });
}

function addCategoryListeners() {
    $(".category").click(function () {
        clickCategory(event as Event);
    })
    addDeleteCatButtonListeners();
    addEditCatButtonListener();
}

function editNote(event: Event) {

    let noteTitleInput = document.getElementById('newNoteTitle') as HTMLInputElement;
    let noteContentInput = document.getElementById('noteContentArea') as HTMLInputElement;
    let noteId: string = (document.getElementById("noteIdHidden") as HTMLInputElement).value

    if (noteTitleInput.value.trim().length  && noteContentInput.value.trim().length) {

        let editedTitle: string = (document.getElementById('newNoteTitle') as HTMLInputElement).value;
        (document.getElementById('newNoteTitle') as HTMLInputElement).value = '';
        let editedContent: string = (document.getElementById('noteContentArea') as HTMLInputElement).value;
        (document.getElementById('noteContentArea') as HTMLInputElement).value = '';
        let noteElm = (event.target as HTMLElement).parentElement as HTMLElement;


        $.ajax({
            async: false,
            type: "PUT",
            url: context+"/Notes/edit",
            data: {noteId: noteId, editedTitle: editedTitle, editedContent: editedContent},
            success: function (data) {
                $("#notesDiv").replaceWith(data);
                addDeleteNoteButtonListeners();
                addEditNoteButtonListener();
                closeNewNotePopup();
            }
        });
    }
}

function editCategory(event: Event) {

    event.stopPropagation();

   let category = (event.target as HTMLElement).parentElement as HTMLElement;

   let categoryNameInput = document.createElement("input") as HTMLInputElement;
   categoryNameInput.classList.add("categoryNameEdit");


    categoryNameInput.value = (category.querySelector(".categoryName")as HTMLElement).innerHTML;
    (category.querySelector(".categoryName") as HTMLElement).replaceWith(categoryNameInput);
    categoryNameInput.focus();

   categoryNameInput.addEventListener("keypress",function (event){

       if (event.key === "Enter") {
           let editedName = categoryNameInput.value.trim() as string

           if (editedName) {

               let categoryId = category.getAttribute("data-id") as string;


               $.ajax({
                   async: false,
                   type: "PUT",
                   data: {categoryId: categoryId, editedName: editedName},
                   url: context + "/Categories/edit",
                   success: function (data) {
                       //$("#categoriesDiv").replaceWith(data);
                       updateCategories();

                   }
               });

           }
       }


   });



}

function createNote() {



        let noteTitleInput = document.getElementById('newNoteTitle') as HTMLInputElement;
        let noteContentInput = document.getElementById('noteContentArea') as HTMLInputElement;

        if (noteTitleInput.value.trim().length  && noteContentInput.value.trim().length) {

            let noteTitle: string = (document.getElementById('newNoteTitle') as HTMLInputElement).value;
            (document.getElementById('newNoteTitle') as HTMLInputElement).value = '';
            let noteContent: string = (document.getElementById('noteContentArea') as HTMLInputElement).value;
            (document.getElementById('noteContentArea') as HTMLInputElement).value = '';

            $.ajax({
                async: false,
                type: "POST",
                data: {noteTitle: noteTitle , noteContent: noteContent},
                url: context+"/Notes/create",
                success: function (data) {
                    $("#notesDiv").replaceWith(data);
                    addDeleteNoteButtonListeners();
                    addEditNoteButtonListener();
                    updateCategories();
                }
            });


        }

}

function createCategory() {
    let catNameInput = document.getElementById('newCategoryName')as HTMLInputElement;
    let categoryName: string = catNameInput.value;

    if(categoryName.trim().length) {

        catNameInput.value = '';

            $.post(context+"/Categories/create", {name : categoryName}, function (data, status) {
                    $("#categoriesDiv").empty();
                    $("#categoriesDiv").append(data);
                    addCategoryListeners();
                });
    }
}

export function clickCategory(e: Event){

    let clickedCategory = e.target as Element;

    let categoryName = (clickedCategory.querySelector('.categoryName') as HTMLElement).innerHTML;

    let categoryId: string = clickedCategory.getAttribute("data-id") as string;

    console.log(categoryName.trim());

    $.ajax({
        async: false,
        type: "GET",
        url: context+"/Notes",
        data: {categoryName: categoryName} ,
        success: function (data) {
            $("#notesDiv").empty();
            $("#notesDiv").append(data);
            toggleCategories(clickedCategory);
            addDeleteNoteButtonListeners();
            addEditNoteButtonListener();
        }
    });



}

function toggleCategories(categoryElm: Element){

    let categories = document.getElementsByClassName('category');

    for (let i = 0; i < categories.length; i++) {
        if(categoryElm === categories[i]) {

            categories[i].classList.add('selectedCategory');
        }else {
            categories[i].classList.remove('selectedCategory');
        }
    }


}

function deleteCategory(event: Event) {

    const item = event.target as Element;

    if(item.classList[0] === 'deleteCatButton') {

        let category = item.parentElement as HTMLElement;

        if(!category.classList.contains('selectedCategory')) {

            let categoryId: string = category.getAttribute('data-id') as string;

            $.ajax({
                async: false,
                type: "DELETE",
                url: context+'/Categories/delete?' + $.param({"categoryId": categoryId}),
                success: function (response) {
                    category.remove();
                }
            });

        }



        event.stopPropagation();

    }


}

function deleteNote(event: Event) {
    const item = (event as Event).target as Element;

    if(item.classList[0] === 'deleteNoteButton') {
        const note = item.parentElement as HTMLElement;

        let noteId: string = note.getAttribute("data-id") as string;

        console.log(noteId);

        $.ajax({
            async: false,
            type: "DELETE",
            url: context+'/Notes/delete?' + $.param({"noteId": noteId}),
            success: function (response) {
                note.remove();
                updateCategories();
            }
        });
    }
}

function updateCategories(){
    $.ajax({
        async: false,
        type: "GET",
        url: context+"/Categories",
        success: function (data) {
            $("#categoriesDiv").replaceWith(data);
            addCategoryListeners();

        }
    });
}