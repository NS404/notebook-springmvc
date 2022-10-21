
let context: string = "";

let writeNoteButton = document.getElementById('writeNoteButton') as HTMLButtonElement;
writeNoteButton.addEventListener('click', createNote);

let newCategoryButton = document.getElementById('newCategoryButton') as HTMLButtonElement;
newCategoryButton.addEventListener('click', createCategory);

let openNewNoteButton = document.getElementById('openNewNoteButton') as HTMLButtonElement;
openNewNoteButton.addEventListener('click', openNewNotePopup);

let closeNewNoteButton = document.getElementById('closeNewNoteButton') as HTMLButtonElement;
closeNewNoteButton.addEventListener('click',closeNewNotePopup);

let newNotePopup = document.getElementById('newNoteDiv') as HTMLElement;
let overlay = document.getElementById('overlay') as HTMLElement;

addCategoryListeners();

addDeleteNoteButtonListeners();



function closeNewNotePopup() {
    newNotePopup.classList.remove('active');
    overlay.classList.remove('active');
}

function openNewNotePopup() {
    newNotePopup.classList.add('active');
    overlay.classList.add('active');

}

function addDeleteCatButtonListeners(){

    $(".deleteCatButton").click(function() {
        // @ts-ignore
        deleteCategory(event);

    } )

}

function addDeleteNoteButtonListeners(){

    $(".deleteNoteButton").click(function() {
        // @ts-ignore
        deleteNote(event);
    });

}

function addCategoryListeners() {
    $(".category").click(function () {
        // @ts-ignore
        clickCategory(event);
    })
    addDeleteCatButtonListeners();
}

function createNote() {



        let noteTitleInput = document.getElementById('newNoteTitle') as HTMLInputElement
        let noteContentInput = document.getElementById('noteContentArea') as HTMLInputElement

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

        // category.remove();
        // if(selectedCategory.name === categoryName) {
        //     deSelectedCategory();
        // }
       // reRenderNotes(selectedCategory);

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