const express = require("express");
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const { Todo } = require("../models");


// @desc      Get todos
// @route     GET /api/v1/todos
// @access    Public
exports.getTodos = async (req, res, next) => {
  try{
    const todos = await Todo.findAll();
    res.send(todos);
  }
  catch(err){
    res.send(err);
  }
};


// @desc      Get single todo
// @route     GET /api/v1/todos/:id
// @access    Public
exports.getTodo = asyncHandler(async (req, res, next) => {
  try{
    const todo = await Todo.findByPk(req.params.id)
    if(!todo) return res.status(404).send("todo not found");
    res.send(todo);
  }
  catch(err){
    res.send(err);
  }
})

// @desc      Add todo
// @route     POST /api/v1/todos
// @access    Private
exports.addTodo = asyncHandler(async (req, res, next) => {
  // req.body.user = req.user.id;
  const todo = await Todo.create(req.body);
  res.send(todo);
})

// @desc      Update todo
// @route     PUT /api/v1/todos/:id
// @access    Private
exports.updateTodo = async (req, res, next) => {
  try{
    const todos = await Todo.findAll();
    res.send(todos);
  }
  catch(err){
    res.send(err);
  }
};

// @desc      Delete todo
// @route     DELETE /api/v1/todos/:id
// @access    Private
exports.deleteTodo = async (req, res, next) => {
  try{
    const todos = await Todo.findAll();
    res.send(todos);
  }
  catch(err){
    res.send(err);
  }
};
