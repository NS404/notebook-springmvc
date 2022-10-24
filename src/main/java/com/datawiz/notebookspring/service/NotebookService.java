package com.datawiz.notebookspring.service;

import com.datawiz.notebookspring.model.Category;
import com.datawiz.notebookspring.model.Note;
import com.datawiz.notebookspring.repo.CategoryRepo;
import com.datawiz.notebookspring.repo.NoteRepo;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class NotebookService {

    private final CategoryRepo categoryRepo;

    private NoteRepo noteRepo;

    private List<Category> categories;

    private Category selectedCategory;



    public NotebookService(CategoryRepo categoryRepo, NoteRepo noteRepo){
        this.categoryRepo = categoryRepo;
        this.noteRepo = noteRepo;
        this.categories = (List<Category>) categoryRepo.findAll();
        this.selectedCategory = categories.get(0);
    }

    public Category getSelectedCategory() {
        return selectedCategory;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setSelectedCategory(Category selectedCategory) {
        this.selectedCategory = selectedCategory;
    }

    public void createCategory(String categoryName){
        Category newCategory = new Category(categoryName);
        Category category = categoryRepo.save(newCategory);
        categories.add(category);
    }

    public void createNote(String noteTitle, String noteContent){
        Note newNote = new Note(noteTitle, noteContent, selectedCategory);
        Note note  = noteRepo.save(newNote);
        selectedCategory.getNotes().add(note);
    }

    public Category selectCategory(String categoryName) {
        for (Category cat : categories) {
            if(categoryName.equals(cat.getName())){
                selectedCategory = cat;
                return cat;
            }
        }
        return null;
    }

    public void deleteNote(String noteId) {

        Note noteToDelete = null;

        for (Note note : selectedCategory.getNotes()) {
            if (Integer.parseInt(noteId) == note.getId()) {
                noteToDelete = note;
            }
        }
        assert noteToDelete != null;
        noteRepo.delete(noteToDelete);
        selectedCategory.getNotes().remove(noteToDelete);
    }


    public void deleteCategory(String categoryId) {

        Category categoryToDelete = null;

        for (Category cat :
                categories) {
            if (Integer.parseInt(categoryId) == cat.getId()) {
                categoryToDelete = cat;
            }
        }
            categoryRepo.delete(categoryToDelete);
            categories.remove(categoryToDelete);

    }

    public void editNote(String noteId, String editedTitle, String editedContent) {
        noteRepo.updateNote(editedTitle,editedContent,Integer.parseInt(noteId));
    }
}
