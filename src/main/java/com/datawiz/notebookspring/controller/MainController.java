package com.datawiz.notebookspring.controller;

import com.datawiz.notebookspring.model.Category;
import com.datawiz.notebookspring.model.Note;
import com.datawiz.notebookspring.service.NotebookService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class MainController {

    private NotebookService notebookService;

    public MainController(NotebookService notebookService){
        this.notebookService = notebookService;
        System.out.println("controller initialized");

    }

    @RequestMapping("/Notebook")
    public String display(Model model){

        List<Category> categories = notebookService.getCategories();
        Category selectedCategory = notebookService.getSelectedCategory();
        List<Note> notes = selectedCategory.getNotes();

        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategory", selectedCategory.getName());
        model.addAttribute("notes", notes);

        return "index";
    }

    @RequestMapping(value = "/Notes", method = RequestMethod.GET)
    public String selectCategory(@RequestParam String categoryName, Model model){

        Category selectCategory = notebookService.selectCategory(categoryName);

        model.addAttribute("notes", selectCategory.getNotes());

        return "notes-fragment :: notes";
    }

    @RequestMapping(value = "/Categories", method = RequestMethod.GET)
    public String updateCategories(Model model){

        List<Category> categories = notebookService.getCategories();
        Category selectedCategory = notebookService.getSelectedCategory();

        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategory", selectedCategory.getName());

        return "categories-fragment :: cats";

    }


    @RequestMapping(value = "/Categories/create", method = RequestMethod.POST)
    public String createCategory(@RequestParam String name, Model model){

        notebookService.createCategory(name);
        model.addAttribute("categories", notebookService.getCategories());
        model.addAttribute("selectedCategory", notebookService.getSelectedCategory().getName());

        return "categories-fragment :: cats";
    }

    @RequestMapping(value = "/Categories/edit", method = RequestMethod.PUT)
    public String editCategory(@RequestParam String categoryId, @RequestParam String editedName, Model model){

        notebookService.editCategory(categoryId, editedName);

        model.addAttribute("categories", notebookService.getCategories());

        return "categories-fragment :: cats";
    }

    @RequestMapping(value = "Categories/delete", method = RequestMethod.DELETE)
    public String deleteCategory(@RequestParam String categoryId, Model model){

        notebookService.deleteCategory(categoryId);
        model.addAttribute("categories", notebookService.getCategories());

        return "categories-fragment :: cats";

    }

    @RequestMapping(value="/Notes/create", method = RequestMethod.POST)
    public String createNote(@RequestParam String noteTitle, @RequestParam String noteContent, Model model){

        notebookService.createNote(noteTitle, noteContent);
        model.addAttribute("notes",notebookService.getSelectedCategory().getNotes());

        return "notes-fragment :: notes";
    }

    @RequestMapping(value = "/Notes/delete", method = RequestMethod.DELETE)
    public String deleteNote(@RequestParam String noteId, Model model){

        notebookService.deleteNote(noteId);
        model.addAttribute("notes", notebookService.getSelectedCategory().getNotes());

        return "notes-fragment :: notes";

    }

    @RequestMapping(value = "Notes/edit", method = RequestMethod.PUT)
    public String editNote(@RequestParam String noteId,
                           @RequestParam String editedTitle,
                           @RequestParam String editedContent,
                            Model model){

        notebookService.editNote(noteId,editedTitle,editedContent);

        model.addAttribute("notes", notebookService.getSelectedCategory().getNotes());

        return "notes-fragment :: notes";

    }
}
