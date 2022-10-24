System.register("app", [], function (exports_1, context_1) {
    "use strict";
    var context, editMode, writeNoteButton, newCategoryButton, openNewNoteButton, closeNewNoteButton, newNotePopup, overlay;
    var __moduleName = context_1 && context_1.id;
    function closeNewNotePopup() {
        newNotePopup.classList.remove('active');
        overlay.classList.remove('active');
        document.getElementById("newNoteTitle").value = "";
        document.getElementById("noteContentArea").value = "";
    }
    function openNewNotePopup(event) {
        newNotePopup.classList.add('active');
        overlay.classList.add('active');
        if (editMode) {
            let noteElm = (event === null || event === void 0 ? void 0 : event.target).parentElement;
            let noteId = noteElm.getAttribute("data-id");
            let noteTitle = noteElm.querySelector(".noteTitle").innerText;
            let noteContent = noteElm.querySelector(".noteContent").innerText;
            document.getElementById("newNoteTitle").value = noteTitle;
            document.getElementById("noteContentArea").value = noteContent;
            writeNoteButton.innerText = "Edit";
            writeNoteButton.removeEventListener("click", createNote);
            writeNoteButton.addEventListener("click", function () {
                editNote(noteId);
            });
        }
        else {
            writeNoteButton.innerText = "Note";
            // @ts-ignore
            writeNoteButton.removeEventListener("click", editNote);
            writeNoteButton.addEventListener("click", createNote);
        }
    }
    function addEditNoteButtonListener() {
        $(".editNoteButton").click(function () {
            editMode = true;
            openNewNotePopup(event);
        });
    }
    function addEditCatButtonListener() {
        $(".editCatButton").click(function () {
            editCategory(event);
        });
    }
    function addDeleteCatButtonListeners() {
        $(".deleteCatButton").click(function () {
            deleteCategory(event);
        });
    }
    function addDeleteNoteButtonListeners() {
        $(".deleteNoteButton").click(function () {
            deleteNote(event);
        });
    }
    function addCategoryListeners() {
        $(".category").click(function () {
            clickCategory(event);
        });
        addDeleteCatButtonListeners();
    }
    function editNote(noteId) {
        let noteTitleInput = document.getElementById('newNoteTitle');
        let noteContentInput = document.getElementById('noteContentArea');
        if (noteTitleInput.value.trim().length && noteContentInput.value.trim().length) {
            let editedTitle = document.getElementById('newNoteTitle').value;
            document.getElementById('newNoteTitle').value = '';
            let editedContent = document.getElementById('noteContentArea').value;
            document.getElementById('noteContentArea').value = '';
            let noteElm = event.target.parentElement;
            let noteId = noteElm.getAttribute("data-id");
            $.ajax({
                async: false,
                type: "PUT",
                url: context + "/Notes/edit",
                data: { noteId: noteId, editedTitle: editedTitle, editedContent: editedContent },
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    noteElm.querySelector(".noteTitle").innerText = editedTitle;
                    noteElm.querySelector(".noteContent").innerText = editedContent;
                }
            });
        }
    }
    function editCategory(event) {
    }
    function createNote() {
        let noteTitleInput = document.getElementById('newNoteTitle');
        let noteContentInput = document.getElementById('noteContentArea');
        if (noteTitleInput.value.trim().length && noteContentInput.value.trim().length) {
            let noteTitle = document.getElementById('newNoteTitle').value;
            document.getElementById('newNoteTitle').value = '';
            let noteContent = document.getElementById('noteContentArea').value;
            document.getElementById('noteContentArea').value = '';
            $.ajax({
                async: false,
                type: "POST",
                data: { noteTitle: noteTitle, noteContent: noteContent },
                url: context + "/Notes/create",
                success: function (data) {
                    $("#notesDiv").replaceWith(data);
                    addDeleteNoteButtonListeners();
                    updateCategories();
                }
            });
        }
    }
    function createCategory() {
        let catNameInput = document.getElementById('newCategoryName');
        let categoryName = catNameInput.value;
        if (categoryName.trim().length) {
            catNameInput.value = '';
            $.post(context + "/Categories/create", { name: categoryName }, function (data, status) {
                $("#categoriesDiv").empty();
                $("#categoriesDiv").append(data);
                addCategoryListeners();
            });
        }
    }
    function clickCategory(e) {
        let clickedCategory = e.target;
        let categoryName = clickedCategory.querySelector('.categoryName').innerHTML;
        let categoryId = clickedCategory.getAttribute("data-id");
        console.log(categoryName.trim());
        $.ajax({
            async: false,
            type: "GET",
            url: context + "/Notes",
            data: { categoryName: categoryName },
            success: function (data) {
                $("#notesDiv").empty();
                $("#notesDiv").append(data);
                toggleCategories(clickedCategory);
                addDeleteNoteButtonListeners();
            }
        });
    }
    exports_1("clickCategory", clickCategory);
    function toggleCategories(categoryElm) {
        let categories = document.getElementsByClassName('category');
        for (let i = 0; i < categories.length; i++) {
            if (categoryElm === categories[i]) {
                categories[i].classList.add('selectedCategory');
            }
            else {
                categories[i].classList.remove('selectedCategory');
            }
        }
    }
    function deleteCategory(event) {
        const item = event.target;
        if (item.classList[0] === 'deleteCatButton') {
            let category = item.parentElement;
            if (!category.classList.contains('selectedCategory')) {
                let categoryId = category.getAttribute('data-id');
                $.ajax({
                    async: false,
                    type: "DELETE",
                    url: context + '/Categories/delete?' + $.param({ "categoryId": categoryId }),
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
    function deleteNote(event) {
        const item = event.target;
        if (item.classList[0] === 'deleteNoteButton') {
            const note = item.parentElement;
            let noteId = note.getAttribute("data-id");
            console.log(noteId);
            $.ajax({
                async: false,
                type: "DELETE",
                url: context + '/Notes/delete?' + $.param({ "noteId": noteId }),
                success: function (response) {
                    note.remove();
                    updateCategories();
                }
            });
        }
    }
    function updateCategories() {
        $.ajax({
            async: false,
            type: "GET",
            url: context + "/Categories",
            success: function (data) {
                $("#categoriesDiv").replaceWith(data);
                addCategoryListeners();
            }
        });
    }
    return {
        setters: [],
        execute: function () {
            context = "";
            editMode = false;
            writeNoteButton = document.getElementById('writeNoteButton');
            newCategoryButton = document.getElementById('newCategoryButton');
            newCategoryButton.addEventListener('click', createCategory);
            openNewNoteButton = document.getElementById('openNewNoteButton');
            openNewNoteButton.addEventListener('click', function () {
                editMode = false;
                openNewNotePopup();
            });
            closeNewNoteButton = document.getElementById('closeNewNoteButton');
            closeNewNoteButton.addEventListener('click', closeNewNotePopup);
            newNotePopup = document.getElementById('newNoteDiv');
            overlay = document.getElementById('overlay');
            addCategoryListeners();
            addDeleteNoteButtonListeners();
            addEditNoteButtonListener();
            addEditCatButtonListener();
            addEditCatButtonListener();
        }
    };
});
//# sourceMappingURL=bundle.js.map