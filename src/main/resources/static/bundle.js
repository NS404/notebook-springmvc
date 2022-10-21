System.register("app", [], function (exports_1, context_1) {
    "use strict";
    var context, writeNoteButton, newCategoryButton, openNewNoteButton, closeNewNoteButton, newNotePopup, overlay;
    var __moduleName = context_1 && context_1.id;
    function closeNewNotePopup() {
        newNotePopup.classList.remove('active');
        overlay.classList.remove('active');
    }
    function openNewNotePopup() {
        newNotePopup.classList.add('active');
        overlay.classList.add('active');
    }
    function addDeleteCatButtonListeners() {
        $(".deleteCatButton").click(function () {
            // @ts-ignore
            deleteCategory(event);
        });
    }
    function addDeleteNoteButtonListeners() {
        $(".deleteNoteButton").click(function () {
            // @ts-ignore
            deleteNote(event);
        });
    }
    function addCategoryListeners() {
        $(".category").click(function () {
            // @ts-ignore
            clickCategory(event);
        });
        addDeleteCatButtonListeners();
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
            writeNoteButton = document.getElementById('writeNoteButton');
            writeNoteButton.addEventListener('click', createNote);
            newCategoryButton = document.getElementById('newCategoryButton');
            newCategoryButton.addEventListener('click', createCategory);
            openNewNoteButton = document.getElementById('openNewNoteButton');
            openNewNoteButton.addEventListener('click', openNewNotePopup);
            closeNewNoteButton = document.getElementById('closeNewNoteButton');
            closeNewNoteButton.addEventListener('click', closeNewNotePopup);
            newNotePopup = document.getElementById('newNoteDiv');
            overlay = document.getElementById('overlay');
            addCategoryListeners();
            addDeleteNoteButtonListeners();
        }
    };
});
//# sourceMappingURL=bundle.js.map