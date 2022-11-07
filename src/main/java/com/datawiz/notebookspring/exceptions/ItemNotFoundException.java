package com.datawiz.notebookspring.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.NOT_FOUND, reason="No such Item")  // 404
 public class ItemNotFoundException extends RuntimeException {


 }